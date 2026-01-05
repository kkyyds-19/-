import { _decorator, Animation } from 'cc'
import { ENTITY_STATE_ENUM, getParamKey } from '../../Enums'
import { getInitParmesNumber, getInitParmesTrigger, StateMachine } from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'
import AttackSubStateMachine from './AttackSubStateMachine'
import { EntityManager } from '../../Base/EntityManager'

const { ccclass, property } = _decorator

/**
 * 木骷髅状态机
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-04
 */
@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {
  private idleSubStateMachine: IdleSubStateMachine
  private attackSubStateMachine: AttackSubStateMachine

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
  }

  initStateMachines() {
    // 初始化待机子状态机
    this.idleSubStateMachine = new IdleSubStateMachine(this)
    // 初始化攻击子状态机
    this.attackSubStateMachine = new AttackSubStateMachine(this)
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

    if (attack) {
      this.attackSubStateMachine.run()
    } else if (idle) {
      this.idleSubStateMachine.run()
    } else {
      this.idleSubStateMachine.run()
    }

    // 重置所有触发器参数
    this.resetTrigger()
  }
}
