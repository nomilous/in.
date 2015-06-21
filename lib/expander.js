module.exports = Expander;

var promise = require('when').promise;

function Expander() {

}

Expander.perform = function(opts, accum, arg, expansions) {
  return promise(function(resolve, reject, notify) {
    resolve(arg);
  })
}