import { _decorator } from 'cc'
import EventManager from '../../Runtime/EventManager'
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums'
import { EntityManager } from '../../Base/EntityManager'
import { PlayerStateMachine } from './PlayerStateMachine'
import DateManager from '../../Runtime/DateManager'
import { IEntity } from '../../Levels'
const { ccclass } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  tragetX = 0
  tragetY = 0
  isMoving = false
  private readonly speed = 1 / 10

  async init(params: Partial<IEntity>) {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    await super.init({
      ...params,
      type: ENTITY_TYPE_ENUM.PLAYER,
    })
    this.tragetX = this.x
    this.tragetY = this.y

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_PLAYER, this.onDead, this)
  }

  update() {
    this.updateXY()
    super.update()
  }
  updateXY() {
    if (this.tragetX < this.x) {
      this.x -= this.speed
    } else if (this.tragetX > this.x) {
      this.x += this.speed
    } else if (this.tragetY < this.y) {
      this.y -= this.speed
    } else if (this.tragetY > this.y) {
      this.y += this.speed
    }
    if (Math.abs(this.tragetX - this.x) <= 0.1 && Math.abs(this.tragetY - this.y) <= 0.1 && this.isMoving) {
      this.x = this.tragetX
      this.y = this.tragetY
      this.isMoving = false
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }
  }

  inputHandle(inputDirection: CONTROLLER_ENUM) {
    if (this.isMoving) {
      return
    }
    if (
      this.state === ENTITY_STATE_ENUM.DEATH ||
      this.state === ENTITY_STATE_ENUM.AIRDEATH ||
      this.state === ENTITY_STATE_ENUM.ATTACK
    ) {
      return
    }
    if (inputDirection === CONTROLLER_ENUM.ATTACK) {
      this.state = ENTITY_STATE_ENUM.ATTACK
      return
    }
    const id = this.willAtttack(inputDirection)
    if (id) {
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, id)
      EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
      return
    }
    if (this.willBlock(inputDirection)) {
      if (
        inputDirection === CONTROLLER_ENUM.TOP ||
        inputDirection === CONTROLLER_ENUM.BOTTOM ||
        inputDirection === CONTROLLER_ENUM.LEFT ||
        inputDirection === CONTROLLER_ENUM.RIGHT
      ) {
        this.state = ENTITY_STATE_ENUM.BLOCKFRONT
      }
      return
    }

    this.move(inputDirection)
  }

  onDead(type: ENTITY_STATE_ENUM) {
    if (this.state === ENTITY_STATE_ENUM.DEATH || this.state === ENTITY_STATE_ENUM.AIRDEATH) {
      return
    }
    this.isMoving = false
    this.tragetX = this.x
    this.tragetY = this.y
    this.state = type
  }

  move(inputDirection: CONTROLLER_ENUM) {
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.tragetY -= 1
      this.isMoving = true
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.tragetY += 1
      this.isMoving = true
    } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
      this.tragetX -= 1
      this.isMoving = true
    } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
      this.tragetX += 1
      this.isMoving = true
    } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      this.isMoving = false
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.TOP
      }
      this.state = ENTITY_STATE_ENUM.TURNLEFT

      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    } else if (inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
      this.isMoving = false
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.TOP
      }
      this.state = ENTITY_STATE_ENUM.TURNRIGHT

      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
    }
  }

  /**
   * 攻击判定逻辑
   * @param inputDirection 当前输入的移动方向
   * @returns 被攻击目标的ID，如果没有则返回空字符串
   */
  willAtttack(inputDirection: CONTROLLER_ENUM) {
    // 1. 过滤掉已经死亡的敌人
    const enemies = DateManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH)

    for (let i = 0; i < enemies.length; i++) {
      const { x: enemyX, y: enemyY, id: enemyId } = enemies[i]

      // 2. 核心判定条件：
      // - 输入方向必须与人物当前朝向一致（确保只有面朝敌人“走”过去时才触发攻击）
      // - 敌人必须在玩家移动路径的正前方两格（相邻两格才允许攻击）
      const isTopAttack =
        inputDirection === CONTROLLER_ENUM.TOP &&
        this.direction === DIRECTION_ENUM.TOP &&
        enemyX === this.x &&
        enemyY === this.y - 2
      const isBottomAttack =
        inputDirection === CONTROLLER_ENUM.BOTTOM &&
        this.direction === DIRECTION_ENUM.BOTTOM &&
        enemyX === this.x &&
        enemyY === this.y + 2
      const isLeftAttack =
        inputDirection === CONTROLLER_ENUM.LEFT &&
        this.direction === DIRECTION_ENUM.LEFT &&
        enemyY === this.y &&
        enemyX === this.x - 2
      const isRightAttack =
        inputDirection === CONTROLLER_ENUM.RIGHT &&
        this.direction === DIRECTION_ENUM.RIGHT &&
        enemyY === this.y &&
        enemyX === this.x + 2

      if (isTopAttack || isBottomAttack || isLeftAttack || isRightAttack) {
        // 判定成功，切换到攻击状态并返回目标ID
        this.state = ENTITY_STATE_ENUM.ATTACK
        return enemyId
      }
    }
    return ''
  }

  willBlock(inputDirection: CONTROLLER_ENUM) {
    const { x, y, direction } = this
    const { tileInfo } = DateManager.Instance
    const enemies = DateManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH)

    let nextX = x
    let nextY = y
    let nextDirection = direction

    // 1. 预计算下一步的 坐标 和 朝向
    // 注意：在 tileInfo 二维数组中，y 代表行(Row)，x 代表列(Column)
    // y-1 表示向上移动（行号减小），y+1 表示向下移动（行号增加）
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      nextY -= 1
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      nextY += 1
    } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
      nextX -= 1
    } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
      nextX += 1
    } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      // 逆时针旋转：上 -> 左 -> 下 -> 右 -> 上
      if (direction === DIRECTION_ENUM.TOP) {
        nextDirection = DIRECTION_ENUM.LEFT
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextDirection = DIRECTION_ENUM.BOTTOM
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        nextDirection = DIRECTION_ENUM.RIGHT
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextDirection = DIRECTION_ENUM.TOP
      }
    } else if (inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
      // 顺时针旋转：上 -> 右 -> 下 -> 左 -> 上
      if (direction === DIRECTION_ENUM.TOP) {
        nextDirection = DIRECTION_ENUM.RIGHT
      } else if (direction === DIRECTION_ENUM.RIGHT) {
        nextDirection = DIRECTION_ENUM.BOTTOM
      } else if (direction === DIRECTION_ENUM.BOTTOM) {
        nextDirection = DIRECTION_ENUM.LEFT
      } else if (direction === DIRECTION_ENUM.LEFT) {
        nextDirection = DIRECTION_ENUM.TOP
      }
    }

    // 2. 检查 玩家本体 是否碰到 门
    // 特殊逻辑：如果碰到门且门已打开，则忽略地形阻挡，直接放行（因为门可能放在墙上）
    const door = DateManager.Instance.door
    if (door && door.x === nextX && door.y === nextY) {
      if (door.state !== ENTITY_STATE_ENUM.DEATH) {
        this.state = ENTITY_STATE_ENUM.BLOCKFRONT
        return true
      }
      return false
    }

    // 3. 检查 玩家本体 是否碰到墙壁 (Tile)
    // 注意：需要使用 nextX/nextY 检测移动后的位置
    // ?. 可选链防止数组越界报错
    const playerTile = tileInfo[nextX]?.[nextY]
    if (!playerTile || !playerTile.moveable) {
      this.state = ENTITY_STATE_ENUM.BLOCKFRONT
      return true
    }

    // 4. 检查 武器/前方 是否碰到墙壁
    // 武器位置基于 玩家新位置 + 新朝向 计算
    // 这里的 DIRECTION_ENUM 决定了武器相对于人物的偏移量
    let weaponNextX = nextX
    let weaponNextY = nextY

    // 2.1 检查 玩家本体 是否碰到 敌人
    if (enemies.find(v => v.x === nextX && v.y === nextY)) {
      this.state = ENTITY_STATE_ENUM.BLOCKFRONT
      return true
    }

    if (nextDirection === DIRECTION_ENUM.TOP) {
      weaponNextY -= 1 // 武器在人物上方一格
    } else if (nextDirection === DIRECTION_ENUM.BOTTOM) {
      weaponNextY += 1 // 武器在人物下方一格
    } else if (nextDirection === DIRECTION_ENUM.LEFT) {
      weaponNextX -= 1 // 武器在人物左方一格
    } else if (nextDirection === DIRECTION_ENUM.RIGHT) {
      weaponNextX += 1 // 武器在人物右方一格
    }

    const weaponTile = tileInfo[weaponNextX]?.[weaponNextY]
    if (!weaponTile || !weaponTile.moveable) {
      this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT
      return true
    }

    return false
  }
}
