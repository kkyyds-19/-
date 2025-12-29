import { _decorator } from 'cc'
import EventManager from '../../Runtime/EventManager'
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../../Enums'
import { EntityManager } from '../../Base/EntityManager'
import { PlayerStateMachine } from './PlayerStateMachine'
import DateManager from '../../Runtime/DateManager'
const { ccclass } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  tragetX: number = 0
  tragetY: number = 0
  private readonly speed = 1 / 10

  async init() {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    await super.init({ x: 0, y: 0, direction: DIRECTION_ENUM.TOP, state: ENTITY_STATE_ENUM.IDLE })

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.move, this)
  }

  update() {
    this.updateXY()
    super.update()
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
    console.log(DateManager.Instance.tileInfo)
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.tragetY -= 1
    } else if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.tragetY += 1
    } else if (inputDirection === CONTROLLER_ENUM.LEFT) {
      this.tragetX -= 1
    } else if (inputDirection === CONTROLLER_ENUM.RIGHT) {
      this.tragetX += 1
    } else if (inputDirection === CONTROLLER_ENUM.TURNLEFT) {
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.TOP
      }

      this.state = ENTITY_STATE_ENUM.TURNLEFT
    } else if (inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.TOP
      }

      this.state = ENTITY_STATE_ENUM.TURNRIGHT
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
