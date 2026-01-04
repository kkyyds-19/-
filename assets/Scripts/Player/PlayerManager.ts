import { _decorator } from 'cc'
import EventManager from '../../Runtime/EventManager'
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enums'
import { EntityManager } from '../../Base/EntityManager'
import { PlayerStateMachine } from './PlayerStateMachine'
import DateManager from '../../Runtime/DateManager'
const { ccclass } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  tragetX: number = 2
  tragetY: number = 8
  private readonly speed = 1 / 10

  async init() {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    await super.init({ x: 2, y: 8, direction: DIRECTION_ENUM.TOP, state: ENTITY_STATE_ENUM.IDLE })

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
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
    if (Math.abs(this.tragetX - this.x) <= 0.1 && Math.abs(this.tragetY - this.y) <= 0.1) {
      this.x = this.tragetX
      this.y = this.tragetY
    }
  }

  inputHandle(inputDirection: CONTROLLER_ENUM) {
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

  move(inputDirection: CONTROLLER_ENUM) {
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.tragetY -= 1
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.tragetY += 1
    } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
      this.tragetX -= 1
    } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
      this.tragetX += 1
    } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.TOP
      }

      EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
      this.state = ENTITY_STATE_ENUM.TURNLEFT
    } else if (inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
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
    }
  }
  willBlock(inputDirection: CONTROLLER_ENUM) {
    const { x, y, direction } = this
    const { tileInfo } = DateManager.Instance

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

    // 2. 检查 玩家本体 是否碰到墙壁 (Tile)
    // 注意：需要使用 nextX/nextY 检测移动后的位置
    // ?. 可选链防止数组越界报错
    const playerTile = tileInfo[nextX]?.[nextY]
    if (!playerTile || !playerTile.moveable) {
      this.state = ENTITY_STATE_ENUM.BLOCKFRONT
      return true
    }

    // 3. 检查 武器/前方 是否碰到墙壁
    // 武器位置基于 玩家新位置 + 新朝向 计算
    // 这里的 DIRECTION_ENUM 决定了武器相对于人物的偏移量
    let weaponNextX = nextX
    let weaponNextY = nextY

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
