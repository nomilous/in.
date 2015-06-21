module.exports = Compiler;

var coffee = require('coffee-script');
var promise = require('when').promise;

function Compiler() {}

Compiler.perform = function(opts, accum, expansions, expansion) {

  var opt = opts, $o = opts;
  var args = accum, $a = accum;
  var exp  = expansions, $e = expansions;

  return promise(function(resolve, reject, notify) {

    try {
      var result, js, matches, expand, expander, argz, config, promise;
      if (expansion.eval.match(/expand\./)) {
        matches = expansion.eval.match(/(expand\.)/g);
        if (matches.length > 1) {
          return reject(new Error()); // TODO - errors
        }
        expand = expansion.eval.match(/expand\.(.*)\((.*)\)/);
        expander = expand[1];
        argz = expand[2];
        if (typeof $$in.expanders[expander] !== 'function'){ 
          return reject(new Error()); // TODO - errors
        }
        config = {
          opts: opts,
          expansion: expansion
        }
        js = 'promise = $$in.expanders.' + expander + '(config, ' + argz + ');';
        try {
          eval(js);
          if (typeof promise == 'undefined' || typeof promise.then !== 'function') {
            return reject(new Error()); // TODO - errors
          }
          return promise.then(
            function(result) {
              resolve(result);
            },
            reject,
            notify
          );
        } catch (e) {
          return reject(e); // TODO - errors
        }
      }
      
      js = coffee.compile(expansion.eval, {bare: true});
      js = 'result = ' + js;
      eval(js);
      return resolve(result);
    } catch (e) {
      return reject(e);  // TODO - errors - will need loads more info on E
    }
  });
}

