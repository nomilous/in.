// This actor is called when no actor was specified or 
// when the specified actor does not exist.
// 
//   eg.
//     
//      arg, // in.as some text
// 
//          Will identify the actor as 'some'.
//          And 'some' isn't one.
//          So it runs this actor instead, with
//          'some' as part of params.
//

module.exports = DefaultActor;

function DefaultActor(opts, inArgs, actionArg, actorPath) {

  // Actor should return a promise if it wants to async

  return $$in.promise(function(resolve, reject, notify) {

    // It is the purpose of an actor to convert the action expansion
    // into a value for injection into the arg.
    //
    // This actor does nothing but that.
    //

    actionArg.value = actionArg.expansion;
    resolve(actionArg);

  });

}


DefaultActor.$$can = function(action) {

  // Can this actor do this action?

  if (action.action[0] == 'out') {

    // This actor cannot do out.

    return false;

    // or throw new InstanceOfError('with message');

  }


  if (action.adapters.indexOf('pipe') >= 0) {

    // This actor does not handle pipe adapter

    return false;

  }

  return true;
}
