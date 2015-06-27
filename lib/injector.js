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

            if (typeof opts.onInject !== 'function') {
              return resolve(inArgs[argName].value);
            }

            inArgs[argName].fn = fn; // access to fn in onInject()

            var onInjectResult = opts.onInject(inArgs[argName], function(err) {
              if (err) return reject(err)
              return resolve(inArgs[argName].value);
            });

            if (typeof onInjectResult !== 'undefined' && typeof onInjectResult.then === 'function') {
              onInjectResult.then(
                function() {
                  resolve(inArgs[argName].value);
                },
                reject, notify
              )
            }
          });
        }
      }
    )).then(
      function(args) {
        var result = fn.apply(opts.context, args);

        if (typeof result !== 'undefined' 
          && typeof result.then === 'function')
            return result.then(resolve, reject, notify);

        return resolve();
      },
      function(error) {
        
        if (inArgs.e) inArgs.e.value = error
        else if (inArgs.err) inArgs.err.value = error
        else if (inArgs.error) inArgs.error.value = error
        else { 
          opts.onError(error);
          return reject(error);
        }

        var argz = Object.keys(inArgs).map(
          function(argName) {
            return inArgs[argName].value;
          }
        );

        var result = fn.apply(opts.context, argz);

        if (typeof result !== 'undefined' 
          && typeof result.then === 'function')
            return result.then(resolve, reject, notify);

        return resolve();

      }, notify
    )
  })
}
