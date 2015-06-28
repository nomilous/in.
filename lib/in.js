module.exports = In;

// TODO: opts.pend

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


// list of actions requiring no actor
// $$in.noActor = ($$in.noActor || {});
// $$in.noActor.module = {}; // in.module requires no actor


// $$in.actions = ($$in.actions || {});
// $$in.actions.as = ($$in.actions.as || {});
// $$in.actions.do = ($$in.actions.do || {});

$$in.actors = ($$in.actors || {});
$$in.actors.default = ($$in.actors.default || require('./actors/default'));

$$in.actorAliases = ($$in.actorAliases || {});
$$in.actorAliases['.'] = 'actors';

$$in.adapters = ($$in.adapters || {});
$$in.adapters.default = ($$in.adapters.defaut || require('./adapters/default'));
$$in.adapters.function = ($$in.adapters.function || require('./adapters/function'));
$$in.adapters.js = ($$in.adapters.js || require('./adapters/js'));

$$in.expanders = ($$in.expanders || {});
$$in.expanders.async = require('./async');
$$in.expanders.callback = require('./callback');

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
  var opts, fn;
  if (typeof (opts = args.shift()) == 'function') {
    fn = opts;
    opts = {};
  } else {
    fn = args.shift();
  }

  return promise(function(resolve, reject, notify) {

    if (typeof fn == 'undefined') return resolve(opts);

    var inArgs = parse(opts, fn);
    var mode = opts.parallel ? parallel : sequence;

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
      inArgs.notify.value = notify; // same ""channel"" as $$in runtime??
    }

    if (typeof opts.onError !== 'function') {
      opts.onError = function(e) {
        console.log(e.toString());
        process.exit(e.errno || 1);
      }
    }

    mode(Object.keys(inArgs).map(function(argName){
      var arg = inArgs[argName];
      return function() {
        return promise(
          function(resolve, reject, notify) {
            inArgs[arg.name] = arg;

            if (!arg.infuse) return resolve();

            format.perform(opts, inArgs, arg).then(
              function(arg) {
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
        if (inArgs.resolve || inArgs.reject) {
          return injector.perform(opts, inArgs, fn)
        }

        return injector.perform(opts, inArgs, fn)
        .then(resolve, reject, notify);
      },
      function(err) {

        if (inArgs.e) inArgs.e.value = err
        else if (inArgs.err) inArgs.err.value = err
        else if (inArgs.error) inArgs.error.value = err
        else {
          opts.onError(err);
          return reject(err);
        }

        return injector.perform(opts, inArgs, fn)
        .then(resolve, reject, notify);

      },
      function(msg) {

        // notify(msg);

      }
    );
  });
}
