import State from './State'
import { StateMachine } from './StateMachine'

type ParamsValueType = boolean | number

export abstract class SubStateMachine {
  private _currentState: State = null

  starteMachines: Map<string, State> = new Map()

  constructor(public fsm: StateMachine) {}

  getParams(paramsName: string) {
    return this.fsm.getParames(paramsName)
  }

  setParams(paramsName: string, value: ParamsValueType) {
    this.fsm.setParames(paramsName, value)
  }

  get currentState() {
    return this._currentState
  }

  set currentState(newState: State) {
    this._currentState = newState
    this._currentState.run()
  }

  abstract run(): void
}
