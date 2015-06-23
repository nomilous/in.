// TODO: possibly allow interpreted filter args
//
//  eg.
//
//     arg, // in.as.filterWithParam({{$}}).filter ... 
//
//

module.exports = Filter;

promise = require('when').promise;
sequence = require('when/sequence');

InfusionError = require('./error')

function Filter() {}

Filter.perform = function(opts, accumulate, arg, result) {

  var filters = arg.actions[0].filters.slice();
  if (filters.length == 0) filters = ['none'];

  return sequence(filters.map(function(filterName) {
    return function() {
      if (typeof $$in.filters[filterName] !== 'function') {
        throw new InfusionError(
          'missing filter at $$in.filters.' + filterName + '()'
        );
      }
      return $$in.filters[filterName](
        opts, accumulate, arg, result
      )
    }
  }));
}
