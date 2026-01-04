/**
 * TileMapManger 瓦片地图管理器
 * - 加载瓦片资源
 * - 遍历 DateManager.mapInfo 生成瓦片节点
 * - 对特定基础瓦片（1/5/9）按规则作随机偏移
 */
import { _decorator, Component, Layers, log, Node, randomRange, resources, Sprite, SpriteFrame, UITransform } from 'cc'
const { ccclass, property } = _decorator
import levels from '../../Levels'
import { TileManager } from './TileManager'
import { createUINode, randomByRange } from '../../Utils'
import DateManager from '../../Runtime/DateManager'
import ResourceManager from '../../Runtime/ResourceManager'

@ccclass('TileMapManger')
export class TileMapManger extends Component {
  /**
   * 初始化瓦片地图：
   * - 加载资源目录中的 SpriteFrame 集合
   * - 遍历地图二维数组生成节点与 TileManager 组件
   */
  async init() {
    const spriteFrames = await ResourceManager.Instance.loadDir('texture/tile/tile')
    const { mapInfo } = DateManager.Instance
    DateManager.Instance.tileInfo = []
    for (let i = 0; i < mapInfo.length; i++) {
      const colum = mapInfo[i]
      DateManager.Instance.tileInfo[i] = []
      for (let j = 0; j < colum.length; j++) {
        const item = colum[j]
        if (item.src == null || item.type == null) {
          continue
        }

        // 优化：对部分基础瓦片添加有限随机变化，减少重复感

        //测试
        let number = item.src
        if ((number === 1 || number === 5 || number === 9) && i % 2 === 0 && j % 2 === 0) {
          console.log('[TileMapManger] randomByRange type:', typeof randomByRange)
          const inc = typeof randomByRange === 'function' ? randomByRange(0, 4) : Math.floor(randomRange(0, 4))
          number += inc
        }

        // 根据最终编号匹配资源名称
        const imSrc = `tile (${number})`

        const node = createUINode()
        const spriteFrame = spriteFrames.find(v => v.name == imSrc) || spriteFrames[0]
        const tileManager = node.addComponent(TileManager)
        const type = item.type
        tileManager.init(type, spriteFrame, i, j)
        DateManager.Instance.tileInfo[i][j] = tileManager
        node.setParent(this.node)
      }
    }
  }

  /**
   * 通过 resources.loadDir 加载资源的备用方法（未在当前流程中使用）。
   */
  loadRes() {
    return new Promise<SpriteFrame[]>((resoleve, reject) => {
      resources.loadDir('texture/tile/tile', SpriteFrame, function (err, assets) {
        if (err) {
          reject(err)
          return
        }

        resoleve(assets)
      })
    })
  }
}
