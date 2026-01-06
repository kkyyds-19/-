import { _decorator, Component, Sprite, UITransform } from 'cc'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAME_NAME_ENUM } from '../Enums'
import { TILE_HEIGHT, TILE_WIDTH } from '../Scripts/Tlie/TileManager'
import { StateMachine } from './StateMachine'
import { randomByLen } from '../Utils'
const { ccclass } = _decorator

@ccclass('EntityManager')
export class EntityManager extends Component {
  id: string = randomByLen(12)
  x = 0
  y = 0
  fsm: StateMachine
  type: ENTITY_TYPE_ENUM

  private _direction: DIRECTION_ENUM = DIRECTION_ENUM.TOP
  private _state: ENTITY_STATE_ENUM = ENTITY_STATE_ENUM.IDLE

  get direction() {
    return this._direction
  }
  set direction(newDirection: DIRECTION_ENUM) {
    this._direction = newDirection
    this.fsm?.setParames(PARAME_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
  }

  get state() {
    return this._state
  }
  set state(newState: ENTITY_STATE_ENUM) {
    this._state = newState
    this.fsm?.setParames(this._state, true)
  }

  async init(
    params?: Partial<{
      x: number
      y: number
      type: ENTITY_TYPE_ENUM
      direction: DIRECTION_ENUM
      state: ENTITY_STATE_ENUM
    }>,
  ) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_WIDTH * 4)

    this.x = params.x
    this.y = params.y
    this.type = params.type
    this.direction = params.direction
    this.state = params.state
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
}
