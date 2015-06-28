// TODO: opts.pre||post : does that actor run before or after the evals

module.exports = Expander;

var promise = require('when').promise;
var sequence = require('when/sequence');
var compiler = require('./compiler');
var path = require('path');

function Expander() {}

Expander.perform = function(opts, inArgs, arg) {
  return promise(function(resolve, reject, notify) {
    
    var template = arg.actions[0].expansion;
    if (!template) return resolve(arg);

    var expansions = [];
    var embedded;
    var origPaths;
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

    parts.unshift(part);  // ?

    if (expansions.length > 0) {

      // update module require paths to the callers perspective

      origPaths = module.paths;
      module.paths = Expander.callerPaths(opts.caller.FileName, []);

      arg.actions[0].expansion = ''; // rebuilding it
      var first = parts.pop();
      return sequence(expansions.map(function(expansion){
        return function() {
          return promise(function(resolve, reject, notify) {
            compiler.perform(opts, arg, inArgs, expansion).then(
              function(result) {


                var part = parts.pop();
                var copy = arg.actions;

                if (part.match(/^(in\.|out\.)/)) part = ''; // ?

                if (result instanceof Array) {

                  arg.actions = [];
                  arg.asArray = true;

                  copy.forEach(function(action) {
                    result.forEach(function(result) {
                      var newAction = {};
                      Object.keys(action).forEach(function(key) {
                        newAction[key] = action[key];
                      });

                      if (first == '' && part == '' && 
                         (typeof action.expansion == 'undefined' 
                           || action.expansion == '')) {
                          newAction.expansion = result;
                      }
                      else newAction.expansion = part + result + action.expansion + first;
                      arg.actions.push(newAction);
                    });
                  })
                  return resolve();
                }

                arg.actions.forEach(function(action) {
                  if (first == '' && part == '' && 
                    (typeof action.expansion == 'undefined'
                      || action.expansion == '')) {
                      action.expansion = result
                  } else {
                    action.expansion = part + result + action.expansion + first;
                  }
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
          module.paths = origPaths;
          resolve(arg);
        },
        function(e) {
          module.paths = origPaths;
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

Expander.callerPaths = function(filename, paths) {
  var dirname = path.dirname(filename);
  if (dirname == filename) return paths;
  paths.push(path.normalize(dirname + path.sep + 'node_modules'));
  return Expander.callerPaths(dirname, paths);
}
