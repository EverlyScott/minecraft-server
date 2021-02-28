const fs = require('fs')

class Permission {
  constructor(permission) {
    this.permission = permission
  }

  hasPermission(user) {
    const perms = readPerms()

    var hasPermission = false
    if (perms.users[user] && perms.users[user].isOp) {
      hasPermission = true
    } else if (perms.users[user] && perms.users[user].permissions.includes(this.permission)) {
      hasPermission = true
    } else if (perms.groups.default.permissions.includes(this.permission)) {
      hasPermission = true
    } else if (perms.users[user]) {
      for (let i = 0; i < perms.users[user].groups.length; i++) {
        if (perms.groups[perms.users[user].groups[i]].permissions.includes(this.permission)) {
          hasPermission = true
        }
      }
    }
    return hasPermission
  }
}

function readPerms() {
  return JSON.parse(fs.readFileSync('lib/permissions.json', 'utf-8'))
}

exports.Permission = Permission

exports.defaultError = (client) => {
  client.write('chat', {
    message: JSON.stringify({
      text: 'You do not have permission to run this command!',
      color: 'red',
      bold: true
    }),
    position: 0,
    sender: '0'
  })
}

exports.isOp = (username) => {
  const perms = readPerms()

  if (perms.users[username] && perms.users[username].isOp) {
    return true
  } else {
    return false
  }
}

exports.runAllUsers = (code) => {
  const perms = readPerms()

  for (var i = 0; i < perms.users.arr.length; i++) {
    const currentName = perms.users.arr[i]
    code(currentName, perms.users[currentName])
  }
}