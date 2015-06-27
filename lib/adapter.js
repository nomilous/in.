// TODO: possibly allow interpreted adapter args
//
//  eg.
//
//     arg, // in.as.adapterWithParam({{$}}).adapterN ... 
//
//

module.exports = Adapter;

promise = require('when').promise;
sequence = require('when/sequence');

InfusionError = require('./error')

function Adapter() {}

Adapter.perform = function(opts, accumulate, arg, result) {

  var adapters = arg.actions[0].adapters.slice();
  if (adapters.length == 0) adapters = ['none'];

  return sequence(adapters.map(function(name) {
    return function() {
      if (typeof $$in.adapters[name] !== 'function') {
        throw new InfusionError(
          'missing adapter at $$in.adapters.' + name + '()'
        );
      }
      return $$in.adapters[name](
        opts, accumulate, arg, result
      )
    }
  }));
}
