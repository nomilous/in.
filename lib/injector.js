module.exports = Injector;

promise = require('when').promise;
sequence = require('when/sequence');

function Injector() {}

Injector.perform = function(opts, inArgs, fn) {

  return promise(function(resolve, reject, notify) {
    sequence(Object.keys(inArgs).map(
      function(argName) {
        return function() {
          return promise(function(resolve, reject, notify) {

            var arg = inArgs[argName];

            // if (!arg.infuse && typeof arg.value === 'undefined') {
            //   arg.value = otherArgs.shift();
            // }

            if (typeof opts.$$onInject !== 'function') {
              return resolve(arg.value);
            }

            arg.fn = fn; // access to fn in onInject()

            var onInjectResult = opts.$$onInject(arg, function(err) {
              if (err) return reject(err)
              return resolve(arg.value);
            });

            if (typeof onInjectResult !== 'undefined' && typeof onInjectResult.then === 'function') {
              onInjectResult.then(
                function() {
                  resolve(arg.value);
                },
                reject, notify
              )
            }
          });
        }
      }
    )).then(
      function(args) {
        var result;
        try {
          result = fn.apply(opts.context, args);

          if (typeof result !== 'undefined' 
            && typeof result.then === 'function')
              return result.then(resolve, reject, notify);

          resolve(result);
        } catch (e) {
          reject(e);
        }
      },
      function(error) {
        
        if (inArgs.ee) inArgs.ee.value = error
        else { 
          // opts.onError(error);
          return reject(error);
        }

        var argz = Object.keys(inArgs).map(
          function(argName) {
            return inArgs[argName].value;
          }
        );

        var result
        try {
          result = fn.apply(opts.context, argz);

          if (typeof result !== 'undefined' 
            && typeof result.then === 'function')
              return result.then(resolve, reject, notify);

          resolve(result);
        } catch (e) {
          reject(e);
        }
      }, notify
    )
  })
}
