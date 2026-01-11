/**
 * 地裂（陷阱）管理器
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-06
 */
import { _decorator, UITransform } from 'cc'
import EventManager from '../../Runtime/EventManager'
import { ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums'
import DateManager from '../../Runtime/DateManager'
import { EntityManager } from '../../Base/EntityManager'
import { IEntity } from '../../Levels'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tlie/TileManager'
import { BurstStateMachine } from './BurstStateMachine'

const { ccclass } = _decorator

@ccclass('BurstManager')
export class BurstManager extends EntityManager {
  /**
   * 初始化地裂（陷阱）
   * 设置状态机并调用父类初始化
   */
  async init(params: IEntity) {
    this.fsm = this.addComponent(BurstStateMachine)
    await this.fsm.init()
    await super.init({
      ...params,
      type: ENTITY_TYPE_ENUM.BURST,
    })
    const transform = this.getComponent(UITransform)
    if (transform) {
      transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    }

    // 监听玩家移动结束事件，尝试攻击
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this)
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT)
  }

  /**
   * 销毁时移除特定事件监听
   */
  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onBurst, this)
  }
  /**
   * 攻击逻辑
   * 检查是否在攻击范围内并执行攻击
   */
  onBurst() {
    if (this.state === ENTITY_STATE_ENUM.DEATH || !DateManager.Instance.player) {
      return
    }
    const { x: playerX, y: playerY } = DateManager.Instance.player

    if (this.x === playerX && this.y === playerY && this.state === ENTITY_STATE_ENUM.IDLE) {
      this.state = ENTITY_STATE_ENUM.ATTACK
    } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
      this.state = ENTITY_STATE_ENUM.DEATH
      if (this.x === playerX && this.y === playerY) {
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIRDEATH)
      }
    }
  }
}
