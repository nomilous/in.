module.exports = Format;

var promise = require('when').promise;
var expander = require('./expander');

// TODO: consider dynamic adapter
// in. as.{{filetype}} ...

function Format() {}

Format.perform = function(opts, accum, arg) {
  return promise(function(resolve, reject, notify) {

    var base, match, action, split, actionPlusAdapter;
    // if (typeof arg.in === 'undefined') {
    //   arg.in = 'in.module ' + arg.name
    // }
    
    base = 'in';
    action = {};

    var extractAdapter = function() {
      if (action.action.match(/\./)) {
        split = action.action.split('.');
        action.action = split.shift();
        action.adapters = split;
      } else {
        action.adapters = [];
      }
    }

    if (match = arg.infuse.match(/^(in|out)\.\s+(.*?)\s+(.*)/)) {

      base = match[1];
      action.action = 'as';
      action.adapters = [];
      action.actor = match[2];
      // action.expansion = match[2]; // looses multiline

      if (!action.actor.match(/\{\{/)) {
        action.expansion = arg.infuse.replace(new RegExp('^(in|out).\s+'+action.actor), '').trim();
      } else {
        action.expansion = arg.infuse.replace(new RegExp('^(in|out).\s+'), '').trim();
        action.actor = 'none';
      }

    } else if (match = arg.infuse.match(/^(in|out)\.(.*?)\s(.*?)\s/)) {

      base = match[1];
      actionPlusAdapter = match[2];
      action.action = match[2];
      extractAdapter();
      action.actor = match[3];

      if (!action.actor.match(/\{\{/)) {
        action.expansion = arg.infuse.replace(new RegExp('^(in|out).'+actionPlusAdapter+' '+action.actor), '').trim();
      } else {
        action.expansion = arg.infuse.replace(new RegExp('^(in|out).'+actionPlusAdapter), '').trim();
        action.actor = 'none';
      }

    } else if (match = arg.infuse.match(/^(in|out)\.(.*?)\s(.*?)$/)) {
      
      base = match[1];
      action.action = match[2];
      extractAdapter();
      action.actor = match[3];
      action.expansion = undefined;

    } else if (match = arg.infuse.match(/^(in|out).(.*)$/)) {

      base = match[1];
      action.action = match[2];
      extractAdapter();
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

    action.action = [base, action.action];

    arg.actions = [action];
    arg.value = undefined;

    return expander.perform(opts, accum, arg)
           .then(resolve, reject, notify);

  });
}
