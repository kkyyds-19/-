import State from '../../Base/State'
import { StateMachine } from '../../Base/StateMachine'
import { SubStateMachine } from '../../Base/SubStateMachine'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAME_NAME_ENUM } from '../../Enums'

const BASE_URL = 'texture/player/airdeath'
export default class AirFeathSubStateMachine extends SubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.starteMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`))
    this.starteMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`))
    this.starteMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`))
    this.starteMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`))
  }

  run() {
    const value = this.getParams(PARAME_NAME_ENUM.DIRECTION)
    this.currentState = this.starteMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }
}
