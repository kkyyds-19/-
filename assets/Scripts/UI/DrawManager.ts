import { _decorator, Component, Graphics, view, Color, game } from 'cc'
const { ccclass } = _decorator

enum FADE_STATE_ENUM {
  IDLE = 'IDLE',
  FADE_IN = 'FADE_IN',
  FADE_OUT = 'FADE_OUT',
}

export const DEFAULT_DURATION = 2000
@ccclass('DrawManager')
export class DrawManager extends Component {
  private ctx: Graphics
  private state: FADE_STATE_ENUM = FADE_STATE_ENUM.IDLE
  private oldTime = 0
  private duration = 0
  private fadeResolve: (value: PromiseLike<null>) => void
  init() {
    this.ctx = this.addComponent(Graphics)
    this.setAlpha(1)
  }

  setAlpha(percent: number) {
    this.ctx.clear()
    const size = view.getVisibleSize()
    const maxSide = Math.max(size.width, size.height) * 4
    const halfSide = maxSide / 2

    this.ctx.rect(-halfSide, -halfSide, maxSide, maxSide)
    this.ctx.fillColor = new Color(0, 0, 0, 255 * percent)
    this.ctx.fill()
  }

  update() {
    const percent = (game.totalTime - this.oldTime) / this.duration
    switch (this.state) {
      case FADE_STATE_ENUM.FADE_IN:
        if (percent < 1) {
          this.setAlpha(percent)
        } else {
          this.setAlpha(1)
          this.state = FADE_STATE_ENUM.IDLE
          this.fadeResolve(null)
        }
        break
      case FADE_STATE_ENUM.FADE_OUT:
        if (percent < 1) {
          this.setAlpha(1 - percent)
        } else {
          this.setAlpha(0)
          this.state = FADE_STATE_ENUM.IDLE
          this.fadeResolve(null)
        }
        break
    }
  }

  fadeIn(duration = DEFAULT_DURATION) {
    this.setAlpha(0)
    this.duration = duration
    this.oldTime = game.totalTime
    this.state = FADE_STATE_ENUM.FADE_IN
    return new Promise(resolve => {
      this.fadeResolve = resolve
    })
  }

  fadeOut(duration = DEFAULT_DURATION) {
    this.setAlpha(1)
    this.duration = duration
    this.oldTime = game.totalTime
    this.state = FADE_STATE_ENUM.FADE_OUT
    return new Promise(resolve => {
      this.fadeResolve = resolve
    })
  }
}
