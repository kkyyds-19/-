import { AnimationClip } from 'cc'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { SPIKE_COUNT_ENUM } from '../../Enums'
import SpikesSubStateMachine from './SpikesSubStateMachine'

const BASE_URL = 'texture/spikes/spikesthree'

export default class SpikesThreeSubStateMachine extends SpikesSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.starteMachines.set(SPIKE_COUNT_ENUM.ZERO, new State(fsm, `${BASE_URL}/zero`, AnimationClip.WrapMode.Normal))
    this.starteMachines.set(SPIKE_COUNT_ENUM.ONE, new State(fsm, `${BASE_URL}/one`, AnimationClip.WrapMode.Normal))
    this.starteMachines.set(SPIKE_COUNT_ENUM.TWO, new State(fsm, `${BASE_URL}/two`, AnimationClip.WrapMode.Normal))
    this.starteMachines.set(SPIKE_COUNT_ENUM.THREE, new State(fsm, `${BASE_URL}/three`, AnimationClip.WrapMode.Normal))
    this.starteMachines.set(SPIKE_COUNT_ENUM.FOUR, new State(fsm, `${BASE_URL}/four`, AnimationClip.WrapMode.Normal))
  }
}

