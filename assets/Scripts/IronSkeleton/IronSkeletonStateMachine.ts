/**
 * 铁骷髅状态机
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-06
 */
import { _decorator, Animation } from 'cc'
import { ENTITY_STATE_ENUM, getParamKey } from '../../Enums'
import { getInitParmesNumber, getInitParmesTrigger, StateMachine } from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'
import DeathSubStateMachine from './DeathSubStateMachine'
import AttackSubStateMachine from './AttackSubStateMachine'
import { EntityManager } from '../../Base/EntityManager'

const { ccclass } = _decorator

@ccclass('IronSkeletonStateMachine')
export class IronSkeletonStateMachine extends StateMachine {
  private idleSubStateMachine: IdleSubStateMachine
  private deathSubStateMachine: DeathSubStateMachine
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
    // 初始化死亡触发参数
    this.params.set(getParamKey('DEATH'), getInitParmesTrigger())
    // 初始化攻击触发参数
    this.params.set(getParamKey('ATTACK'), getInitParmesTrigger())
  }

  initStateMachines() {
    // 初始化待机子状态机
    this.idleSubStateMachine = new IdleSubStateMachine(this)
    // 初始化死亡子状态机
    this.deathSubStateMachine = new DeathSubStateMachine(this)
    // 初始化攻击子状态机
    this.attackSubStateMachine = new AttackSubStateMachine(this)
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      // 播放完攻击动画后回到Idle状态
      const whiteList = ['attack']
      if (whiteList.some(v => name.includes(v))) {
        this.setParames(getParamKey('IDLE'), true)
      }
    })
  }

  run() {
    const idle = this.getParames(getParamKey('IDLE'))
    const death = this.getParames(getParamKey('DEATH'))
    const attack = this.getParames(getParamKey('ATTACK'))

    if (death) {
      this.deathSubStateMachine.run()
    } else if (attack) {
      this.attackSubStateMachine.run()
    } else if (idle) {
      this.idleSubStateMachine.run()
    } else {
      this.idleSubStateMachine.run()
    }
  }
}
