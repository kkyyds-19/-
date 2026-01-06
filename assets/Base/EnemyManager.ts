/**
 * 敌人基类管理器
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-06
 */
import { _decorator } from 'cc'
import EventManager from '../Runtime/EventManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../Enums'
import { EntityManager } from './EntityManager'
import DateManager from '../Runtime/DateManager'

const { ccclass } = _decorator

@ccclass('EnemyManager')
export abstract class EnemyManager extends EntityManager {
  /**
   * 初始化敌人
   * @param params 实体配置参数
   */
  async init(
    params?: Partial<{
      x: number
      y: number
      type: ENTITY_TYPE_ENUM
      direction: DIRECTION_ENUM
      state: ENTITY_STATE_ENUM
    }>,
  ) {
    // 调用父类初始化
    await super.init(params)

    // 监听玩家出生事件，玩家出生后尝试改变朝向
    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection, this)
    // 监听玩家移动结束事件，玩家移动后尝试改变朝向
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection, this)
    // 监听攻击敌人事件
    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this)

    // 如果玩家已经出生，直接触发一次转向逻辑
    if (DateManager.Instance.player) {
      this.onChangeDirection()
    }
  }

  /**
   * 销毁时移除事件监听
   */
  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDirection)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead)
  }

  /**
   * 改变朝向逻辑
   * 根据玩家位置调整敌人朝向
   */
  onChangeDirection() {
    // 如果敌人已死亡或玩家不存在，则不执行
    if (this.state === ENTITY_STATE_ENUM.DEATH || !DateManager.Instance.player) {
      return
    }
    const { x: playerX, y: playerY } = DateManager.Instance.player

    const disX = Math.abs(this.x - playerX)
    const disY = Math.abs(this.y - playerY)

    // 简单的追逐逻辑：根据X/Y轴距离差决定优先朝向
    if (playerX >= this.x && playerY <= this.y) {
      this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.RIGHT
    } else if (playerX <= this.x && playerY <= this.y) {
      this.direction = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.LEFT
    } else if (playerX >= this.x && playerY > this.y) {
      this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.RIGHT
    } else if (playerX <= this.x && playerY > this.y) {
      this.direction = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.LEFT
    }
  }

  /**
   * 死亡逻辑
   * @param id 被攻击的实体ID
   */
  onDead(id: string) {
    // 如果已经死亡，直接返回
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }

    // 如果ID匹配，则执行死亡状态切换
    if (this.id === id) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}
