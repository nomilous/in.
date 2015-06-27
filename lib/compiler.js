// TODO: support miltiple expanders per snippet
// TODO: load expansions for actors
// TODO: array expansions in $e for snippets
// TODO: this
// TODO: error
// TODO: consider '<' {{ list < fn('specifies promise style asyncer') }}
// TODO: considder '<<' for node style calbackness

module.exports = Compiler;

var coffee = require('coffee-script');
var promise = require('when').promise;
var sequence = require('when/sequence');

function Compiler() {}

Compiler.perform = function(opts, arg, accum, expansion) {

  var conf = {
    opts: opts,          // original $$in({opts}...
    arg: arg,            // this argument
    accumlated: accum    // previous arguments
    // expansion: expansion // this expansion
  }

  // $o access to {{$o.thingInOpts}}

  // var $o = opts;

  // $p access to {{$p.previousArg}}s

  // var $p = accum;

  // $e access to the {{expand.ers()}} result array

  var $e = [];

  // $c access to arg context

  var $c = arg.context;


  // exppansion happens with scope constructed from 
  // opts and previous injection args

  var scope = '';

  Object.keys(opts).forEach(function(name) {
    scope += 'var ' + name + ' = opts.' + name + ';\n'
  });

  Object.keys(accum).forEach(function(name) {
    scope += 'var ' + name + ' = accum.' + name + ';\n'
  });

  eval(scope);


  return promise(function(resolve, reject, notify) {

    arg.asArray = Compiler.isExpanding(expansion);

    try {
      var spandex, js, seq;


        // TODO: test ahead for expanders 

        // if (typeof $$in.expanders[expander] !== 'function'){ 
        //   return reject(new Error()); // TODO - errors
        // }



      if (expansion.eval.match(/expand\./)
        || expansion.eval.match(/async\(/)
        || expansion.eval.match(/callback\(/)     
      ) {

        spandex = Compiler.parseExpanders(expansion);
        js = spandex.pop();
        seq = 0;

        // spandex contains the reversed list of async expanders
        // js contains their substitues '... $e[3] ... $e[2] ...'

        // This sequence populates the $e[n] so that the final eval
        // has the results of each expansion.

        return sequence(spandex.map(function(x) {
          return function() {
            return promise(function(resolve, reject, notify) {

              var totally;
              var promised;
              var expanderFn;
              var deeper; // to. enable .call( .apply(
              var name = x.name;
              var comma;
              arg.$e = $e;
              deeper = name.split('.');
              expanderFn = $$in.expanders[deeper[0]];
              deeper.shift();

              while (deeper.length > 0) {
                expanderFn = expanderFn[deeper[0]];
                deeper.shift();
              }

              comma = x.argz.trim() == '' ? '' : ',';
              run = 'promised = ' + x.origEval.replace(x.fullName + '(', 'expanderFn(conf' + comma);

              eval(coffee.compile(run, {bare: true}));

              if (typeof promised === 'undefined') {
                $e[seq++] = undefined;
                return resolve();
              }

              if (typeof promised.then !== 'function') {
                $e[seq++] = promised;
                return resolve();
              }

              promised.then(
                function(result) {
                  $e[seq++] = result;
                  resolve();
                },
                reject, notify
              )
            })
          }
        })).then(
          function() {

            // TODO: properly handle compile / eval problem s

            var run = 'resolve('+js+')';
            eval(coffee.compile(run, {bare: true}))
          },
          reject,
          notify
        )
      }

      arg.$e = $e; // just to say so: []

      // TODO: handle compile error nicely

      eval(coffee.compile('resolve('+expansion.eval+')', {bare: true}));

    } catch (e) {
      return reject(e);  // TODO - errors - will need loads more info on E
    }
  });
}

Compiler.parseExpanders = function(expansion, $e) {

  var evl, bld, find, inOther, evals;
  evl = expansion.eval;
  bld = '';
  count = 0;
  evals = [];

  // inOther = function(i) {
  //   // is this expander in the args of another
  //   while (i-- > 1) {
  //     if (evl[i] == ',') return true;
  //     if (evl[i] == '(') return true;
  //   }
  //   return false;
  // }

  find = function(i) {
    var m;
    if ( (m = bld.match(/^expand\.(.*)\(/)) 
      || (m = bld.match(/^(async)\(/))
      || (m = bld.match(/^(callback)\(/))
        ) {
      var argz = '';
      var brace = false;
      var depth = 0;
      var expander = {};
      var orig = ''
      var fullName;
      for (var j = 0; j < bld.length; j++) {
        orig += bld[j];
        if (bld[j] == '(') {
          fullName = (fullName || orig.substr(0, orig.indexOf('(')));
          brace = true
          depth++
          if(depth > 1) argz += bld[j];
        } else if (bld[j] == ')') {
          depth--;
          if(depth > 1) argz += bld[j];
          if (depth == 0) break;
        } else if (brace) argz += bld[j];
      }

      // expander.inOther = inOther(i);
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
    find(i);
  }

  evals.push(bld);
  return evals;
}

Compiler.isExpanding = function(expansion) {
  if (expansion.eval.match(/\sfor\s/)) return true;
  // if (expansion.eval.match(/expand\./)) return true;
  return false;
}
