module.exports = None;

var promise = require('when').promise;

function None() {}

$$in.actions.as = ($$in.actions.as || {});
$$in.actions.do = ($$in.actions.do || {});

$$in.actions.as.none = function() {
  return None.as.apply(this, arguments);
}

$$in.actions.do.none = function() {
  return None.do.apply(this, arguments);
}

None.as = function(opts, accum, action, path) {
  return promise(function(resolve) {
    action.value = action.params;
    resolve(action);
  });
}

None.do = function() {
  return promise(function(resolve) {
    action.value = typeof action.params !== 'undefined';
    resolve(action);
  });
}
