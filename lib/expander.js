module.exports = Expander;

var promise = require('when').promise;
var sequence = require('when/sequence');
var compiler = require('./compiler');

function Expander() {}

Expander.perform = function(opts, accum, arg, expansions) {
  return promise(function(resolve, reject, notify) {

    var embedded;
    var inTemplate = arg.actions[0].params;
    var part = '';
    var parts = [];
    if (!inTemplate) return resolve(arg);

    for (var i = inTemplate.length - 1; i >= 0; i--) {
      if (inTemplate[i]+inTemplate[i-1] == '}}') {
        i--;
        embedded = '';
        parts.unshift(part);
        part = '';
        continue;
      }
      if (inTemplate[i]+inTemplate[i-1] == '{{') {
        expansions.push({eval:embedded});
        embedded = undefined
        i--;
        continue;
      }
      if (typeof embedded !== 'undefined') {
        embedded = inTemplate[i] + embedded.toString();
      } 
      else {
        part = inTemplate[i] + part;
      }
    }
    parts.unshift(part);

    if (expansions && expansions.length > 0) {
      arg.actions[0].params = ''; // rebuilding it
      var first = parts.pop();
      return sequence(expansions.map(function(expansion){
        return function() {
          return promise(function(resolve, reject, notify) {
            compiler.perform(opts, arg, accum, expansions, expansion).then(
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
                  action.params = part + result + action.params + first;
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
      resolve(arg);
    }
  });
}
