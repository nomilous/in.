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

Compiler.perform = function(opts, argument, inArgs, expansion) {

  var conf = {
    opts: opts,          // original $$in({opts}...
    arg: argument,       // this argument
    inArgs: inArgs       // previous arguments
  }

  // $e access to the {{expand.ers()}} result array

  var $e = [];

  // $c access to arg context

  // var $c = arg.context;

  var adapters = argument.actions[0].adapters;

  var asJs = adapters.indexOf('js') >= 0 ? true : false;

                           // opts.resolve, reject, notify come shortly into scope
                          //
  return promise(function(Resolve, Reject, Notify) {

    eval(Compiler.buildScope(opts, inArgs));

    var capture = function(runResult) {
      var result;

      if (typeof runResult !== 'function') return Resolve(runResult);
      if (adapters.indexOf('function') >= 0) return Resolve(runResult);

      // no way to get arguments in (yet?)
      try {
        result = runResult();
        if (typeof result !== 'undefined' && typeof result.then === 'function') {
          return result.then(Resolve, Reject, Notify);
        }
        return Resolve(result);
      } catch (e) {
        return Reject(e);
      }
      
    }

    try {
      var spandex, js, seq;


        // TODO: test ahead for expanders 

        // if (typeof $$in.expanders[expander] !== 'function'){ 
        //   return Reject(new Error()); // TODO - errors
        // }

      if (expansion.eval.match(/\$\$/)) {

        spandex = Compiler.parseExpanders(expansion);
        js = spandex.pop();
        seq = 0;

        // spandex contains the reversed list of async expanders
        // js contains their substitues '... $e[3] ... $e[2] ...'

        // This sequence populates the $e[n] so that the final eval
        // has the results of each expansion.

        return sequence(spandex.map(function(x) {
          return function() {
            return promise(function(Resolve, Reject, Notify) {

              var totally;
              var promised;
              var expanderFn;
              var deeper; // to. enable .call( .apply(
              var name = x.name;
              var comma;
              argument.$e = $e;
              deeper = name.split('.');
              expanderFn = $$in.expanders[deeper[0]];
              deeper.shift();

              while (deeper.length > 0) {
                expanderFn = expanderFn[deeper[0]];
                deeper.shift();
              }

              comma = x.argz.trim() == '' ? '' : ',';
              run = 'promised = ' + x.origEval.replace(x.fullName + '(', 'expanderFn(conf' + comma);

              if (asJs) eval(run);
              else eval(coffee.compile(run, {bare: true}));

              if (typeof promised === 'undefined') {
                $e[seq++] = undefined;
                return Resolve();
              }

              if (typeof promised.then !== 'function') {
                $e[seq++] = promised;
                return Resolve();
              }

              promised.then(
                function(result) {
                  $e[seq++] = result;
                  Resolve();
                },
                Reject, Notify
              )
            })
          }
        })).then(
          function() {

            // TODO: properly handle compile / eval problem s

            var run = 'capture('+js+')';
            if (asJs) eval(run)
            else eval(coffee.compile(run, {bare: true}))
          },
          Reject,
          Notify
        )
      }

      argument.$e = $e; // just to say so: []

      if (asJs) eval('capture('+expansion.eval+')')
      else eval(coffee.compile('capture('+expansion.eval+')', {bare: true}));

    } catch (e) {
      return Reject(e);  // TODO - errors - will need loads more info on E
    }
  });
}

Compiler.buildScope = function(opts, inArgs)  {
  var scope = '';

  // objects in opts and previousArgs are in scope in. {{these}}

  Object.keys(opts).forEach(function(name) {
    if (name == 'opts') return; // no overwrite
    if (name == 'argument') return; // of existing
    if (name == 'inArgs') return; // scope
    if (name == 'expansion') return;
    scope += 'var ' + name + ' = opts.' + name + ';\n'
  });

  Object.keys(inArgs).forEach(function(name) {
    if (name == 'opts') return;
    if (name == 'argument') return;
    if (name == 'inArgs') return;
    if (name == 'expansion') return;
    scope += 'var ' + name + ' = inArgs.' + name + '.value;\n'
  });

  // hidden on opts

  scope += '\nvar resolve = opts.resolve, reject = opts.reject, notify = opts.notify;\n';

  return scope;
}

Compiler.parseExpanders = function(expansion, $e) {

  var evl, bld, find, inOther, evals;
  evl = expansion.eval;
  bld = '';
  count = 0;
  evals = [];

  find = function(i) {
    var m;
    if (m = bld.match(/^\$\$(.*?)\(/) ) {
      if (m[1].match(/^in$/) || m[1].match(/^in\./) || m[1].match(/^out$/)) return;

      // take a little more work to not need the braces
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
