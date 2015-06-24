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

function DefaultActor(opts, accumulate, actionArg, actorPath) {

  // Actor should return a promise if it wants to async

  // console.log({ACTOR: arguments});

  return $$in.promise(function(resolve, reject, notify) {

    // It is the purpose of an actor to convert the action expansion
    // into a value for injection into the arg.
    //
    // This actor does nothing but that.
    //

    actionArg.value = actionArg.expansion;
    resolve(actionArg);

    //
    //  note
    //  ----
    //
    //  actionArg contains an action, the convention is that
    //  if the action is 'as' then the actor should return
    //  resulting data, but if the action is 'do' then the
    //  actor should return true or false according to success
    //  of the action.
    //
    // console.log(actionArg.action);
    //
    //  Still considering how exactly it incorperate support
    //  for streams, emitters and middleware pipes.
    //
    //  So more actions may come.
    //
    //  Generally, there is no limitation on what actions can
    //  be supported by an actor.
    //  
    //   eg.
    //  
    //      arg, // in.bake oven at {{$o.howHot}} degrees
    //  

  });

}


DefaultActor.$$can = function(action) {

  // Can this actor do this action?

  return 'yes' == 'yes';

  // return false; // or
  // throw new YourInstanceOfError('with message');

}
