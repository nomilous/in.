module.exports = Format;

var promise = require('when').promise;
var expander = require('./expander');

// TODO: consider dynamic filters
// in. as.{{filetype}} ...

function Format() {}

Format.perform = function(opts, accum, arg) {
  return promise(function(resolve, reject, notify) {

    var match, action, split, actionPlusFilter;
    if (typeof arg.in === 'undefined') {
      arg.in = 'in.module ' + arg.name
    }
    
    action = {};

    var extractFilter = function() {
      if (action.action.match(/\./)) {
        split = action.action.split('.');
        action.action = split.shift();
        action.filters = split;
      } else {
        action.filters = [];
      }
    }

    if (match = arg.in.match(/^in\.\s+(.*?)\s+(.*)/)) {

      action.action = 'as';
      action.filters = [];
      action.actor = match[1];
      // action.expansion = match[2]; // looses multiline
      action.expansion = arg.in.replace(new RegExp('^in.\s+'+action.actor), '').trim();

    } else if (match = arg.in.match(/^in\.(.*?)\s(.*?)\s/)) {

      actionPlusFilter = match[1];
      action.action = match[1];
      extractFilter();
      action.actor = match[2];
      action.expansion = arg.in.replace(new RegExp('^in.'+actionPlusFilter+' '+action.actor), '').trim();

    } else if (match = arg.in.match(/^in\.(.*?)\s(.*?)$/)) {
      action.action = match[1];
      extractFilter();
      action.actor = match[2];
      action.expansion = undefined;

    } else if (match = arg.in.match(/^in.(.*)$/)) {
      action.action = match[1];
      extractFilter();
      action.actor = 'none';
      action.expansion = undefined;
    }

    if ($$in.actorAliases[action.actor]) {
      action.actor = $$in.actorAliases[action.actor];
    }

    // IMPORTANT, in can't find specified actor assume none
    //            and prepend the suspected actor onto expansion

    if (typeof $$in.actors[action.actor] == 'undefined') {
      action.expansion = action.actor + (
        action.expansion ? ' ' + action.expansion : ''
      );
      action.actor = 'none';
    }

    // if ($$in.noActor[action.action]) {
    //   if (action.actor) {
    //     if (action.expansion) action.expansion = action.actor + ' ' + action.expansion;
    //     else action.expansion = action.actor;
    //   }
    //   action.actor = undefined;
    // }

    arg.actions = [action];
    arg.value = undefined;

    return expander.perform(opts, accum, arg)
           .then(resolve, reject, notify);

  });
}
