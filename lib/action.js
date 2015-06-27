module.exports = Action;

var sequence = require('when/sequence');
var promise = require('when').promise;
var InfusionError = require('./error');
var adapter = require('./adapter');

function Action() {}

Action.perform = function(defer, opts, accumulate, arg) {

  // var infuser;
  var actor;
  var actionArgs = [];
  var actorPath;  // this will become a problem if support in.{{dynamic-action}}.{{dynamic-adapter}}

  sequence(arg.actions.map(function(action) {
    return function() {
      return promise(function(resolve, reject, notify) {

        var promise, actorPath, actorName, actionArg;
        actionArgs.push(actionArg = {});

        Object.keys(arg).forEach(
          function(key) {
            if (key == 'actions') return;
            actionArg[key] = arg[key];
          }
        );
        Object.keys(action).forEach(
          function(key) {
            actionArg[key] = action[key];
          }
        );

        actorPath = actionArg.actor.split('.');

        try {
          actor = $$in.actors[actorName = actorPath.shift()];
          Action.validate(action, actor, actorName);
          promise = actor(opts, accumulate, actionArg, actorPath);

          if ( typeof promise === 'undefined'
          || typeof promise.then !== 'function'
          ) return resolve(promise);
          
          promise.then(resolve, reject, notify);

        } catch(e) {
          return reject(e);
        }
      });
    }
  })).then(
    function(results) {
      adapter.perform(opts, accumulate, arg, results).then(
        function() {
          if (arg.asArray) { // per for loop presence
                            // expanders will need to set it
                           // 
                          // and async/callback??
            arg.value = results.map(function(result) {
              return result.value;
            })
          } else {
            arg.value = results[0].value;
          }
          defer.resolve();
        },
        defer.reject, defer.notify
      );
    },
    defer.reject,
    defer.notify
  );  
}

Action.validate = function(action, actor, actorName) {

  var e;

  if (action.adapters.indexOf('pipe') > 0)
    throw new InfusionError('pipe must be first adapter');

  /* goes to none */
  // if (typeof actor === 'undefined' || typeof actor !== 'function')
  //   throw new InfusionError('missing actor');


  if (typeof actor.$$can === 'undefined')
    throw new InfusionError('Actor \'' + actorName + '\' is a bad actor. Missing actor.$$can()');

  if (!actor.$$can(action))
    throw new InfusionError('Actor \'' + actorName + '\' does not support this action'); // TODO: action.toString()

}
