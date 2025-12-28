import Singleton from "../Base/Singleton";

interface IItem{
  func:Function
  ctx:unknown
}

/**
 * 事件管理器：提供简单的发布/订阅机制
 * 使用 Map 存储事件名到回调列表的映射
 */
export default class EventManager extends Singleton{

  /** 获取全局唯一实例 */
  static get Instance(){
    return super.GetInstance<EventManager>()
  }

  /** 事件字典：事件名 => 回调与上下文列表 */
  private eventDic : Map<String,Array<IItem>> = new Map()

  /**
   * 订阅事件
   * @param evenName 事件名
   * @param func 回调函数
   * @param ctx 回调中的上下文 (this)
   */
  on(evenName:string,func:Function,ctx:unknown){
    if(this.eventDic.has(evenName)){
    this.eventDic.get(evenName).push({func,ctx})
    }else{
      this.eventDic.set(evenName,[{func,ctx}])
    }
  }

  /**
   * 取消订阅事件
   * @param evenName 事件名
   * @param func 需要移除的回调
   */
  off(evenName:string,func:Function){
     if(this.eventDic.has(evenName)){
      const index = this.eventDic.get(evenName).findIndex(i => i.func === func)
      index > -1 && this.eventDic.get(evenName).splice(index,1)
     }
  }

  /**
   * 触发事件
   * @param evenName 事件名
   * @param params 传入回调的参数
   */
  emit(evenName : string,...params:unknown[]) {
     if(this.eventDic.has(evenName)){
      this.eventDic.get(evenName).forEach(({func,ctx})=>{
        ctx?func.apply(ctx,params):func(...params)

      })
     }
  }

  /** 清空所有事件订阅 */
  clear(){
    this.eventDic.clear()
  }
}


