import { _decorator, AnimationClip, Component, Node, Animation, SpriteFrame } from 'cc'
import { FSM_PARAMS_TYPE_ENUM, PARAME_NAME_ENUM, getParamKey } from '../../Enums'
import State from '../../Base/State'
import { getInitParmesNumber, getInitParmesTrigger, StateMachine } from '../../Base/StateMachine'
const { ccclass, property } = _decorator



@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStarteMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(getParamKey('IDLE'), getInitParmesTrigger())
    this.params.set(getParamKey('TURNLEFT'), getInitParmesTrigger())
    this.params.set(getParamKey('DIRECTION'), getInitParmesNumber())
  }

  initStarteMachines() {
    this.starteMachines.set(
      getParamKey('IDLE'),
      new State(this, 'texture/player/idle/top', AnimationClip.WrapMode.Loop),
    )
    this.starteMachines.set(getParamKey('TURNLEFT'), new State(this, 'texture/player/turnleft/top'))
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
    const idle = this.getParames(getParamKey('IDLE'))
    if (turnLeft) {
      this.currentState = this.starteMachines.get(getParamKey('TURNLEFT'))
    } else if (idle) {
      this.currentState = this.starteMachines.get(getParamKey('IDLE'))
    } else {
      this.currentState = this.starteMachines.get(getParamKey('IDLE'))
    }
    this.resetTrigger()
  }
}
