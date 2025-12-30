import { DIRECTION_ORDER_ENUM, PARAME_NAME_ENUM } from '../Enums'
import { SubStateMachine } from './SubStateMachine'

const BASE_URL = 'texture/player/turnleft'
export default class DirectionSubStateMachine extends SubStateMachine {
  run() {
    const value = this.getParams(PARAME_NAME_ENUM.DIRECTION)
    this.currentState = this.starteMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }
}
