/**
 * BattleManager 关卡管理组件
 * - 创建舞台节点并承载地图
 * - 初始化关卡数据到 DateManager 单例
 * - 生成瓦片地图并适配位置
 * - 监听并响应“下一关”事件
 */
import { _decorator, Component, Node } from 'cc'
import { TileMapManger } from '../Tlie/TileMapManger'
import { createUINode } from '../../Utils'
import levels, { ILevel } from '../../Levels'
import DateManager from '../../Runtime/DateManager'
import { TILE_WIDTH } from '../Tlie/TileManager'
import EventManager from '../../Runtime/EventManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums'
import { PlayerManager } from '../Player/PlayerManager'
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager'
import { IronSkeletonManager } from '../IronSkeleton/IronSkeletonManager'
import { DoorManager } from '../Door/DoorManager'
import { BurstManager } from '../Burst/BurstManager'
import { SpikesManager } from '../Spikes/SpikesManager'
const { ccclass, property } = _decorator

@ccclass('BatlleManager')
export class BatlleManager extends Component {
  /** 当前关卡数据（Levels 中的结构） */
  level: ILevel
  /** 舞台节点，承载 tileMap 等子节点 */
  stage: Node

  /** 组件加载时绑定事件 */
  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrive, this)
  }

  /** 组件销毁时解绑事件 */
  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
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
  initLevel() {
    const level = levels[`level${DateManager.Instance.levelIndex}`]
    if (level) {
      this.clearLevel()
      this.level = level

      DateManager.Instance.mapInfo = this.level.mapInfo
      DateManager.Instance.mapRowCount = this.level.mapInfo.length || 0
      DateManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0

      this.generateTileMap()
      this.generatePlayer()
      this.generateSpikes()
      this.generateEnemies()
      this.generateDoor()
      this.generateBursts()
    }
  }

  /** 触发进入下一关：递增关卡索引并重新初始化 */
  nextLevel() {
    DateManager.Instance.levelIndex++
    this.initLevel()
  }

  clearLevel() {
    this.stage.destroyAllChildren()
    DateManager.Instance.reset()
  }

  /** 创建舞台节点并设置到当前节点下 */
  generateStage() {
    this.stage = createUINode() //舞台
    this.stage.setParent(this.node)
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
    const door = createUINode() //地图
    door.setParent(this.stage)
    const doorManager = door.addComponent(DoorManager)
    await doorManager.init({
      x: 7,
      y: 8,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DateManager.Instance.door = doorManager
  }

  async generateBursts() {
    const burst = createUINode() //地图
    burst.setParent(this.stage)
    burst.setSiblingIndex(1)
    const burstManager = burst.addComponent(BurstManager)
    await burstManager.init({
      x: 2,
      y: 6,
      type: ENTITY_TYPE_ENUM.BURST,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    DateManager.Instance.burst.push(burstManager)
  }

  async generateSpikes() {
    const configs = [
      // { x: 2, y: 6, type: ENTITY_TYPE_ENUM.SPIKES_ONE },
      // { x: 3, y: 6, type: ENTITY_TYPE_ENUM.SPIKES_TWO },
      // { x: 4, y: 6, type: ENTITY_TYPE_ENUM.SPIKES_THREE },
      { x: 2, y: 5, type: ENTITY_TYPE_ENUM.SPIKES_FOUR },
    ]
    for (const cfg of configs) {
      const spikes = createUINode() //地图
      spikes.setParent(this.stage)
      spikes.setSiblingIndex(1)
      const spikesManager = spikes.addComponent(SpikesManager)
      await spikesManager.init({
        x: cfg.x,
        y: cfg.y,
        type: cfg.type,
        count: 0,
      })
      DateManager.Instance.Spikes.push(spikesManager)
    }
  }

  /** 根据地图尺寸将舞台居中偏移 */
  adaptPos() {
    const { mapRowCount, mapColumnCount } = DateManager.Instance
    const disX = (TILE_WIDTH * mapRowCount) / 2
    const disY = (TILE_WIDTH * mapColumnCount) / 2 - 580
    this.stage.setPosition(-disX, -disY)
  }

  checkArrive() {
    const { x: playerX, y: playerY } = DateManager.Instance.player
    const { x: doorX, y: doorY, state: doorState } = DateManager.Instance.door
    if (playerX === doorX && playerY === doorY && doorState === ENTITY_STATE_ENUM.DEATH) {
      EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
    }
  }
}
