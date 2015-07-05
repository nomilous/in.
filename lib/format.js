module.exports = Format;

var promise = require('when').promise;
var expander = require('./expander');

// TODO: consider dynamic adapter
// in. as.{{filetype}} ...

function Format() {}

Format.perform = function(opts, inArgs, arg) {
  return promise(function(resolve, reject, notify) {

    var parts, actionArray, adaptersArray, action;
    var i = 0

    arg.value = undefined;
    arg.asArray = false;

    parts = arg.infuse.split(' ').filter(
      function(part) {
        if (part != '') i++;
        if (i < 3) return part !== '';
        return true;
      }
    );

    actionArray = parts[0].split('.');
    adaptersArray = actionArray.splice(2);

    if (actionArray[1] == '') actionArray[1] = 'as';

    arg.actions = [action = {
      action: actionArray,
      adapters: adaptersArray,
      actor: parts[1] || 'default',
      expansion: parts.length > 2 ? parts.splice(2).join(' ') : undefined
    }];


    if ($$in.actorAliases[action.actor]) {
      action.actor = $$in.actorAliases[action.actor];
    }

    actorBase = action.actor.split('.')[0];
    if (typeof $$in.actors[actorBase] == 'undefined') {
      action.expansion = action.actor + (
        action.expansion ? ' ' + action.expansion : ''
      );
      action.actor = 'default';
    }

    return expander.perform(opts, inArgs, arg)
           .then(resolve, reject, notify);

  });
}
