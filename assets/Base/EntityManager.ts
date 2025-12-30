import { _decorator, Component, Sprite, UITransform } from 'cc'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, PARAME_NAME_ENUM } from '../Enums'
import { TILE_HEIGHT, TILE_WIDTH } from '../Scripts/Tlie/TileManager'
import { StateMachine } from './StateMachine'
const { ccclass } = _decorator

@ccclass('EntityManager')
export class EntityManager extends Component {
  x: number = 0
  y: number = 0
  fsm: StateMachine

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

  async init(params?: Partial<{ x: number; y: number; direction: DIRECTION_ENUM; state: ENTITY_STATE_ENUM }>) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_WIDTH * 4)

    this.x = params.x
    this.y = params.y

    this.direction = params.direction
    this.state = params.state
  }

  update() {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
}

// async render(){
//   const sprite = this.addComponent(Sprite)
//   sprite.sizeMode = Sprite.SizeMode.CUSTOM

//   const transform = this.getComponent(UITransform)
//   transform.setContentSize(TILE_WIDTH * 4, TILE_WIDTH * 4)

//   const spriteFrames =  await ResourceManager.Instance.loadDir("texture/player/idle/top")
//   const animationComponent = this.addComponent(Animation)
//   const animationClip = new AnimationClip()

//   const track = new animation.ObjectTrack() // 创建一个对象轨道
//   track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame') // 指定轨道路径，即指定目标对象为 "Foo" 子节点的 "position" 属性
//   const frames :Array<[number,SpriteFrame]> = spriteFrames.map((item,index)=>[ANIMATION_SPEED * index,item])
//   track.channel.curve.assignSorted(frames);

//   // 最后将轨道添加到动画剪辑以应用
//   animationClip.addTrack(track)
//   animationClip.wrapMode = AnimationClip.WrapMode.Loop
//   animationClip.duration =frames.length * ANIMATION_SPEED// 整个动画剪辑的周期
//   animationComponent.defaultClip = animationClip
//   animationComponent.play()

// }
