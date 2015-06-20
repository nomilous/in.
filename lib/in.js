module.exports = In;

// for plugins, preserve existing items on $$in
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
$$in.noActor = ($$in.noActor || {});
$$in.noActor.module = {}; // in.module requires no actor

var parse = require('./parse');
var format = require('./format');
var action = require('./action');
var promise = require('when').promise;
var sequence = require('when/sequence');
var parallel = require('when/parallel');


function In() {

  var args = Array.prototype.slice.call(arguments);
  var opts = {};
  var fns  = {};
  var i    = 0;
  var fn;
  return promise(function(resolve, reject, notify) {

    while(fn = args.shift()) {

      if (typeof fn === 'object') Object.keys(fn).forEach(
        function(key) {
          opts[key] = fn[key];
        }
      )
      else {

        var name = fn.name || i++;
        fns[name] = fn;

        process.nextTick(function(){

          var accumulate = {};
          var mode = opts.parallel ? parallel : sequence;
          mode(
            parse(opts, fns[name]).map(function(arg){

              // for each arg, 
              // return a promising function to the sequencer

              return function() {
                return promise(
                  function(resolve, reject, notify) {

                    if (mode.name === 'parallel') accumulate = null;

                    //
                    //                                                        ¿eval|evil?
                    //                                                             |
                    //                                                             |
                    // when not running parallel,                                 \|/  
                    // accumulate contains previously processed args,              v
                    //
                    //!!!1 in.that they can be {manoeuvreType} to format the {next( )} argument's infuser
                    //

                    format.perform(opts, accumulate, arg);

                    if (mode.name === 'sequence') accumulate[arg.name] = arg;
                    action.perform({
                      resolve: resolve,
                      reject: reject,
                      notify: notify,
                    },
                    opts, accumulate, arg);
                  }
                );
              }
            })
          ).then(
            function(res) {

              // all args processed
              resolve(res);

            },
            function(err) {

              // oops
              console.log(err.stack)
              reject(err);

            },
            function(msg) {

              // notify(msg);

            }
          );
        });
      }
    }
  });
}
