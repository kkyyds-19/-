import { log, resources, Sprite, SpriteFrame } from 'cc'
import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'

/**
 * 资源管理器：封装常用资源加载方法
 * 当前提供目录加载 `loadDir`，返回指定类型的资源列表
 */
export default class ResourceManager extends Singleton {
  /** 获取全局唯一实例 */
  static get Instance() {
    return super.GetInstance<ResourceManager>()
  }
  //'texture/tile/tile'
  /**
   * 加载资源目录
   * @param path 目录路径（相对 `resources`）
   * @param type 资源类型，默认 `SpriteFrame`
   * @returns Promise，解析为该目录下的资源列表
   */
  loadDir(path: string, type: typeof SpriteFrame = SpriteFrame) {
    return new Promise<SpriteFrame[]>((resoleve, reject) => {
      resources.loadDir(path, type, function (err, assets) {
        if (err) {
          reject(err)
          return
        }

        resoleve(assets)
      })
    })
  }
}
