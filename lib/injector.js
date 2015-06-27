module.exports = Injector;

promise = require('when').promise;

function Injector() {}

Injector.perform = function(args, fn, context) {

  return promise(function(resolve, reject, notify) {
    try {

      console.log('\ninject:\n', args);

      

      // var result = fn.apply(context, args.map(function(arg) {
      //   if (arg instanceof Array) return arg.map(function(action) {
      //     return action.value;
      //   });
      //   return arg.value;
      // }));

      // if (typeof result !== 'undefined' 
      //   && typeof result.then === 'function')
      //     return result.then(resolve, reject, notify);

      // return resolve();

    } catch (e) {
      return reject(e);
    }
  });
}
