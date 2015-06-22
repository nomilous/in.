module.exports = Compiler;

var coffee = require('coffee-script');
var promise = require('when').promise;

function Compiler() {}

Compiler.perform = function(opts, arg, accum, expansions, expansion) {

  var opt = opts, $o = opts;
  var args = accum, $a = accum;
  var exp  = expansions, $e = expansions;

  return promise(function(resolve, reject, notify) {

    arg.asArray = Compiler.isExpanding(expansion);

    try {
      var js, matches, expand, expander, argz, config, promise, comma;
      if (expansion.eval.match(/expand\./)) {
        matches = expansion.eval.match(/(expand\.)/g);
        if (matches.length > 1) {
          return reject(new Error()); // TODO - errors
        }
        expand = expansion.eval.match(/expand\.(.*)\((.*)\)/);
        expander = expand[1];
        argz = expand[2];
        comma = argz.length > 0 ? ', ' : '';
        if (typeof $$in.expanders[expander] !== 'function'){ 
          return reject(new Error()); // TODO - errors
        }
        config = {
          opts: opts,
          expansion: expansion
        }
        js = 'promise = $$in.expanders.' + expander + '(config' + comma + argz + ');';
        try {
          eval(js);
          if (typeof promise == 'undefined' || typeof promise.then !== 'function') {
            return reject(new Error()); // TODO - errors
          }
          return promise.then(
            function(result) {
              var $d = result;
              try {
                js = 'resolve(' + expansion.eval.replace(
                  /expand\..*\(.*\)/, // ? questionable regex, 
                                     //    should swap out 'expander.name(..args)'
                  '$d'
                ) + ')';
                eval(coffee.compile(js, {bare: true}));
              } catch (e) {
                return reject(e) // TODO - errors
              }
            },
            reject,
            notify
          );
        } catch (e) {
          return reject(e); // TODO - errors
        }
      }
      
      eval(coffee.compile('resolve('+expansion.eval+')', {bare: true}));

    } catch (e) {
      return reject(e);  // TODO - errors - will need loads more info on E
    }
  });
}

Compiler.isExpanding = function(expansion) {
  if (expansion.eval.match(/\sfor\s/)) return true;
  if (expansion.eval.match(/expand\./)) return true;
  return false;
}
