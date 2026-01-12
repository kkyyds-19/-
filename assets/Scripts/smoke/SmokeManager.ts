import { _decorator } from 'cc'
import { IEntity } from '../../Levels'
import { EntityManager } from '../../Base/EntityManager'
import { SmokeStateMachine } from './SmokeStateMachine'

const { ccclass } = _decorator

@ccclass('SmokeManager')
export class SmokeManager extends EntityManager {
  /**
   * 初始化烟雾
   * @param params 实体参数
   */
  async init(params: IEntity) {
    // 只有第一次初始化时才添加状态机组件
    if (!this.fsm) {
      this.fsm = this.addComponent(SmokeStateMachine)
      await this.fsm.init()
    }

    // 设置节点为激活状态，以便重复利用
    this.node.active = true

    // 调用基类初始化逻辑（处理位置、朝向等）
    await super.init(params)
  }

  /**
   * 回收烟雾：将其隐藏，等待下次复用
   */
  recycle() {
    this.node.active = false
  }
}
