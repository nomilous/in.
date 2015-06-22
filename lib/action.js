module.exports = Action;

var sequence = require('when/sequence');
var promise = require('when').promise;

function Action() {}

Action.perform = function(defer, opts, accumulate, expansions, arg) {

  var infuser;
  var actionArgs = [];
  sequence(arg.actions.map(function(action) {
    return function() {
      return promise(function(resolve, reject, notify) {

        var promise, e, pathStr, actionPath, actorPath, actionArg;
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

        actionPath = actionArg.action.split('.');
        pathStr = actionArg.action;
        if (actionArg.actor) {
          actorPath = actionArg.actor.split('.');
          pathStr += '.' + actionArg.actor;
        }

        try {
          infuser = Action.getFunction($$in.actions, actionPath, false);
          if (actorPath) {
            infuser = Action.getFunction(infuser, actorPath, true);
          }
        } catch(e) {}

        if (typeof infuser !== 'function') {
          return reject(
            e = new Error('No function at $$in.actions.' + pathStr),
            e.name = 'InfusionError',
            e
          )
        }

        try {
          promise = infuser(opts, accumulate, actionArg, actorPath);
        } catch (e) {
          return reject(e);
        }

        if ( typeof promise === 'undefined'
         || typeof promise.then !== 'function'
        ) return resolve(promise);

        promise.then(resolve, reject, notify);

      });
    }
  })).then(
    function(results) {
      if (typeof infuser.onExpanded == 'function') {
                                              
                                          // questionable? may vanish
                                         //  
        return defer.resolve(infuser.onExpanded(arg, actionArgs, expansions, results));
      }
      if (arg.asArray) {
        return defer.resolve(results);
      }
      else {
        return defer.resolve(results[0]);
      }
    },
    function(error) {
      // if (typeof infuser.onError == 'function') {
      // }
      defer.reject(error);
    },
    defer.notify
  );  
}

Action.getFunction = function(ptr, path, isActor) {
  var key = path.shift();
  if (!key) return ptr;
  if (!ptr[key]) throw new Error();
  ptr = ptr[key];
  if (typeof ptr === 'function' && isActor) return ptr;
  return Action.getFunction(ptr, path, isActor);
}


