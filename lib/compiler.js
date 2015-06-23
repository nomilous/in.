// TODO: support miltiple expanders per snippet
// TODO: load expansions for actors
// TODO: array expansions in $e for snippets
// TODO: this
// TODO: error

module.exports = Compiler;

var coffee = require('coffee-script');
var promise = require('when').promise;
var sequence = require('when/sequence');

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

    try {
      var spandex, js, matches, expand, expander, argz, config, promise, comma;


        // TODO: test ahead for expanders 

        // if (typeof $$in.expanders[expander] !== 'function'){ 
        //   return reject(new Error()); // TODO - errors
        // }



      if (expansion.eval.match(/expand\./)
        || expansion.eval.match(/async\(/)
        // || expansion.eval.match(/callback\(/) TODO: node style cb       
      ) {

        spandex = Compiler.parseExpanders(expansion);
        js = spandex.pop();

        // spandex contains the reversed list of async expanders
        // js contains their substitues '... $e[3] ... $e[2] ...'

        // This sequence populates the $e[n] so that the final eval
        // has the results of each expansion.

        return sequence(spandex.map(function(x) {
          return function() {

            var promise;
            var expanderFn;
            var deeper; // also enables .call .apply
            var name = x.name;
            deeper = name.split('.');
            expanderFn = $$in.expanders[deeper[0]];
            deeper.shift();

            while (deeper.length > 0) {
              expanderFn = expanderFn[deeper[0]];
              deeper.shift();
            }
            
            expand = 'promise = ' + x.origEval.replace(x.fullName, 'expanderFn');
            eval(expand);
            return promise;

          }
        })).then(
          function(results) {
            $e = results;

            // TODO: properly handle compile / eval problem s
            eval(coffee.compile('resolve('+js+')', {bare: true}))
          },
          reject,
          notify
        )
      }

      // TODO: handle compile error nicely

      eval(coffee.compile('resolve('+expansion.eval+')', {bare: true}));

    } catch (e) {
      return reject(e);  // TODO - errors - will need loads more info on E
    }
  });
}

Compiler.parseExpanders = function(expansion, $e) {

  var evl, bld, found, evals;
  evl = expansion.eval;
  bld = '';
  count = 0;
  evals = [];

  find = function() {
    var m;
    if ((m = bld.match(/^expand\.(.*)\(/)) || (m = bld.match(/^(async)\(/))) {
      var argz = '';
      var brace = false;
      var depth = 0;
      var expander = {};
      var orig = ''
      var fullName;
      for (var j = 0; j < bld.length; j++) {
        orig += bld[j];
        if (bld[j] == '(') {
          fullName = orig.substr(0, orig.length - 1);
          brace = true
          depth++
        } else if (bld[j] == ')') {
          depth--;
          if (depth == 0) break;
        } else if (brace) argz += bld[j];
      }


      expander.argz = argz;
      expander.name = m[1];
      expander.fullName = fullName;
      expander.origEval = orig;
      evals.push(expander);


      bld = bld.replace(orig, '$e[' + count++ + ']');
    }
  }

  for (var i = evl.length - 1; i >= 0; i--) {
    bld = evl[i] + bld
    find();
  }

  evals.push(bld);
  return evals;
}

Compiler.isExpanding = function(expansion) {
  if (expansion.eval.match(/\sfor\s/)) return true;
  // if (expansion.eval.match(/expand\./)) return true;
  return false;
}
