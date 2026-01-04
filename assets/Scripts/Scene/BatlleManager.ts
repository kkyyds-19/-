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
import { EVENT_ENUM } from '../../Enums'
import { PlayerManager } from '../Player/PlayerManager'
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager'
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
      this.generateEnemies()
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

  generatePlayer() {
    const player = createUINode() //地图
    player.setParent(this.stage)
    const playerManager = player.addComponent(PlayerManager)
    playerManager.init()
  }
  generateEnemies() {
    const enemy = createUINode() //地图
    enemy.setParent(this.stage)
    const woodenSkeletonManager = enemy.addComponent(WoodenSkeletonManager)
    woodenSkeletonManager.init()
  }

  /** 根据地图尺寸将舞台居中偏移 */
  adaptPos() {
    const { mapRowCount, mapColumnCount } = DateManager.Instance
    const disX = (TILE_WIDTH * mapRowCount) / 2
    const disY = (TILE_WIDTH * mapColumnCount) / 2 - 580
    this.stage.setPosition(-disX, -disY)
  }
}
