/**
 * DoorStateMachine 门状态机
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-06
 */
import { _decorator, Animation } from 'cc'
import { ENTITY_STATE_ENUM, getParamKey } from '../../Enums'
import { getInitParmesNumber, getInitParmesTrigger, StateMachine } from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'
import DoorSubStateMachine from './DoorSubStateMachine'

const { ccclass } = _decorator

@ccclass('DoorStateMachine')
export class DoorStateMachine extends StateMachine {
  private idleSubStateMachine: IdleSubStateMachine
  private doorSubStateMachine: DoorSubStateMachine

  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams() {
    // 初始化IDLE触发参数
    this.params.set(getParamKey('IDLE'), getInitParmesTrigger())
    // 初始化方向参数
    this.params.set(getParamKey('DIRECTION'), getInitParmesNumber())
    // 初始化死亡触发参数
    this.params.set(getParamKey('DEATH'), getInitParmesTrigger())
  }

  initStateMachines() {
    // 初始化待机子状态机
    this.idleSubStateMachine = new IdleSubStateMachine(this)
    // 初始化开门/死亡子状态机
    this.doorSubStateMachine = new DoorSubStateMachine(this)
  }

  initAnimationEvent() {
    return
  }

  run() {
    const idle = this.getParames(getParamKey('IDLE'))
    const death = this.getParames(getParamKey('DEATH'))

    if (death) {
      this.doorSubStateMachine.run()
    } else if (idle) {
      this.idleSubStateMachine.run()
    } else {
      this.idleSubStateMachine.run()
    }

    // 重置所有触发器参数
    this.resetTrigger()
  }
}
