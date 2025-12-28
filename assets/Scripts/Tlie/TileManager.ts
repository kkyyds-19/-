
/**
 * TileManager 单个瓦片组件
 * - 设置瓦片的贴图、尺寸与在地图中的坐标位置
 */
import { _decorator, Component, Layers, log, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import levels  from '../../Levels';

export const TILE_HEIGHT = 55;
export const TILE_WIDTH = 55;

@ccclass('TileManager')
export class TileManager extends Component {
  /**
   * 初始化瓦片显示与位置
   * @param spriteFrame 贴图资源
   * @param i 行索引（用于 X 轴位置）
   * @param j 列索引（用于 Y 轴位置，注意向下为负值）
   */
  init(spriteFrame:SpriteFrame,i:number,j:number){
      const sprite = this.addComponent(Sprite);

      sprite.spriteFrame = spriteFrame


      const transform = this.getComponent(UITransform)
      transform.setContentSize(TILE_WIDTH,TILE_HEIGHT)

      // 位置：X 随行递增；Y 随列递增但 Y 轴向下为负
      this.node.setPosition(i*TILE_WIDTH,-j*TILE_HEIGHT)


  }

}
