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
import { SmokeManager } from '../Scripts/smoke/SmokeManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../Enums'

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

  levelTransitioning = false

  player: PlayerManager

  door: DoorManager

  burst: BurstManager[] = []

  enemies: EnemyManager[]

  Spikes: SpikesManager[]
  smokes: SmokeManager[]

  private stepHistory: Array<{
    levelIndex: number
    player: null | {
      id: string
      x: number
      y: number
      direction: DIRECTION_ENUM
      state: ENTITY_STATE_ENUM
      tragetX: number
      tragetY: number
      isMoving: boolean
    }
    door: null | {
      id: string
      x: number
      y: number
      direction: DIRECTION_ENUM
      state: ENTITY_STATE_ENUM
    }
    enemies: Array<{
      id: string
      x: number
      y: number
      direction: DIRECTION_ENUM
      state: ENTITY_STATE_ENUM
      type: ENTITY_TYPE_ENUM
    }>
    burst: Array<{
      id: string
      x: number
      y: number
      direction: DIRECTION_ENUM
      state: ENTITY_STATE_ENUM
    }>
    spikes: Array<{
      id: string
      x: number
      y: number
      count: number
      totalCount: number
      type: ENTITY_TYPE_ENUM
    }>
  }> = []
  private readonly maxStepHistory = 50

  saveStep() {
    const snapshot = this.createStepSnapshot()
    if (!snapshot) {
      return
    }
    this.stepHistory.push(snapshot)
    if (this.stepHistory.length > this.maxStepHistory) {
      this.stepHistory.shift()
    }
  }

  revokeStep() {
    if (this.levelTransitioning) {
      return
    }
    const snapshot = this.stepHistory.pop()
    if (!snapshot) {
      return
    }
    if (snapshot.levelIndex !== this.levelIndex) {
      this.stepHistory.length = 0
      return
    }
    this.applyStepSnapshot(snapshot)
  }

  private createStepSnapshot() {
    if (!this.player) {
      return null
    }

    const playerSnapshot = {
      id: this.player.id,
      x: this.player.x,
      y: this.player.y,
      direction: this.player.direction,
      state: this.player.state,
      tragetX: this.player.tragetX,
      tragetY: this.player.tragetY,
      isMoving: this.player.isMoving,
    }

    const doorSnapshot =
      this.door === null
        ? null
        : {
            id: this.door.id,
            x: this.door.x,
            y: this.door.y,
            direction: this.door.direction,
            state: this.door.state,
          }

    return {
      levelIndex: this.levelIndex,
      player: playerSnapshot,
      door: doorSnapshot,
      enemies: (this.enemies || []).map(e => ({
        id: e.id,
        x: e.x,
        y: e.y,
        direction: e.direction,
        state: e.state,
        type: e.type,
      })),
      burst: (this.burst || []).map(b => ({
        id: b.id,
        x: b.x,
        y: b.y,
        direction: b.direction,
        state: b.state,
      })),
      spikes: (this.Spikes || []).map(s => ({
        id: s.id,
        x: s.x,
        y: s.y,
        count: s.count,
        totalCount: s.totalCount,
        type: s.type,
      })),
    }
  }

  private applyStepSnapshot(snapshot: {
    levelIndex: number
    player: null | {
      id: string
      x: number
      y: number
      direction: DIRECTION_ENUM
      state: ENTITY_STATE_ENUM
      tragetX: number
      tragetY: number
      isMoving: boolean
    }
    door: null | {
      id: string
      x: number
      y: number
      direction: DIRECTION_ENUM
      state: ENTITY_STATE_ENUM
    }
    enemies: Array<{
      id: string
      x: number
      y: number
      direction: DIRECTION_ENUM
      state: ENTITY_STATE_ENUM
      type: ENTITY_TYPE_ENUM
    }>
    burst: Array<{
      id: string
      x: number
      y: number
      direction: DIRECTION_ENUM
      state: ENTITY_STATE_ENUM
    }>
    spikes: Array<{
      id: string
      x: number
      y: number
      count: number
      totalCount: number
      type: ENTITY_TYPE_ENUM
    }>
  }) {
    const playerSnapshot = snapshot.player
    if (playerSnapshot && this.player && this.player.id === playerSnapshot.id) {
      this.player.isMoving = false
      this.player.x = playerSnapshot.x
      this.player.y = playerSnapshot.y
      this.player.tragetX = playerSnapshot.tragetX
      this.player.tragetY = playerSnapshot.tragetY
      this.player.isMoving = playerSnapshot.isMoving
      this.player.direction = playerSnapshot.direction
      this.player.state = playerSnapshot.state
    }

    const doorSnapshot = snapshot.door
    if (doorSnapshot && this.door && this.door.id === doorSnapshot.id) {
      this.door.x = doorSnapshot.x
      this.door.y = doorSnapshot.y
      this.door.direction = doorSnapshot.direction
      this.door.state = doorSnapshot.state
    }

    const enemiesById = new Map((this.enemies || []).map(e => [e.id, e]))
    snapshot.enemies.forEach(s => {
      const e = enemiesById.get(s.id)
      if (!e) {
        return
      }
      e.x = s.x
      e.y = s.y
      e.direction = s.direction
      e.state = s.state
    })

    const burstById = new Map((this.burst || []).map(b => [b.id, b]))
    snapshot.burst.forEach(s => {
      const b = burstById.get(s.id)
      if (!b) {
        return
      }
      b.x = s.x
      b.y = s.y
      b.direction = s.direction
      b.state = s.state
    })

    const spikesById = new Map((this.Spikes || []).map(s => [s.id, s]))
    snapshot.spikes.forEach(s => {
      const spike = spikesById.get(s.id)
      if (!spike) {
        return
      }
      spike.x = s.x
      spike.y = s.y
      spike.totalCount = s.totalCount
      spike.count = s.count
    })
  }

  reset() {
    this.mapInfo = []
    this.tileInfo = []
    this.enemies = []
    this.player = null
    this.door = null
    this.burst = []
    this.Spikes = []
    this.smokes = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
    this.levelTransitioning = false
    this.stepHistory = []
  }
}

//export const DateManagerInstance = new DateManager();
