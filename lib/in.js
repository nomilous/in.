var debug = require('debug')('in.');

module.exports = In;

// preserve existing items on $$in

var keeps = {};
if (typeof $$in !== 'undefined') {
  Object.keys($$in).forEach(function(keeper){
    keeps[keeper] = $$in[keeper]
  });
}
Object.defineProperty(global, '$$in', {
  enumerable: false,
  configurable: true,
  value: In
});
for (keeper in keeps) {
  $$in[keeper] = keeps[keeper];
}


$$in.InfusionError = require('./error');
$$in.actors = ($$in.actors || {});
$$in.actors.default = ($$in.actors.default || require('./actors/default'));
$$in.actorAliases = ($$in.actorAliases || {});
$$in.actorAliases['.'] = 'actors';
$$in.adapters = ($$in.adapters || {});
$$in.adapters.default = ($$in.adapters.defaut || require('./adapters/default'));
$$in.adapters.function = ($$in.adapters.function || require('./adapters/function'));
$$in.adapters.js = ($$in.adapters.js || require('./adapters/js'));
$$in.adapters.stderr = ($$in.adapters.stderr || require('./adapters/stderr'));
$$in.adapters.stream = ($$in.adapters.stream || require('./adapters/stream'));
$$in.adapters.buffer = ($$in.adapters.buffer || require('./adapters/buffer'));
$$in.expanders = ($$in.expanders || {});
$$in.expanders.async = require('./expanders/async');
$$in.expanders.callback = require('./expanders/callback');


var dir = require('in.expander.dir');
var shell = require('in.actor.read');
var read = require('in.actor.shell');
var lines = require('in.adapter.lines');
var json = require('in.adapter.json');
var parse = require('./parse');
var format = require('./format');
var action = require('./action');
var injector = require('./injector');
var promise = require('when').promise;
var sequence = require('when/sequence');
var parallel = require('when/parallel');

$$in.promise = promise;  //convenience
$$in.sequence = sequence; // provide bits of
$$in.parallel = parallel;  //  when.js

function In() {

  var args = Array.prototype.slice.call(arguments);
  var opts, fn, run;
  if (typeof (opts = args.shift()) == 'function') {
    fn = opts;
    opts = {};
  } else {
    fn = args.shift();
  }

  if (typeof fn == 'undefined') return;

  var inFnString = fn.toString();

  var inArgs = parse(opts, fn);

  // non enumarable properties, allowing use of opts
  // as jobchain payload object without visible pollution

  if (typeof opts.$$specialArgs == 'undefined') {
    Object.defineProperty(opts, '$$specialArgs', {
      enumerable: false,
      value: opts.specialArgs || []
    });
  }

  Object.defineProperty(opts, '$$onInject', {
    enumerable: false,
    configurable: true,
    value: opts.$$onInject || undefined
  })

  Object.defineProperty(opts, '$$pend', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: opts.$$pend || false
  })

  Object.defineProperty(opts, '$$caller', {
    enumerable: false,
    configurable: true,
    value: In.getCaller()
  })

  opts.$$specialArgs.push('resolve');
  opts.$$specialArgs.push('reject');
  opts.$$specialArgs.push('notify');
  opts.$$specialArgs.push('ee');

  Object.keys(inArgs).forEach(function(name) {
    var arg = inArgs[name];
    if (!arg.infuse) {
      if (opts.$$specialArgs.indexOf(arg.name) >= 0) return;

      // $$pend is set true if naked args present
      // (no infuse and not special)
      
      opts.$$pend = true;
    }
  });

  run = function() {

    var otherArgs = Array.prototype.slice.call(arguments);

    return promise(function(resolve, reject, notify) {

      // if (typeof fn == 'undefined') return resolve(opts);

      var mode = opts.parallel ? parallel : sequence;

      // access promise in moustach

      Object.defineProperty(opts, 'resolve', {
        enumerable: false,
        configurable: true,
        value: resolve
      });

      Object.defineProperty(opts, 'reject', {
        enumerable: false,
        configurable: true,
        value: reject
      });

      Object.defineProperty(opts, 'notify', {
        enumerable: false,
        configurable: true,
        value: notify
      });

      if (inArgs.resolve) {
        delete inArgs.resolve.infuse; // cannot infuse resolve
        inArgs.resolve.value = resolve;
      }

      if (inArgs.reject) {
        delete inArgs.reject.infuse;
        inArgs.reject.value = reject;
      }

      if (inArgs.notify) {
        delete inArgs.notify.infuse;
        inArgs.notify.value = notify; // TODO: same ""channel"" as $$in runtime??
      }

      // if (typeof opts.onError !== 'function') {
      //   opts.onError = function(ee) {
      //     if (ee instanceof Error) {
      //       console.log(ee.toString());
      //       // console.log(e.stack);
      //       process.exit(ee.errno || 1);
      //     }
      //     return ee;
      //   }
      // }

      // preload existing args

      Object.keys(inArgs).forEach(function(name) {
        var arg = inArgs[name];
        if (!arg.infuse) {
          if (opts.$$specialArgs.indexOf(arg.name) >= 0) return;
          arg.value = otherArgs.shift();
        }
      });

      mode(Object.keys(inArgs).map(function(argName){
        var arg = inArgs[argName];
        return function() {
          return promise(
            function(resolve, reject, notify) {
              inArgs[arg.name] = arg;

              if (!arg.infuse) return resolve();

              format.perform(opts, inArgs, arg).then(
                function(arg) {

                  debug(arg.infuse);

                  action.perform({
                    resolve: resolve,
                    reject: reject,
                    notify: notify,
                  },
                  opts, inArgs, arg);
                },
                reject,
                notify
              );
            }
          );
        }
      })).then(
        function() {
          injector.perform(opts, inArgs, fn).then(
            function() {}, // fn should use injected resolver
            function(error) {reject(error)}
          )
        },
        function(err) {

          if (inArgs.ee) inArgs.ee.value = err
          else {
            // opts.onError(err);
            return reject(err);
          }

          injector.perform(opts, inArgs, fn).then(
            function() {},
            function(error) {reject(error)}
          )
        },
        function(msg) {

          // notify(msg);

        }
      );
    });
  }

  // Masquerade run() as original function for injectors

  run.toString = function() {
    return inFnString;
  }

  if (opts.$$pend) return run;
  else return run();

}

In.pend = function(opts, fn) {
  if (typeof opts === 'function') {
    fn = opts;
    opts = {}
  }
  opts.$$pend = true;
  return In(opts, fn);
}

In.getCaller = function() {
  var prep = Error.prepareStackTrace;
  Error.prepareStackTrace = function(e, stack){return stack;}
  var e = new Error();
  var frame = e.stack[2];
  Error.prepareStackTrace = prep;
  return {
    FileName: frame.getFileName(),
    LineNumber: frame.getLineNumber(),
    ColumnNumber: frame.getColumnNumber()
  }
}
