import { _decorator, Component, input, Input, KeyCode, EventKeyboard } from 'cc'
import EventManager from '../../Runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../Enums'
const { ccclass, property } = _decorator

@ccclass('ControllerManager')
export class ControllerManager extends Component {
  onLoad() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
  }

  onDestroy() {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this)
  }

  onKeyDown(event: EventKeyboard) {
    if (event.keyCode === KeyCode.SPACE) {
      EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, CONTROLLER_ENUM.ATTACK)
    }
  }

  handleCtrl(evt: Event, type: string) {
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, type as CONTROLLER_ENUM)
  }
}
