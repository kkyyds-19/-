import { _decorator, Animation } from 'cc'
import { ENTITY_STATE_ENUM, getParamKey } from '../../Enums'
import { getInitParmesNumber, getInitParmesTrigger, StateMachine } from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine'
import TurnRightSubStateMachine from './TurnRightSubStateMachine'
import BlockFrontSubStateMachine from './BlockFrontSubStateMachine'
import { EntityManager } from '../../Base/EntityManager'
import BlockTurnLeftSubStateMachine from './BlockTurnLeftSubStateMachine'
import DeathSubStateMachine from './DeathSubStateMachine'
import AttackSubStateMachine from './AttackSubStateMachine'
import AirFeathSubStateMachine from './AirFeathSubStateMachine'

const { ccclass, property } = _decorator

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
  private idleSubStateMachine: IdleSubStateMachine
  private turnLeftSubStateMachine: TurnLeftSubStateMachine
  private turnRightSubStateMachine: TurnRightSubStateMachine
  private blockfrontStateMachine: BlockFrontSubStateMachine
  private blockturnleftSubStateMachine: BlockTurnLeftSubStateMachine
  private deathSubStateMachine: DeathSubStateMachine
  private attackSubStateMachine: AttackSubStateMachine
  private airdeathSubStateMachine: AirFeathSubStateMachine

  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()

    await Promise.all(this.waitingList)
  }

  initParams() {
    this.params.set(getParamKey('IDLE'), getInitParmesTrigger())
    this.params.set(getParamKey('TURNLEFT'), getInitParmesTrigger())
    this.params.set(getParamKey('BLOCKFRONT'), getInitParmesTrigger())
    this.params.set(getParamKey('TURNRIGHT'), getInitParmesTrigger())
    this.params.set(getParamKey('DIRECTION'), getInitParmesNumber())
    this.params.set(getParamKey('BLOCKTURNLEFT'), getInitParmesTrigger())
    this.params.set(getParamKey('AIRDEATH'), getInitParmesTrigger())
    this.params.set(getParamKey('DEATH'), getInitParmesTrigger())
    this.params.set(getParamKey('ATTACK'), getInitParmesTrigger())
  }

  initStateMachines() {
    this.idleSubStateMachine = new IdleSubStateMachine(this)
    this.turnLeftSubStateMachine = new TurnLeftSubStateMachine(this)
    this.turnRightSubStateMachine = new TurnRightSubStateMachine(this)
    this.blockfrontStateMachine = new BlockFrontSubStateMachine(this)
    this.blockturnleftSubStateMachine = new BlockTurnLeftSubStateMachine(this)
    this.deathSubStateMachine = new DeathSubStateMachine(this)
    this.attackSubStateMachine = new AttackSubStateMachine(this)
    this.airdeathSubStateMachine = new AirFeathSubStateMachine(this)
  }

  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['block', 'turn', 'attack']
      if (whiteList.some(v => name.includes(v))) {
        const entityManager = this.node.getComponent(EntityManager)
        if (!entityManager) {
          return
        }
        if (entityManager.state === ENTITY_STATE_ENUM.DEATH || entityManager.state === ENTITY_STATE_ENUM.AIRDEATH) {
          return
        }
        entityManager.state = ENTITY_STATE_ENUM.IDLE
      }
    })
  }

  run() {
    const turnLeft = this.getParames(getParamKey('TURNLEFT'))
    const turnRight = this.getParames(getParamKey('TURNRIGHT'))
    const idle = this.getParames(getParamKey('IDLE'))
    const blockfront = this.getParames(getParamKey('BLOCKFRONT'))
    const blockturnleft = this.getParames(getParamKey('BLOCKTURNLEFT'))
    const airdeath = this.getParames(getParamKey('AIRDEATH'))
    const death = this.getParames(getParamKey('DEATH'))
    const attack = this.getParames(getParamKey('ATTACK'))
    if (death) {
      this.deathSubStateMachine.run()
    } else if (airdeath) {
      this.airdeathSubStateMachine.run()
    } else if (attack) {
      this.attackSubStateMachine.run()
    } else if (turnLeft) {
      this.turnLeftSubStateMachine.run()
    } else if (turnRight) {
      this.turnRightSubStateMachine.run()
    } else if (idle) {
      this.idleSubStateMachine.run()
    } else if (blockfront) {
      this.blockfrontStateMachine.run()
    } else if (blockturnleft) {
      this.blockturnleftSubStateMachine.run()
    } else {
      this.idleSubStateMachine.run()
    }
    this.resetTrigger()
  }
}
