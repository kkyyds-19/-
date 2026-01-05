/**
 * 地图砖块类型枚举
 * 用于在关卡数据与生成逻辑中标识不同地形/墙体类型
 */
export enum TILE_TYPE_ENUM {
  WALL_ROW = 'WALL_ROW',
  WALL_COLUMN = 'WALL_COLUMN',
  WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
  WALL_LEFT_TOP = 'WALL_LEFT_TOP',
  WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
  WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
  CLIFF_LEFT = 'CLIFF_LEFT',
  CLIFF_RIGHT = 'CLIFF_RIGHT',
  CLIFF_CENTER = 'CLIFF_CENTER',
  FLOOR = 'FLOOR',
  DEATH = 'DEATH',
  AIRDEATH = 'AIRDEATH',
}

/**
 * 全局事件枚举
 */
export enum EVENT_ENUM {
  /** 进入下一个关卡 */
  NEXT_LEVEL = 'NEXT_LEVEL',
  PLAYER_CTRL = 'PLAYER_CTRL',
  PLAYER_MOVE_END = 'PLAYER_MOVE_END',
  PLAYER_BORN = 'PLAYER_BORN',
  ATTACK_PLAYER = 'ATTACK_PLAYER',
}

//区分玩家是在按“上/下/左/右”还是在执行“左转/右转”指令
export enum CONTROLLER_ENUM {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TURNLEFT = 'TURNLEFT',
  TURNRIGHT = 'TURNRIGHT',
}

export enum FSM_PARAMS_TYPE_ENUM {
  NUMBER = 'NUMBER',
  TRIGGER = 'TRIGGER',
}

export enum PARAME_NAME_ENUM {
  IDLE = 'IDLE',
  TURNLEFT = 'TURNLEFT',
  TURNRIGHT = 'TURNRIGHT',
  DIRECTION = 'DIRECTION',
  BLOCKFRONT = 'BLOCKFRONT',
  BLOCKTURNLEFT = 'BLOCKTURNLEFT',
  ATTACK = 'ATTACK',
  DEATH = 'DEATH',
}

export const getParamKey = (name: keyof typeof PARAME_NAME_ENUM | string) => {
  const k = typeof name === 'string' ? name : String(name)
  const obj = PARAME_NAME_ENUM as any
  return obj && obj[k] ? obj[k] : k
}

export enum DIRECTION_ENUM {
  /** 上：对应二维数组行索引减小 (y-1) */
  TOP = 'TOP',
  /** 下：对应二维数组行索引增加 (y+1) */
  BOTTOM = 'BOTTOM',
  /** 左：对应二维数组列索引减小 (x-1) */
  LEFT = 'LEFT',
  /** 右：对应二维数组列索引增加 (x+1) */
  RIGHT = 'RIGHT',
}

export enum ENTITY_STATE_ENUM {
  IDLE = 'IDLE',
  TURNLEFT = 'TURNLEFT',
  TURNRIGHT = 'TURNRIGHT',
  BLOCKFRONT = 'BLOCKFRONT',
  BLOCKTURNLEFT = 'BLOCKTURNLEFT',
  ATTACK = 'ATTACK',
  DEATH = 'DEATH',
  AIRDEATH = 'AIRDEATH',
}

export enum DIRECTION_ORDER_ENUM {
  TOP = 0,
  BOTTOM = 1,
  LEFT = 2,
  RIGHT = 3,
}
