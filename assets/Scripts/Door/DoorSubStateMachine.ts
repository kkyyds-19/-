/**
 * DoorSubStateMachine 门开门/死亡动画子状态机
 * @cocos_version Cocos Creator 3.x
 */
import { AnimationClip } from 'cc'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { SubStateMachine } from '../../Base/SubStateMachine'

const BASE_URL = 'texture/door/death'

export default class DoorSubStateMachine extends SubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.starteMachines.set('DEATH', new State(fsm, BASE_URL, AnimationClip.WrapMode.Normal))
  }

  run() {
    this.currentState = this.starteMachines.get('DEATH')
  }
}
