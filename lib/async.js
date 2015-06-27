// Special expander
//
// Runs the passed function inside the expander but returns the results
// as if syncronous.
//
// eg.
//
// $$in( opts = {
//   fn: function(param){ return promise; }
// }, function(
//   arg // in.as {{async('param', fn)}}
// ){})
//
//

module.exports = Async;

function Async(conf, remains) {

  var args = Array.prototype.slice.call(arguments);
  args.shift(); //conf

  var withArgs = [];
  var runFunctions = [];

  while (next = args.shift()) {
    if (typeof next !== 'function') withArgs.push(next)
    else runFunctions.push(next);
  }

  return $$in.sequence(runFunctions.map(function(fn) {
    return function() {
      return fn.apply(null, withArgs);
    }
  }))
}
