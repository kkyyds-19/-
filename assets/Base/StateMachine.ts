import { _decorator, AnimationClip, Component, Node, Animation, SpriteFrame } from 'cc'

import State from './State'
import { EVENT_ENUM, FSM_PARAMS_TYPE_ENUM } from '../Enums'
import EventManager from '../Runtime/EventManager'
const { ccclass, property } = _decorator

type ParamsValueType = boolean | number

export interface IParamsValue {
  type: FSM_PARAMS_TYPE_ENUM
  value: ParamsValueType
}

export const getInitParmesTrigger = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value: false,
  }
}

export const getInitParmesNumber = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.NUMBER,
    value: 0,
  }
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  private _currentState: State = null
  params: Map<string, IParamsValue> = new Map()
  starteMachines: Map<string, State> = new Map()
  animationComponent: Animation
  waitingList: Array<Promise<SpriteFrame[]>> = []

  getParames(paramsName: string) {
    if (this.params.has(paramsName)) {
      return this.params.get(paramsName).value
    }
  }

  setParames(paramsName: string, value: ParamsValueType) {
    if (this.params.has(paramsName)) {
      this.params.get(paramsName).value = value
      this.run()
      this.resetTrigger()
    }
  }

  get currentState() {
    return this._currentState
  }

  set currentState(newState: State) {
    this._currentState = newState
    this._currentState.run()
  }

  resetTrigger() {
    for (const [_, value] of this.params) {
      if (value.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        value.value = false
      }
    }
  }
  abstract init(): void
  abstract run(): void

  onTriggered(type?: string) {
    if (type === '0') {
      EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, 140, 10)
    }
  }
}
