import { _decorator, Animation, AnimationClip } from 'cc'
import { ENTITY_STATE_ENUM, getParamKey } from '../../Enums'
import { getInitParmesNumber, getInitParmesTrigger, StateMachine } from '../../Base/StateMachine'
import { EntityManager } from '../../Base/EntityManager'
import State from '../../Base/State'

const { ccclass, property } = _decorator
const BASE_URL = 'texture/burst/'
/**
 * 木骷髅状态机
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-04
 */
@ccclass('BurstStateMachine')
export class BurstStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams() {
    // 初始化IDLE触发参数
    this.params.set(getParamKey('IDLE'), getInitParmesTrigger())
    // 初始化方向参数
    this.params.set(getParamKey('DIRECTION'), getInitParmesNumber())
    // 初始化攻击触发参数
    this.params.set(getParamKey('ATTACK'), getInitParmesTrigger())
    // 初始化死亡触发参数
    this.params.set(getParamKey('DEATH'), getInitParmesTrigger())
  }

  initStateMachines() {
    this.starteMachines.set(ENTITY_STATE_ENUM.IDLE, new State(this, `${BASE_URL}idle`, AnimationClip.WrapMode.Loop))
    this.starteMachines.set(
      ENTITY_STATE_ENUM.ATTACK,
      new State(this, `${BASE_URL}attack`, AnimationClip.WrapMode.Normal),
    )
    this.starteMachines.set(ENTITY_STATE_ENUM.DEATH, new State(this, `${BASE_URL}death`, AnimationClip.WrapMode.Normal))
  }

  initAnimationEvent() {
    // 基础动画事件监听
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['attack']
      if (whiteList.some(v => name.includes(v))) {
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      }
    })
  }

  run() {
    const idle = this.getParames(getParamKey('IDLE'))
    const attack = this.getParames(getParamKey('ATTACK'))
    const death = this.getParames(getParamKey('DEATH'))

    if (death) {
      this.currentState = this.starteMachines.get(ENTITY_STATE_ENUM.DEATH)
    } else if (attack) {
      this.currentState = this.starteMachines.get(ENTITY_STATE_ENUM.ATTACK)
    } else if (idle) {
      this.currentState = this.starteMachines.get(ENTITY_STATE_ENUM.IDLE)
    } else {
      this.currentState = this.starteMachines.get(ENTITY_STATE_ENUM.IDLE)
    }

    // 重置所有触发器参数
    this.resetTrigger()
  }
}
