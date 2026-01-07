/**
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-05
 */
import { PARAME_NAME_ENUM, SPIKE_COUNT_ENUM } from '../../Enums'
import { SubStateMachine } from '../../Base/SubStateMachine'

export default class SpikesSubStateMachine extends SubStateMachine {
  run() {
    const value = this.getParams(PARAME_NAME_ENUM.SPIKES_CUR_COUNT) as number
    let key = SPIKE_COUNT_ENUM.ZERO
    if (value === 1) {
      key = SPIKE_COUNT_ENUM.ONE
    } else if (value === 2) {
      key = SPIKE_COUNT_ENUM.TWO
    } else if (value === 3) {
      key = SPIKE_COUNT_ENUM.THREE
    } else if (value === 4) {
      key = SPIKE_COUNT_ENUM.FOUR
    } else if (value >= 5) {
      key = SPIKE_COUNT_ENUM.FIVE
    }
    this.currentState = this.starteMachines.get(key)
  }
}
