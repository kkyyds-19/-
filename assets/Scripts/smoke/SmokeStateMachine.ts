/**
 * 烟雾状态机
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-12
 */
import { _decorator, Animation } from 'cc'
import { getParamKey } from '../../Enums'
import { getInitParmesNumber, getInitParmesTrigger, StateMachine } from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'
import DeathSubStateMachine from './DeathSubStateMachine'
import { SmokeManager } from './SmokeManager'

const { ccclass } = _decorator

@ccclass('SmokeStateMachine')
export class SmokeStateMachine extends StateMachine {
  private idleSubStateMachine: IdleSubStateMachine
  private deathSubStateMachine: DeathSubStateMachine

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
  }

  initStateMachines() {
    // 初始化待机子状态机
    this.idleSubStateMachine = new IdleSubStateMachine(this)
    // 初始化死亡子状态机
    this.deathSubStateMachine = new DeathSubStateMachine(this)
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      // 播放完动画后回收节点（烟雾是一次性特效，回收进对象池）
      const whiteList = ['idle', 'death']
      if (whiteList.some(v => name.includes(v))) {
        this.node.getComponent(SmokeManager)?.recycle()
      }
    })
  }

  run() {
    const idle = this.getParames(getParamKey('IDLE'))
    const death = this.getParames(getParamKey('DEATH'))

    if (death) {
      this.deathSubStateMachine.run()
    } else if (idle) {
      this.idleSubStateMachine.run()
    } else {
      this.idleSubStateMachine.run()
    }
  }
}
