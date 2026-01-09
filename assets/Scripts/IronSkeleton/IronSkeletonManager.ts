/**
 * 木骷髅管理器
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-06
 */
import { _decorator } from 'cc'
import { ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enums'
import { EnemyManager } from '../../Base/EnemyManager'
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine'
import EventManager from '../../Runtime/EventManager'
import DateManager from '../../Runtime/DateManager'
import { IEntity } from '../../Levels'

const { ccclass } = _decorator

@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
  async init(params: IEntity) {
    this.fsm = this.addComponent(IronSkeletonStateMachine)
    await this.fsm.init()

    // 使用关卡配置的敌人参数进行初始化
    await super.init(params)

    // 监听玩家移动结束事件，尝试攻击
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }

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
