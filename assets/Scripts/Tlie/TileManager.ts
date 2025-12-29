/**
 * TileManager 单个瓦片组件
 * - 设置瓦片的贴图、尺寸与在地图中的坐标位置
 */
import { _decorator, Component, Layers, log, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc'
const { ccclass, property } = _decorator
import levels from '../../Levels'
import { TILE_TYPE_ENUM } from '../../Enums'

export const TILE_HEIGHT = 55
export const TILE_WIDTH = 55

@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM
  moveable: boolean
  turnble: boolean

  init(type: TILE_TYPE_ENUM, spriteFrame: SpriteFrame, i: number, j: number) {
    this.type
    if (
      this.type === TILE_TYPE_ENUM.WALL_ROW ||
      this.type === TILE_TYPE_ENUM.WALL_COLUMN ||
      this.type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
      this.type === TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
      this.type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
      this.type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM
    ) {
      this.moveable = false
      this.turnble = false
    } else if (
      this.type === TILE_TYPE_ENUM.CLIFF_CENTER ||
      this.type === TILE_TYPE_ENUM.CLIFF_LEFT ||
      this.type === TILE_TYPE_ENUM.CLIFF_RIGHT
    ) {
      this.moveable = false
      this.turnble = true
    } else if (this.type === TILE_TYPE_ENUM.FLOOR) {
      this.moveable = true
      this.turnble = true
    }
    const sprite = this.addComponent(Sprite)
    this.type = type
    sprite.spriteFrame = spriteFrame

    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)

    // 位置：X 随行递增；Y 随列递增但 Y 轴向下为负
    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
  }
}
