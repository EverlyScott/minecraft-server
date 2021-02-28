var tick
var perTickActions = []

exports.init = () => {
  tick = setInterval(() => {
    for (let i = 0; i < perTickActions.length; i++) {
      perTickActions[i].action()
    }
  }, 46) //46ms = 20 TPS
}

exports.stopTicking = () => {
  clearInterval(tick)
}

class TickAction {
  constructor(actionName, action) {
    this.index = perTickActions.push({
      name: actionName,
      action
    })
  }

  removeAction() {
    perTickActions.splice(this.index, 1)
  }
}

exports.TickAction = TickAction