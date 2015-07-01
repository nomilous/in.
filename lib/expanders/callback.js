// Same as async, but for node callbacks instead of promises

module.exports = Callback;

function Callback(conf, remains) {

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
      return $$in.promise(function(resolve, reject) {

        var args = Array.prototype.slice.call(withArgs);
        
        args.push(callback = function(error, result) {
          if (error) return reject(error);
          resolve(result);
        });
        return fn.apply(null, args);
      })
    }
  }))
}
