/**
 * BattleManager 关卡管理组件
 * - 创建舞台节点并承载地图
 * - 初始化关卡数据到 DateManager 单例
 * - 生成瓦片地图并适配位置
 * - 监听并响应“下一关”事件
 */
import { _decorator, Component, Node, view } from 'cc'
import { TileMapManger } from '../Tlie/TileMapManger'
import { createUINode } from '../../Utils'
import levels, { ILevel } from '../../Levels'
import DateManager from '../../Runtime/DateManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tlie/TileManager'
import EventManager from '../../Runtime/EventManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums'
import { PlayerManager } from '../Player/PlayerManager'
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager'
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager'
import { DoorManager } from '../Door/DoorManager'
import { BurstManager } from '../Burst/BurstManager'
import { SpikesManager } from '../Spikes/SpikesManager'
import { SmokeManager } from '../smoke/SmokeManager'
import { ShakeManager } from '../UI/ShakeManager'
import FaderManager from '../../Runtime/FaderManager'
const { ccclass, property } = _decorator

@ccclass('BatlleManager')
export class BatlleManager extends Component {
  private static runtimeInstance: BatlleManager | null = null

  /** 当前关卡数据（Levels 中的结构） */
  level: ILevel
  /** 舞台节点，承载 tileMap 等子节点 */
  stage: Node
  /** 是否正在切换关卡 */
  inTransition = false
  private smokeLayer: Node
  private smokePool: SmokeManager[] = []

  /** 组件加载时绑定事件 */
  onLoad() {
    const existing = BatlleManager.runtimeInstance
    if (existing && existing !== this) {
      const existingPreferred = existing.node?.name === 'Canvas'
      const currentPreferred = this.node?.name === 'Canvas'

      if (existingPreferred && !currentPreferred) {
        this.destroy()
        return
      }

      if (!existingPreferred && currentPreferred) {
        existing.destroy()
      } else {
        this.destroy()
        return
      }
    }

    BatlleManager.runtimeInstance = this
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrive, this)
    EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this)
  }

  /** 组件销毁时解绑事件 */
  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrive, this)
    if (BatlleManager.runtimeInstance === this) {
      BatlleManager.runtimeInstance = null
    }
  }
  start() {
    this.generateStage()
    this.initLevel()
  }

  /**
   * 初始化关卡：
   * - 根据当前关卡索引从 levels 取数据
   * - 将 mapInfo/行列数写入 DateManager
   * - 生成瓦片地图
   */
  async initLevel() {
    const level = levels[`level${DateManager.Instance.levelIndex}`]
    if (level) {
      await FaderManager.Instance.fadeIn()
      if (this.inTransition) {
        this.inTransition = false
      }
      if (DateManager.Instance.levelTransitioning) {
        DateManager.Instance.levelTransitioning = false
      }
      console.log(`正在进入关卡: level${DateManager.Instance.levelIndex}`)
      console.log(`地图尺寸: rows=${level.mapInfo[0].length}, cols=${level.mapInfo.length}`)
      console.log(`玩家初始坐标: x=${level.player.x}, y=${level.player.y}`)
      console.log(`门坐标: x=${level.door.x}, y=${level.door.y}, state=${level.door.state}`)
      this.clearLevel()
      this.level = level

      DateManager.Instance.mapInfo = this.level.mapInfo
      DateManager.Instance.mapColumnCount = this.level.mapInfo.length || 0
      DateManager.Instance.mapRowCount = this.level.mapInfo[0].length || 0

      await Promise.all([
        this.generateTileMap(),
        this.generateSmokeLayer(),
        this.generatePlayer(),
        this.generateSpikes(),
        this.generateEnemies(),
        this.generateDoor(),
        this.generateBursts(),
      ])

      await FaderManager.Instance.fadeOut()
    }
  }

  /** 触发进入下一关：递增关卡索引并重新初始化 */
  nextLevel() {
    if (this.inTransition || DateManager.Instance.levelTransitioning) {
      return
    }
    this.inTransition = true
    DateManager.Instance.levelTransitioning = true
    DateManager.Instance.levelIndex++
    this.initLevel()
  }

  clearLevel() {
    this.stage.destroyAllChildren()
    this.smokePool = []
    DateManager.Instance.reset()
  }

  /** 创建舞台节点并设置到当前节点下 */
  generateStage() {
    this.stage = createUINode() //舞台
    this.stage.setParent(this.node)
    this.stage.addComponent(ShakeManager)
  }

  /** 创建并初始化瓦片地图管理器组件 */
  generateTileMap() {
    const tileMap = createUINode() //地图
    tileMap.setParent(this.stage)
    const tileMapManger = tileMap.addComponent(TileMapManger)
    tileMapManger.init()

    this.adaptPos()
  }

  async generatePlayer() {
    const player = createUINode() //地图
    player.setParent(this.stage)
    const playerManager = player.addComponent(PlayerManager)
    await playerManager.init(this.level.player)
    DateManager.Instance.player = playerManager
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, playerManager)
  }
  async generateEnemies() {
    // 遍历关卡配置中的敌人数组，根据 type 生成对应骷髅
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i]

      // 为当前敌人创建节点并挂到舞台下
      const node = createUINode()
      node.setParent(this.stage)

      // 根据关卡中配置的实体类型，选择具体的敌人管理器
      let ManagerClass: typeof WoodenSkeletonManager | typeof IronSkeletonManager
      if (enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN) {
        ManagerClass = WoodenSkeletonManager
      } else if (enemy.type === ENTITY_TYPE_ENUM.SKELETON_IRON) {
        ManagerClass = IronSkeletonManager
      } else {
        // 非骷髅类型暂不处理，直接跳过
        continue
      }

      // 添加对应管理器组件，并按照关卡配置初始化位置/朝向/初始状态
      const manager = node.addComponent(ManagerClass)
      await manager.init(enemy)

      // 将敌人管理器存入全局 DateManager，方便其他系统（如攻击逻辑）访问
      DateManager.Instance.enemies.push(manager)
    }
  }

  async generateDoor() {
    const door = createUINode()
    door.setParent(this.stage)
    const doorManager = door.addComponent(DoorManager)
    await doorManager.init(this.level.door)
    DateManager.Instance.door = doorManager
  }

  async generateBursts() {
    for (let i = 0; i < this.level.bursts.length; i++) {
      const burst = this.level.bursts[i]
      const node = createUINode()
      node.setParent(this.stage)
      node.setSiblingIndex(1)
      const burstManager = node.addComponent(BurstManager)
      await burstManager.init(burst)
      DateManager.Instance.burst.push(burstManager)
    }
  }

  async generateSpikes() {
    for (let i = 0; i < this.level.spikes.length; i++) {
      const spike = this.level.spikes[i]
      const node = createUINode()
      node.setParent(this.stage)
      node.setSiblingIndex(1)
      const spikesManager = node.addComponent(SpikesManager)
      await spikesManager.init(spike)
      DateManager.Instance.Spikes.push(spikesManager)
    }
  }

  /** 根据地图尺寸将舞台居中偏移 */
  adaptPos() {
    const { mapRowCount, mapColumnCount } = DateManager.Instance
    if (!mapRowCount || !mapColumnCount) {
      return
    }

    const tileW = TILE_WIDTH
    const tileH = TILE_HEIGHT

    const maxTileX = (mapColumnCount - 1) * tileW
    const minTileY = -(mapRowCount - 1) * tileH

    const minX = -tileW * 3.5
    const maxX = maxTileX + tileW * 0.5
    const minY = minTileY - tileH * 0.5
    const maxY = tileH * 3.5

    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    const visibleSize = view.getVisibleSize()
    const targetX = 0
    const targetY = visibleSize.height * 0.15

    this.stage.setPosition(targetX - centerX, targetY - centerY)
  }

  checkArrive() {
    if (!DateManager.Instance.player || !DateManager.Instance.door) {
      return
    }
    const { x: playerX, y: playerY } = DateManager.Instance.player
    const { x: doorX, y: doorY, state: doorState } = DateManager.Instance.door
    if (playerX === doorX && playerY === doorY && doorState === ENTITY_STATE_ENUM.DEATH) {
      EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
    }
  }

  /**
   * 生成烟雾（带对象池优化）
   * @param x 坐标X
   * @param y 坐标Y
   * @param direction 朝向
   */
  async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
    // 1. 尝试从池中获取一个当前未激活（已播放完）的烟雾管理器
    let smokeManager = this.smokePool.find(s => !s.node.active)

    if (!smokeManager) {
      // 2. 如果池中没有可用的，则创建新的
      const smoke = createUINode()
      smoke.setParent(this.smokeLayer)
      smokeManager = smoke.addComponent(SmokeManager)
      this.smokePool.push(smokeManager)
    }

    // 3. 重新初始化（内部会处理 active = true 和状态重置）
    await smokeManager.init({
      x,
      y,
      direction,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.SMOKE,
    })
  }

  generateSmokeLayer() {
    this.smokeLayer = createUINode()
    this.smokeLayer.setParent(this.stage)
  }
}
