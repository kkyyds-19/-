import { _decorator, Animation } from 'cc'
import { getParamKey } from '../../Enums'
import { getInitParmesNumber, getInitParmesTrigger, StateMachine } from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'

const { ccclass, property } = _decorator

/**
 * 木骷髅状态机
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-04
 */
@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {
  private idleSubStateMachine: IdleSubStateMachine

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
  }

  initStateMachines() {
    // 仅初始化待机子状态机
    this.idleSubStateMachine = new IdleSubStateMachine(this)
  }

  initAnimationEvent() {
    // 基础动画事件监听，目前仅保留待机逻辑，可根据需要扩展
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      // 动画播放完成后，如果需要处理状态切换可以在此添加逻辑
    })
  }

  run() {
    // 核心运行逻辑：目前只保留IDLE状态的运行
    this.idleSubStateMachine.run()

    // 重置所有触发器参数
    this.resetTrigger()
  }
}
