import { _decorator, Component, Node } from 'cc'
const { ccclass, property } = _decorator

/**
 * Predefined variables
 * Name = Scene
 * DateTime = Mon Oct 27 2025 11:44:26 GMT+0800 (中国标准时间)
 * Author = kkyyds19
 * FileBasename = Scene.ts
 * FileBasenameNoExtension = Scene
 * URL = db://assets/Scripts/Scene.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

/**
 * 场景脚本入口：用于绑定全局场景级逻辑
 * 可在 `start()` 中进行初始加载或跳转控制
 */
@ccclass('Scene')
export class Scene extends Component {
  // [1]
  // dummy = '';

  // [2]
  // @property
  // serializableDummy = 0;

  /**
   * 场景启动回调：在此执行初始化流程
   */
  start() {
    // TODO: 根据项目需要添加场景初始化逻辑
  }

  // update (deltaTime: number) {
  //     // [4]
  // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
