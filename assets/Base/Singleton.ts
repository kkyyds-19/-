/**
 * Singleton 单例基类
 * 让子类通过 static GetInstance<T>() 获取唯一实例。
 */
export default class Singleton {
  private static _instance: any = null

  //单例模式
  static GetInstance<T>():T{
    if(this._instance === null){
      this._instance = new this()
    }

    return this._instance
  }
}
