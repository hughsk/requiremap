var browserify = require('browserify')
  , requiremap = require('./')
  , test = require('tape')

test('requiremap', function(t) {
  t.plan(9)

  var b = browserify()
  var n = 0

  var map = requiremap(function(file, node, update) {
    update(null, './' + node.value.slice(0, 1))
  })

  b.add(__dirname + '/fixtures/a.js')
  b.transform(map)

  b.on('file', function(file, id, parent) {
    t.ok(/[a-c]\.js$/.test(file))
    n += 1
  })

  b.bundle({}, function(err, src) {
    t.ifError(err)
    t.equal(n, 7)
  })
})
