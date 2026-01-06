/**
 * 木骷髅管理器
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-06
 */
import { _decorator } from 'cc'
import EventManager from '../../Runtime/EventManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums'
import { EnemyManager } from '../../Base/EnemyManager'
import DateManager from '../../Runtime/DateManager'
import { WoodenSkeletonStateMachine } from '../WoodenSkeleton/WoodenSkeletonStateMachine'
import { EntityManager } from '../../Base/EntityManager'
import { BurstStateMachine } from './BurstStateMachine'

const { ccclass } = _decorator

@ccclass('BurstManager')
export class BurstManager extends EntityManager {
  /**
   * 初始化木骷髅
   * 设置状态机并调用父类初始化
   */
  async init() {
    this.fsm = this.addComponent(BurstStateMachine)
    await this.fsm.init()

    // 调用父类初始化，传入木骷髅特定的初始参数
    await super.init({
      x: 2,
      y: 4,
      type: ENTITY_TYPE_ENUM.SKELETON_WOODEN,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })

    // 监听玩家移动结束事件，尝试攻击
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }

  /**
   * 销毁时移除特定事件监听，并调用父类销毁
   */
  onDestroy() {
    super.onDestroy()
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
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
