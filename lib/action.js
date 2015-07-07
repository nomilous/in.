module.exports = Action;

var sequence = require('when/sequence');
var promise = require('when').promise;
var InfusionError = require('./error');
var adapter = require('./adapter');
var merge = require('merge');

function Action() {}

Action.perform = function(defer, opts, inArgs, arg) {

  // var infuser;
  var base, actor;
  var actionArgs = [];
  var actorPath;  // this will become a problem if support in.{{dynamic-action}}.{{dynamic-adapter}}

  sequence(arg.actions.map(function(action) {
    return function() {
      return promise(function(resolve, reject, notify) {

        var promise, actorPath, actorName, actorOpts, actionArg;
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
          base = actor = $$in.actors[actorName = actorPath.shift()];
          while (typeof actor !== 'function' && actorPath.length > 0) {
            actor = actor[actorPath.shift()];
                                    //
                                   // walks in - looking for first function
          }

          if (typeof actor !== 'function') {
            return reject(new InfusionError(
              'Actor at \`'+ actionArg.actor +'\' is not a function.'
            ));
          }

          Action.validate(action, base, actorName);

          actorOpts = opts;
          if (opts[actionArg.name]) {
            actorOpts = {};
            merge(actorOpts, opts);
            delete actorOpts[actionArg.name];
            merge(actorOpts, opts[actionArg.name]);
            actorOpts.$$caller = opts.$$caller;
          }
          promise = actor(actorOpts, inArgs, actionArg, actorPath);

          if (typeof promise === 'undefined')
            return resolve(actionArg);
          
          if (typeof promise.then !== 'function')
            return resolve(promise);
          
          promise.then(resolve, reject, notify);

        } catch(e) {
          return reject(e);
        }
      });
    }
  })).then(
    function(results) {

      adapter.perform(opts, inArgs, arg, results).then(
        function() {
          try {
            if (arg.asArray) {
              arg.value = results.map(function(result) {
                return result.value;
              });
              Object.defineProperty(arg.value, 'info', {
                value: arg.info
              });
            } else {
              arg.value = results[0].value;
            }
            defer.resolve();
          } catch (e) {
            defer.reject(e);
          }
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

  if (action.adapters.indexOf('stream') > 0)
    throw new InfusionError('stream must be first adapter');

  if (action.adapters.indexOf('stream') == 0)
    if (action.action[1] !== 'as')
      throw new InfusionError('can only stream in.as');

  if (typeof actor.$$can !== 'function')
    throw new InfusionError('Actor \'' + actorName + '\' is a bad actor. Missing actor.$$can()');

  if (!actor.$$can(action))
    throw new InfusionError('Actor \'' + actorName + '\' does not support this action'); // TODO: action.toString()

}
