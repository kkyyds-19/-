import { _decorator, Component, Sprite, UITransform } from 'cc'
import { randomByLen } from '../../Utils'
import { StateMachine } from '../../Base/StateMachine'
import { ENTITY_TYPE_ENUM, PARAME_NAME_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from '../../Enums'
import { ISpikes } from '../../Levels'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tlie/TileManager'
import { SpikesStateMachine } from './SpikesStateMachine'
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
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
}
