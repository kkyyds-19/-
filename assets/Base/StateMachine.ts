import { _decorator, AnimationClip, Component, Node, Animation, SpriteFrame } from 'cc'

import State from './State'
import { FSM_PARAMS_TYPE_ENUM } from '../Enums'
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

/**
 * StateMachine 状态机基类
 * 采用参数驱动型状态机设计（类似 Unity Animator），通过修改参数触发状态切换。
 */
@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  /** 当前正在运行的状态实例 */
  private _currentState: State = null

  /** 状态机参数表：存储触发器、数值等驱动变量 */
  params: Map<string, IParamsValue> = new Map()

  /** 状态字典：存储所有注册的状态实例（Key 为状态名，Value 为 State 实例） */
  starteMachines: Map<string, State> = new Map()

  /** 关联的动画组件，用于播放状态对应的动画 */
  animationComponent: Animation

  /** 异步加载等待队列：存储正在加载的资源 Promise */
  waitingList: Array<Promise<SpriteFrame[]>> = []

  /**
   * 获取参数值
   * @param paramsName 参数名
   * @returns 参数当前的数值或布尔值
   */
  getParames(paramsName: string) {
    if (this.params.has(paramsName)) {
      return this.params.get(paramsName).value
    }
  }

  /**
   * 设置参数值并触发状态机逻辑检查
   * @param paramsName 参数名
   * @param value 新的参数值
   */
  setParames(paramsName: string, value: ParamsValueType) {
    if (this.params.has(paramsName)) {
      this.params.get(paramsName).value = value
      this.run() // 每次参数改变，立即尝试检查状态切换条件
      this.resetTrigger() // 触发器类型参数在检查后自动重置
    }
  }

  /** 获取当前状态 */
  get currentState() {
    return this._currentState
  }

  /** 设置当前状态并立即执行该状态的逻辑 */
  set currentState(newState: State) {
    this._currentState = newState
    this._currentState.run()
  }

  /**
   * 重置所有触发器 (Trigger)
   * 确保触发器在一次逻辑检查后回到 false 状态
   */
  resetTrigger() {
    for (const [_, value] of this.params) {
      if (value.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        value.value = false
      }
    }
  }

  /** 初始化抽象方法：子类需在此注册状态、参数并获取动画组件 */
  abstract init(): void

  /** 运行/检查逻辑抽象方法：子类在此定义状态切换的判定条件 */
  abstract run(): void
}
