import {
  _decorator,
  animation,
  AnimationClip,
  Component,
  Node,
  Sprite,
  UITransform,
  Vec3,
  Animation,
  SpriteFrame,
} from 'cc'
import EventManager from '../../Runtime/EventManager'
import {
  CONTROLLER_ENUM,
  DIRECTION_ENUM,
  DIRECTION_ORDER_ENUM,
  ENTITY_STATE_ENUM,
  EVENT_ENUM,
  PARAME_NAME_ENUM,
  getParamKey,
} from '../../Enums'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tlie/TileManager'
import ResourceManager from '../../Runtime/ResourceManager'
import { PlayerStateMachine } from './PlayerStateMachine'
const { ccclass, property } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  x: number = 0
  y: number = 0
  tragetX: number = 0
  tragetY: number = 0
  private readonly speed = 1 / 10
  fsm: PlayerStateMachine

  private _direction: DIRECTION_ENUM
  private _state: ENTITY_STATE_ENUM

  get direction() {
    return this._direction
  }
  set direction(newDirection: DIRECTION_ENUM) {
    this._direction = newDirection
    this.fsm.setParames(PARAME_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
  }

  get state() {
    return this._state
  }
  set state(newState: ENTITY_STATE_ENUM) {
    this._state = newState
    this.fsm.setParames(this._state, true)
  }
  async init() {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_WIDTH * 4)

    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    this.state = ENTITY_STATE_ENUM.IDLE

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.move, this)
  }

  update() {
    this.updateXY()
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
  updateXY() {
    if (this.tragetX < this.x) {
      this.x -= this.speed
    } else if (this.tragetX > this.x) {
      this.x += this.speed
    } else if (this.tragetY < this.y) {
      this.y -= this.speed
    } else if (this.tragetY > this.y) {
      this.y += this.speed
    }
    if (Math.abs(this.tragetX - this.x) <= 0.1 && Math.abs(this.tragetY - this.y) <= 0.1) {
      this.x = this.tragetX
      this.y = this.tragetY
    }
  }

  move(inputDirection: CONTROLLER_ENUM) {
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.tragetY -= 1
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.tragetY += 1
    } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
      this.tragetX -= 1
    } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
      this.tragetX += 1
    } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      if(this._direction === DIRECTION_ENUM.TOP){
        this.direction = DIRECTION_ENUM.LEFT
      }else if(this._direction === DIRECTION_ENUM.LEFT){
        this.direction = DIRECTION_ENUM.BOTTOM
      }else if(this._direction === DIRECTION_ENUM.BOTTOM){
        this.direction = DIRECTION_ENUM.RIGHT
      }else if(this._direction === DIRECTION_ENUM.RIGHT){
        this.direction = DIRECTION_ENUM.TOP
      }
      //测试

      console.log("测试")
      this.state = ENTITY_STATE_ENUM.TURNLEFT
      //this.fsm.setParames(getParamKey('TURNLEFT'), true)
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
}
