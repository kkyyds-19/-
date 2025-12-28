/**
 * DateManager 运行时数据单例
 * - 保存当前关卡的地图信息与尺寸
 * - 提供关卡索引以便切换关卡
 */
import { log } from "cc";
import Singleton from "../Base/Singleton";
import { ITile } from "../Levels";

export default class DateManager extends Singleton{

  static get Instance(){
    return super.GetInstance<DateManager>()
  }

  /** 地图二维数组（行列分别对应 i/j） */
  mapInfo:Array<Array<ITile>>
  /** 地图行数 */
  mapRowCount:number = 0;
  /** 地图列数 */
  mapColumnCount:number = 0;
  /** 当前关卡索引，默认从 1 开始 */
  levelIndex:number = 1

  reset(){
    this.mapInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
  }


}


//export const DateManagerInstance = new DateManager();
