/**
 * DateManager 运行时数据单例
 * - 保存当前关卡的地图信息与尺寸
 * - 提供关卡索引以便切换关卡
 */
import { game, log, RenderRoot2D, UITransform, view } from 'cc'
import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'
import { TileManager } from '../Scripts/Tlie/TileManager'
import { PlayerManager } from '../Scripts/Player/PlayerManager'
import { EnemyManager } from '../Base/EnemyManager'
import { DoorManager } from '../Scripts/Door/DoorManager'
import { BurstManager } from '../Scripts/Burst/BurstManager'
import { SpikesManager } from '../Scripts/Spikes/SpikesManager'
import { SmokeManager } from '../Scripts/smoke/SmokeManager'
import { DEFAULT_DURATION, DrawManager } from '../Scripts/UI/DrawManager'
import { createUINode } from '../Utils'

export default class FaderManager extends Singleton {
  static get Instance() {
    return super.GetInstance<FaderManager>()
  }
  private _fader: DrawManager = null

  get fader() {
    if (this._fader !== null) {
      return this._fader
    }
    const root = createUINode()
    root.addComponent(RenderRoot2D)

    const fadeNode = createUINode()
    fadeNode.setParent(root)
    const transform = fadeNode.getComponent(UITransform)
    if (transform) {
      const size = view.getVisibleSize()
      transform.setAnchorPoint(0.5, 0.5)
      transform.setContentSize(size.width, size.height)
    }
    fadeNode.setPosition(0, 0)
    this._fader = fadeNode.addComponent(DrawManager)
    this._fader.init()

    game.addPersistRootNode(root)
    return this._fader
  }

  fadeIn(duration = DEFAULT_DURATION) {
    return this.fader.fadeIn(duration)
  }

  fadeOut(duration = DEFAULT_DURATION) {
    return this.fader.fadeOut(duration)
  }
}
