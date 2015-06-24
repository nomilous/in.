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

$$in.expanders = ($$in.expanders || {});
// $$in.actions = ($$in.actions || {});
// $$in.actions.as = ($$in.actions.as || {});
// $$in.actions.do = ($$in.actions.do || {});

$$in.actors = ($$in.actors || {});
$$in.actors.none = ($$in.actors.none || require('./none/actor'));

$$in.actorAliases = ($$in.actorAliases || {});
$$in.actorAliases['.'] = 'none';

$$in.filters = ($$in.filters || {});
$$in.filters.none = ($$in.filters.none || require('./none/filter'));

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

  if (typeof opts.onError !== 'function') {
    opts.onError = function(e) {
      // console.log(e.stack);
      console.log(e.toString());
      return process.exit(e.errno || 1);
    }
  }

  return promise(function(resolve, reject, notify) {

    process.nextTick(function(){ // why?

      var accumulate = {};
      var mode = opts.parallel ? parallel : sequence;
      mode(
        parse(opts, fn).map(function(arg){

          // for each arg, 
          // return a promising function to the sequencer

          return function() {
            return promise(
              function(resolve, reject, notify) {

                if (mode.name === 'parallel') accumulate = null;

                format.perform(opts, accumulate, arg).then(
                  function(arg) {
                    if (mode.name === 'sequence') accumulate[arg.name] = arg;
                    action.perform({
                      resolve: resolve,
                      reject: reject,
                      notify: notify,
                    },
                    opts, accumulate, arg);
                  },
                  reject,
                  notify
                );
              }
            );
          }
        })
      ).then(
        function(args) {
          return injector.perform(args, fn)
          .then(resolve, reject, notify);
        },
        function(err) {
          var e = opts.onError(err);
          if (e) return reject(err);
        },
        function(msg) {

          // notify(msg);

        }
      );
    });
  });
}
