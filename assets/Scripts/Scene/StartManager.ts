import { _decorator, Component, director } from 'cc'
import FaderManager from '../../Runtime/FaderManager'
const { ccclass, property } = _decorator

@ccclass('StartManager')
export class StartManager extends Component {
  private inTransition = false

  async onLoad() {
    FaderManager.Instance.fader.setAlpha(1)
    await FaderManager.Instance.fadeOut(500)
  }

  async onClickStart() {
    if (this.inTransition) {
      return
    }
    this.inTransition = true
    await FaderManager.Instance.fadeIn(500)
    director.loadScene('scene')
  }
}
