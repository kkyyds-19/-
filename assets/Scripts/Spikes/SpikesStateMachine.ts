import { _decorator, Animation } from 'cc'
import { getParamKey } from '../../Enums'
import { getInitParmesNumber, StateMachine } from '../../Base/StateMachine'
import SpikesOneSubStateMachine from './SpikesOneSubStateMachine'
import SpilkesTwoSubStateMachine from './SpilkesTwoSubStateMachine'
import SpikesThreeSubStateMachine from './SpikesThreeSubStateMachine'
import SpikesFourSubStateMachine from './SpikesFourSubStateMachine'

const { ccclass, property } = _decorator

/**
 * 木骷髅状态机
 * @cocos_version Cocos Creator 3.x
 * @author 2026-01-04
 */
@ccclass('SpikesStateMachine')
export class SpikesStateMachine extends StateMachine {
  private spikesOneSubStateMachine: SpikesOneSubStateMachine
  private spikesTwoSubStateMachine: SpilkesTwoSubStateMachine
  private spikesThreeSubStateMachine: SpikesThreeSubStateMachine
  private spikesFourSubStateMachine: SpikesFourSubStateMachine

  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(getParamKey('SPIKES_CUR_COUNT'), getInitParmesNumber())
    this.params.set(getParamKey('SPIKES_TOTAL_COUNT'), getInitParmesNumber())
  }

  initStateMachines() {
    this.spikesOneSubStateMachine = new SpikesOneSubStateMachine(this)
    this.spikesTwoSubStateMachine = new SpilkesTwoSubStateMachine(this)
    this.spikesThreeSubStateMachine = new SpikesThreeSubStateMachine(this)
    this.spikesFourSubStateMachine = new SpikesFourSubStateMachine(this)
  }

  initAnimationEvent() {}

  run() {
    const total = this.getParames(getParamKey('SPIKES_TOTAL_COUNT')) as number
    if (total === 2) {
      this.spikesOneSubStateMachine.run()
    } else if (total === 3) {
      this.spikesTwoSubStateMachine.run()
    } else if (total === 4) {
      this.spikesThreeSubStateMachine.run()
    } else if (total === 5) {
      this.spikesFourSubStateMachine.run()
    } else {
      this.spikesOneSubStateMachine.run()
    }
  }
}
