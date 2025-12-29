import { _decorator, Animation } from 'cc'
import { PARAME_NAME_ENUM, getParamKey } from '../../Enums'
import { getInitParmesNumber, getInitParmesTrigger, StateMachine } from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine'
import TurnRightSubStateMachine from './TurnRightSubStateMachine'
const { ccclass, property } = _decorator

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
  private idleSubStateMachine: IdleSubStateMachine
  private turnLeftSubStateMachine: TurnLeftSubStateMachine
  private turnRightSubStateMachine: TurnRightSubStateMachine

  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(getParamKey('IDLE'), getInitParmesTrigger())
    this.params.set(getParamKey('TURNLEFT'), getInitParmesTrigger())
    this.params.set(getParamKey('TURNRIGHT'), getInitParmesTrigger())
    this.params.set(getParamKey('DIRECTION'), getInitParmesNumber())
  }

  initStateMachines() {
    this.idleSubStateMachine = new IdleSubStateMachine(this)
    this.turnLeftSubStateMachine = new TurnLeftSubStateMachine(this)
    this.turnRightSubStateMachine = new TurnRightSubStateMachine(this)
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['turn']
      if (whiteList.some(v => name.includes(v))) {
        this.setParames(PARAME_NAME_ENUM.IDLE, true)
      }
    })
  }

  run() {
    const turnLeft = this.getParames(getParamKey('TURNLEFT'))
    const turnRight = this.getParames(getParamKey('TURNRIGHT'))
    const idle = this.getParames(getParamKey('IDLE'))
    if (turnLeft) {
      this.turnLeftSubStateMachine.run()
    } else if (turnRight) {
      this.turnRightSubStateMachine.run()
    } else if (idle) {
      this.idleSubStateMachine.run()
    } else {
      this.idleSubStateMachine.run()
    }
    this.resetTrigger()
  }
}
