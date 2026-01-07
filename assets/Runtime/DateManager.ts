/**
 * DateManager 运行时数据单例
 * - 保存当前关卡的地图信息与尺寸
 * - 提供关卡索引以便切换关卡
 */
import { log } from 'cc'
import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'
import { TileManager } from '../Scripts/Tlie/TileManager'
import { PlayerManager } from '../Scripts/Player/PlayerManager'
import { EnemyManager } from '../Base/EnemyManager'
import { DoorManager } from '../Scripts/Door/DoorManager'
import { BurstManager } from '../Scripts/Burst/BurstManager'
import { SpikesManager } from '../Scripts/Spikes/SpikesManager'

export default class DateManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DateManager>()
  }

  tileInfo: Array<Array<TileManager>> = []
  mapInfo: Array<Array<ITile>>
  /** 地图行数 */
  mapRowCount = 0
  /** 地图列数 */
  mapColumnCount = 0
  /** 当前关卡索引，默认从 1 开始 */
  levelIndex = 1

  player: PlayerManager

  door: DoorManager

  burst: BurstManager[] = []

  enemies: EnemyManager[]

  Spikes: SpikesManager[]

  reset() {
    this.mapInfo = []
    this.tileInfo = []
    this.enemies = []
    this.player = null
    this.door = null
    this.burst = []
    this.Spikes = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
  }
}

//export const DateManagerInstance = new DateManager();
