// TODO: support templating in infuser


    // for make it easy to experiment
   //  - define this function
  // - and get all the format calls
 //
//global.$$in.format = function(opts, accum, arg) {}

module.exports = Format;

function Format() {}

Format.perform = function(opts, accum, arg) {
  var match;
  if (typeof arg.in === 'undefined') {
    arg.in = 'in.module ' + arg.name
  }
  if (match = arg.in.match(/in\.(.*?)\s(.*?)\s/)) {
    arg.action = match[1];
    arg.actor = match[2];
    arg.params = arg.in.replace(new RegExp('^in.'+arg.action+' '+arg.actor), '').trim();
  } else if (match = arg.in.match(/in\.(.*?)\s(.*?)$/)) {
    arg.action = match[1];
    arg.actor = match[2];
    arg.params = undefined;
  } else if (match = arg.in.match(/in.(.*)$/)) {
    arg.action = match[1];
    arg.actor = undefined;
    arg.params = undefined;
  }

  if ($$in.noActor[arg.action]) {
    if (arg.actor) {
      if (arg.params) arg.params = actor + ' ' + arg.params;
      else arg.params = arg.actor;
    }
    arg.actor = undefined;
  }

  if (typeof $$in.format == 'function') {
    $$in.format.call(null, arguments)
  }

}
