// TODO: support miltiple expanders per snippet
// TODO: load expansions for actors
// TODO: array expansions in $e for snippets

module.exports = Compiler;

var coffee = require('coffee-script');
var promise = require('when').promise;

function Compiler() {}

Compiler.perform = function(opts, arg, accum, expansion) {

  // $o access to {{$o.thingInOpts}}

  var $o = opts;

  // $a access to {{$p.previousArg}}s

  var $p = accum;

  // $e access to the {{expand.ers()}} result array

  var $e;

  // $c access to arg context

  var $c = arg.context;


  return promise(function(resolve, reject, notify) {

    arg.asArray = Compiler.isExpanding(expansion);

    var capture = function(result) {

      if (arg.context.r1)
        if (arg.context.r2)
          if (arg.context.r3)
            if (arg.context.r4)
              arg.context.r5 = result
            else arg.context.r4 = result;
          else arg.context.r3 = result;
        else arg.context.r2 = result;
      else arg.context.r1 = result;

      resolve(result);
    }

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
          arg: arg,
          expansion: expansion,
          accum: accum
        }

        // TODO: consider - if value undefined, substitute from $p and $o

        js = 'promise = $$in.expanders.' + expander + '(config' + comma + argz + ');';
        try {
          eval(js);
          if (typeof promise == 'undefined' || typeof promise.then !== 'function') {
            return reject(new Error()); // TODO - errors
          }
          return promise.then(
            function(result) {
              $e = result;

              if (arg.context.e1)
                if (arg.context.e2)
                  if (arg.context.e3)
                    if (arg.context.e4)
                      arg.context.e5 = $e
                    else arg.context.e4 = $e;
                  else arg.context.e3 = $e;
                else arg.context.e2 = $e;
              else arg.context.e1 = $e;

              try {
                js = 'capture(' + expansion.eval.replace(
                  /expand\..*\(.*\)/, // ? questionable regex, 
                                     //    should swap out 'expander.name(args)'
                  '$e'
                ) + ')';
                // TODO: handle compile error nicely
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

      // TODO: handle compile error nicely

      eval(coffee.compile('capture('+expansion.eval+')', {bare: true}));

    } catch (e) {
      return reject(e);  // TODO - errors - will need loads more info on E
    }
  });
}

Compiler.isExpanding = function(expansion) {
  if (expansion.eval.match(/\sfor\s/)) return true;
  // if (expansion.eval.match(/expand\./)) return true;
  return false;
}
