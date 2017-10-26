/* Taken from: https://gist.github.com/iamkvein/2006752 */
var installHookTo = function (obj) {
  if (obj.hook || obj.unhook) {
    throw new Error('Object already has properties hook and/or unhook')
  }

  obj.hook = function (_methName, _fn, _isAsync) {
    let self = this
    let methRef

    // Make sure method exists
    if (!(Object.prototype.toString.call(self[_methName]) === '[object Function]')) {
      throw new Error('Invalid method: ' + _methName)
    }

    // We should not hook a hook
    if (self.unhook.methods[_methName]) {
      throw new Error('Method already hooked: ' + _methName)
    }

    // Reference default method
    methRef = (self.unhook.methods[_methName] = self[_methName])

    self[_methName] = function () {
      var args = Array.prototype.slice.call(arguments)

      // Our hook should take the same number of arguments
      // as the original method so we must fill with undefined
      // optional args not provided in the call
      while (args.length < methRef.length) {
        args.push(undefined)
      }

      // Last argument is always original method call
      args.push(function () {
        var args = arguments

        if (_isAsync) {
          process.nextTick(function () {
            methRef.apply(self, args)
          })
        } else {
          methRef.apply(self, args)
        }
      })

      _fn.apply(self, args)
    }
  }

  obj.unhook = function (_methName) {
    let self = this
    let ref = self.unhook.methods[_methName]

    if (ref) {
      self[_methName] = self.unhook.methods[_methName]
      delete self.unhook.methods[_methName]
    } else {
      throw new Error('Method not hooked: ' + _methName)
    }
  }

  obj.unhook.methods = {}
}

module.exports = installHookTo
