# requiremap #

A [browserify](http://browserify.org) transform stream for aliasing `require`
statements. You can use it to write your own transforms for things like custom
extensions and module resolution.

## Installation ##

``` bash
npm install requiremap
```

## Usage ##

### `require('requiremap')(map)` ###

Calls `map(file, node, update)` for each require detected.

* `file` is the absolute path to the file requiring the module.
* `node` is an AST node from [falafel](http://ghub.io/falafel).
  In most cases, you should be fine getting `node.value` for the
  module name.
* `update(err, updated)` is a callback you should call with the new
  string to place in the require statement - this must be called.
  If you don't want to update it, just use `update()` without
  any arguments.

``` javascript
var browserify = require('browserify')
var requiremap = require('requiremap')
var b = browserify()

b.add(__dirname + '/src/index.js')

// "async" -> "./a.js"
// "beefy" -> "./b.js"
// "./src" -> "./src"
b.transform(requiremap(function(file, node, update) {
  if (node.value[0] === '/') return update()
  if (node.value[0] === '.') return update()
  update(null, './' + node.value.slice(0, 1))
}))

b.bundle.pipe(process.stdout)
```
