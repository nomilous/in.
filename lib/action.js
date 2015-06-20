module.exports = Action;

function Action() {}

Action.perform = function(defer, opts, accumulate, arg) {
  var infuser, promise, e, pathStr, actionsPath, actorPath;
  var actionsPath = arg.action.split('.');
  pathStr = arg.action;
  if (arg.actor) {
    actorPath = arg.actor.split('.');
    pathStr += '.' + arg.actor;
  }
  
  try {
    infuser = Action.getFunction($$in.actions, actionsPath, false);
    if (actorPath) {
      infuser = Action.getFunction(infuser, actorPath, true);
    }
  } catch(e) {}

  if (typeof infuser !== 'function') {
    return defer.reject(
      e = new Error('No function at $$in.actions.' + pathStr),
      e.name = 'InfusionError',
      e
    )
  }

  promise = infuser(opts, accumulate, arg, actorPath);

  if ( typeof promise === 'undefined'
   || typeof promise.then !== 'function'
  ) return defer.resolve(promise);

  promise.then(defer.resolve, defer.reject, defer.notify);
  
}

Action.getFunction = function(ptr, path, isActor) {
  var key = path.shift();
  if (!key) return ptr;
  if (!ptr[key]) throw new Error();
  ptr = ptr[key];
  if (typeof ptr === 'function' && isActor) return ptr;
  return Action.getFunction(ptr, path, isActor);

}
