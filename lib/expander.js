module.exports = Expander;

var promise = require('when').promise;
var sequence = require('when/sequence');
var compiler = require('./compiler');

function Expander() {}

Expander.perform = function(opts, accum, arg) {
  return promise(function(resolve, reject, notify) {

    arg.context = {};
    var template = arg.actions[0].params;
    if (!template) return resolve(arg);

    var expansions = [];
    var embedded;
    var part = '';
    var parts = [];

    for (var i = template.length - 1; i >= 0; i--) {
      if (template[i]+template[i-1] == '}}') {
        i--;
        embedded = '';
        parts.unshift(part);
        part = '';
        continue;
      }
      if (template[i]+template[i-1] == '{{') {
        expansions.push({eval:embedded});
        embedded = undefined
        i--;
        continue;
      }
      if (typeof embedded !== 'undefined') {
        embedded = template[i] + embedded.toString();
      } 
      else {
        part = template[i] + part;
      }
    }
    parts.unshift(part);

    if (expansions.length > 0) {
      arg.actions[0].params = ''; // rebuilding it
      var first = parts.pop();
      return sequence(expansions.map(function(expansion){
        return function() {
          return promise(function(resolve, reject, notify) {
            compiler.perform(opts, arg, accum, expansion).then(
              function(result) {

                var part = parts.pop();
                var copy = arg.actions;

                if (result instanceof Array) {
                  arg.actions = [];
                  copy.forEach(function(action) {
                    result.forEach(function(result) {
                      var newAction = {};
                      Object.keys(action).forEach(function(key) {
                        newAction[key] = action[key];
                      });
                      arg.actions.push(newAction);
                      newAction.params = part + result + action.params + first;
                    });
                  })
                  return resolve();
                }

                arg.actions.forEach(function(action) {
                  if (first == '' && part == '' 
                    && typeof action.params == 'undefined') action.params = result
                  else action.params = part + result + action.params + first;
                });

                first = '';
                resolve();
              },
              reject,
              notify
            )
          });
        }
      })).then(
        function() {
          resolve(arg);
        },
        function(e) {
          reject(e);
        },
        notify
      );
    } else {
      arg.asArray = false;
      resolve(arg);
    }
  });
}
