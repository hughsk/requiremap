var falafel = require('falafel')
var through = require('through')
var path = require('path')

module.exports = requiremap

function requiremap(map) {
  return function(file) {
    var stream = through(write, end)
    var parsed = false
    var src = ''
    var n = 0

    return stream

    function write(data) {
      src += data
    }

    function resolved() {
      if (--n > 0) return
      if (!parsed) return
      stream.queue(String(src))
      stream.queue(null)
    }

    function end(data) {
      src = falafel(src, function(node) {
        if (!isRequire(node)) return
        var target = node.arguments[0]
        n += 1

        map(file, target, function(err, updated) {
          if (err) return stream.emit('error', err)

          updated = String(updated)
          updated = updated.replace(/\'/g, "'")
          updated = "'" + updated + "'"

          target.update(updated)
          resolved()
        })
      })

      parsed = true
      if (n < 1) return resolved()
    }
  }
}

function isRequire(node) {
  var c = node.callee
  return c
    && node.type === 'CallExpression'
    && c.type === 'Identifier'
    && c.name === 'require'
}
