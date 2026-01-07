/**
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-05
 */
import { AnimationClip } from 'cc'
import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { PARAME_NAME_ENUM, SPIKE_COUNT_ENUM } from '../../Enums'
import { SubStateMachine } from '../../Base/SubStateMachine'
import SpikesSubStateMachine from './SpikesSubStateMachine'

const BASE_URL = 'texture/spikes/spikestwo'

export default class SpilkesTwoSubStateMachine extends SpikesSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.starteMachines.set(SPIKE_COUNT_ENUM.ZERO, new State(fsm, `${BASE_URL}/zero`, AnimationClip.WrapMode.Normal))
    this.starteMachines.set(SPIKE_COUNT_ENUM.ONE, new State(fsm, `${BASE_URL}/one`, AnimationClip.WrapMode.Normal))
    this.starteMachines.set(SPIKE_COUNT_ENUM.TWO, new State(fsm, `${BASE_URL}/two`, AnimationClip.WrapMode.Normal))
    this.starteMachines.set(SPIKE_COUNT_ENUM.THREE, new State(fsm, `${BASE_URL}/three`, AnimationClip.WrapMode.Normal))
  }
}
