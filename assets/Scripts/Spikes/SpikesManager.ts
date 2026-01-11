import { _decorator, Component, Sprite, UITransform } from 'cc'
import { randomByLen } from '../../Utils'
import { StateMachine } from '../../Base/StateMachine'
import {
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  PARAME_NAME_ENUM,
  SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM,
} from '../../Enums'
import { ISpikes } from '../../Levels'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tlie/TileManager'
import { SpikesStateMachine } from './SpikesStateMachine'
import EventManager from '../../Runtime/EventManager'
import DateManager from '../../Runtime/DateManager'
const { ccclass } = _decorator

@ccclass('SpikesManager')
export class SpikesManager extends Component {
  id: string = randomByLen(12)
  x = 0
  y = 0
  fsm: StateMachine
  private _count: number
  private _totalCount: number
  type: ENTITY_TYPE_ENUM

  get count() {
    return this._count
  }
  set count(newCount: number) {
    this._count = newCount
    this.fsm?.setParames(PARAME_NAME_ENUM.SPIKES_CUR_COUNT, newCount)
  }

  get totalCount() {
    return this._totalCount
  }
  set totalCount(newCount: number) {
    this._totalCount = newCount
    this.fsm?.setParames(PARAME_NAME_ENUM.SPIKES_TOTAL_COUNT, newCount)
  }

  async init(params: ISpikes) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.x = params.x
    this.y = params.y
    this.type = params.type
    this.fsm = this.addComponent(SpikesStateMachine)
    await this.fsm.init()
    this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[this.type]
    this.count = params.count

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this)
  }
  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onLoop, this)
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }

  onLoop() {
    if (this.count === this.totalCount) {
      this.count = 1
    } else {
      this.count++
    }
    this.onAttack()
  }

  /**
   * 攻击逻辑
   * 当玩家在地刺上且地刺处于最高点时，触发玩家死亡
   */
  onAttack() {
    // 如果没有玩家，直接返回
    if (!DateManager.Instance.player) {
      return
    }

    const { x: playerX, y: playerY, state: playerState } = DateManager.Instance.player

    // 如果玩家已经死亡，不再重复触发
    if (playerState === ENTITY_STATE_ENUM.DEATH || playerState === ENTITY_STATE_ENUM.AIRDEATH) {
      return
    }

    // 判定条件：位置重合 且 地刺当前计数达到总计数（完全刺出）
    if (this.x === playerX && this.y === playerY && this.count === this.totalCount) {
      // 触发攻击玩家事件
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    }
  }

  backZero() {
    this.count = 0
  }
}
