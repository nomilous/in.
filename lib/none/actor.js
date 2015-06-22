// This actor is called when no actor is specified or does not exist.
// 
//     ie.
//       
//        arg, // in.as some text
//
//            Will identify the actor as 'some'.
//            And 'some' isn't one.
//            So it runs this actor instead, with
//            some as part of params.
//

module.exports = UnknownActor;

var promise = require('when').promise;

function UnknownActor() {}

$$in.actions.as = ($$in.actions.as || {});
$$in.actions.do = ($$in.actions.do || {});

$$in.actions.as.none = function() {
  return UnknownActor.as.apply(this, arguments);
}

$$in.actions.do.none = function() {
  return UnknownActor.do.apply(this, arguments);
}

UnknownActor.as = function(opts, accum, action, path) {
  return promise(function(resolve) {
    action.value = action.params;
    resolve(action);
  });
}

UnknownActor.do = function() {
  return promise(function(resolve) {
    action.value = typeof action.params !== 'undefined';
    resolve(action);
  });
}
