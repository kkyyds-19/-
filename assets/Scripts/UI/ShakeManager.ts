import { _decorator, Component, game } from 'cc'
import EventManager from '../../Runtime/EventManager'
import { EVENT_ENUM } from '../../Enums'
const { ccclass } = _decorator

@ccclass('ShakeManager')
export class ShakeManager extends Component {
  private isShaking = false
  private oldTime = 0
  private oldPos: { x: number; y: number } = { x: 0, y: 0 }
  private durationMs = 160
  private amount = 12
  private frequency = 28

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this)
  }

  onShake(durationMs?: number, amount?: number) {
    this.oldTime = game.totalTime
    this.isShaking = true

    if (typeof durationMs === 'number' && Number.isFinite(durationMs) && durationMs > 0) {
      this.durationMs = durationMs
    }

    if (typeof amount === 'number' && Number.isFinite(amount) && amount >= 0) {
      this.amount = amount
    }

    this.oldPos.x = this.node.position.x
    this.oldPos.y = this.node.position.y
  }

  update() {
    if (this.isShaking) {
      const elapsedMs = game.totalTime - this.oldTime
      if (elapsedMs >= this.durationMs) {
        this.isShaking = false
        this.node.setPosition(this.oldPos.x, this.oldPos.y)
        return
      }

      const t = elapsedMs / 1000
      const progress = elapsedMs / this.durationMs
      const damper = 1 - progress

      const phaseA = t * this.frequency * Math.PI * 2
      const phaseB = t * (this.frequency * 1.37) * Math.PI * 2

      const offsetX = this.amount * damper * Math.sin(phaseA)
      const offsetY = this.amount * damper * Math.cos(phaseB)

      this.node.setPosition(this.oldPos.x + offsetX, this.oldPos.y + offsetY)
    }
  }
}
