#!/usr/bin/env node

require('../');

function TheOneRing() {

  $$in(function            (     one) { // in.as.ring To.rule them {{resolve Infinity}}
  }).then($$in(function    (all, one) { // in.as.ring To.bind them {{resolve Infinity}}
  })).then($$in(function   (all, one) { // in.as.ring To.bring them {{ throw Infinity }}
  })) .catch($$in(function (all, and) { // in. The.darkness find them!
  }));

}



$$in.adapters.ring = function(opts, inArgs, arg, results) {
  // return $$in(function(resolve, reject, notify) {
  //   // console.log(results);
  //   resolve(results);
  // });
  return results;
}

$$in.actors.To = {
  rule: function(opts, inArgs, actionArg, actorPath) {
    /* actor assigns value from expansion */
    actionArg.value = actionArg.expansion;
    console.log(actionArg.expansion);
    return actionArg;
  },
  bind: function(opts, inArgs, actionArg, actorPath) {
    console.log(actionArg.expansion);
    return actionArg;
  },
  bring: function(opts, inArgs, actionArg, actorPath) {
    return actionArg;
  },
  $$can: function(){ return true }
}

$$in.actors.The = {
  darkness: function(opts, inArgs, actionArg, actorPath) {
    console.log(actionArg.expansion);
    return actionArg;
  },
  $$can: function(){ return true }
}

TheOneRing();
