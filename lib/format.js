module.exports = Format;

var promise = require('when').promise;
var expander = require('./expander');

function Format() {}

Format.perform = function(opts, accum, arg, expansions) {
  return promise(function(resolve, reject, notify) {

    var match, action;
    if (typeof arg.in === 'undefined') {
      arg.in = 'in.module ' + arg.name
    }
    
    action = {};

    if (match = arg.in.match(/^in\.\s+(.*)/)) {
      action.action = 'as';
      action.actor = 'none';
      action.params = match[1];
    } else if (match = arg.in.match(/^in\.(.*?)\s(.*?)\s/)) {
      action.action = match[1];
      action.actor = match[2];
      action.params = arg.in.replace(new RegExp('^in.'+action.action+' '+action.actor), '').trim();
    } else if (match = arg.in.match(/^in\.(.*?)\s(.*?)$/)) {
      action.action = match[1];
      action.actor = match[2];
      action.params = undefined;
    } else if (match = arg.in.match(/^in.(.*)$/)) {
      action.action = match[1];
      action.actor = undefined;
      action.params = undefined;
    }

    if ($$in.actorAliases[action.actor]) {
      action.actor = $$in.actorAliases[action.actor];
    }

    if ($$in.noActor[action.action]) {
      if (action.actor) {
        if (action.params) action.params = action.actor + ' ' + action.params;
        else action.params = action.actor;
      }
      action.actor = undefined;
    }

    arg.actions = [action];
    arg.value = undefined;

    return expander.perform(opts, accum, arg, expansions)
           .then(resolve, reject, notify);

  });
}
