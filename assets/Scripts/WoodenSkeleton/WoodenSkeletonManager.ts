/**
 * 木骷髅管理器
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-06
 */
import { _decorator } from 'cc'
import EventManager from '../../Runtime/EventManager'
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enums'
import { EnemyManager } from '../../Base/EnemyManager'
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine'
import DateManager from '../../Runtime/DateManager'
import { IEntity } from '../../Levels'

const { ccclass } = _decorator

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {
  /**
   * 初始化木骷髅
   * 设置状态机并调用父类初始化
   */
  async init(params: IEntity) {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine)
    await this.fsm.init()

    // 调用父类初始化，直接使用关卡中配置的实体参数
    await super.init(params)

    // 监听玩家移动结束事件，尝试攻击
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }

  /**
   * 销毁时移除特定事件监听，并调用父类销毁
   */
  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }

  /**
   * 攻击逻辑
   * 检查是否在攻击范围内并执行攻击
   */
  onAttack() {
    if (this.state === ENTITY_STATE_ENUM.DEATH || !DateManager.Instance.player) {
      return
    }
    const { x: playerX, y: playerY, state: playerState } = DateManager.Instance.player

    // 如果玩家已死亡，则跳过攻击判定
    if (playerState === ENTITY_STATE_ENUM.DEATH) {
      this.state = ENTITY_STATE_ENUM.IDLE
      return
    }

    // 检查是否在攻击范围内（相邻一格）
    if (
      (this.x === playerX && Math.abs(this.y - playerY) <= 1) ||
      (this.y === playerY && Math.abs(this.x - playerX) <= 1)
    ) {
      this.state = ENTITY_STATE_ENUM.ATTACK
      // 触发攻击玩家事件，导致玩家死亡
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    } else {
      this.state = ENTITY_STATE_ENUM.IDLE
    }
  }
}
