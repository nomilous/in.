module.exports = Injector;

promise = require('when').promise;

function Injector() {}

Injector.perform = function(args, fn, context) {

  return promise(function(resolve, reject, notify) {
    try {

      var doWithArgs = Object.keys(args).map(function(argName) {
        return args[argName].value;
      });

      var result = fn.apply(context, doWithArgs);

      if (typeof result !== 'undefined' 
        && typeof result.then === 'function')
          return result.then(resolve, reject, notify);

      return resolve();

    } catch (e) {
      return reject(e);
    }
  });
}
