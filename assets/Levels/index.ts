/**
 * 关卡数据入口与类型定义
 * - `ITile` 表示单个瓦片：`src` 为资源编号，`type` 为瓦片类型
 * - `ILevel` 表示关卡：包含二维 `mapInfo`
 * - `levels` 收集各个关卡并以键名暴露
 */
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from '../Enums'
import level1 from './level1'
import level2 from './level2'

export interface IEntity {
  x: number
  y: number
  type: ENTITY_TYPE_ENUM
  direction: DIRECTION_ENUM
  state: ENTITY_STATE_ENUM
}

export interface ISpikes {
  x: number
  y: number
  type: ENTITY_TYPE_ENUM
  count: number
}
/** 单个瓦片的数据结构 */
export interface ITile {
  src: number | null
  type: TILE_TYPE_ENUM | null
}

/** 关卡的数据结构 */
export interface ILevel {
  mapInfo: Array<Array<ITile>>
}
const levels: Record<string, ILevel> = {
  level1,
  level2,
}

export default levels
