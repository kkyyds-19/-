/**
 * DoorManager 门实体管理器
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-06
 */
import { _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums'
import { EntityManager } from '../../Base/EntityManager'
import { DoorStateMachine } from './DoorStateMachine'
import EventManager from '../../Runtime/EventManager'
import DateManager from '../../Runtime/DateManager'
import { IEntity } from '../../Levels'

const { ccclass } = _decorator

@ccclass('DoorManager')
export class DoorManager extends EntityManager {
  async init(params: Partial<IEntity>) {
    this.fsm = this.addComponent(DoorStateMachine)
    await this.fsm.init()
    // 门初始位置设为 (2,0) 或根据实际关卡调整，此处设为 (0,0) 作为演示，具体由 BattleManager 生成时覆盖
    await super.init({
      ...params,
      type: ENTITY_TYPE_ENUM.DOOR,
    })

    EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this)
  }

  onOpen() {
    if (
      DateManager.Instance.enemies.every(enemy => enemy.state === ENTITY_STATE_ENUM.DEATH) &&
      this.state !== ENTITY_STATE_ENUM.DEATH
    ) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}
