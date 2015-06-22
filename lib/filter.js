module.exports = Filter;

promise = require('when').promise;

function Filter() {}

Filter.perform = function() {
  return promise(function(resolve, reject, notify) {

    resolve();

  });
}