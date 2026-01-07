/**
 * 木骷髅攻击子状态机
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-05
 */
import { AnimationClip } from 'cc'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { PARAME_NAME_ENUM, SPIKE_COUNT_ENUM } from '../../Enums'
import { SubStateMachine } from '../../Base/SubStateMachine'

const BASE_URL = 'texture/spikes/spikesone'

export default class SpikesOneSubStateMachine extends SubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.starteMachines.set(SPIKE_COUNT_ENUM.ZERO, new State(fsm, `${BASE_URL}/zero`, AnimationClip.WrapMode.Normal))
    this.starteMachines.set(SPIKE_COUNT_ENUM.ONE, new State(fsm, `${BASE_URL}/one`, AnimationClip.WrapMode.Normal))
    this.starteMachines.set(SPIKE_COUNT_ENUM.TWO, new State(fsm, `${BASE_URL}/two`, AnimationClip.WrapMode.Normal))
  }

  run() {
    const value = this.getParams(PARAME_NAME_ENUM.SPIKES_CUR_COUNT) as number
    let key = SPIKE_COUNT_ENUM.ZERO
    if (value === 1) {
      key = SPIKE_COUNT_ENUM.ONE
    } else if (value === 2) {
      key = SPIKE_COUNT_ENUM.TWO
    }
    this.currentState = this.starteMachines.get(key)
  }
}
