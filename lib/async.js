// Special expander
//
// Runs the passed function inside the expander but returns the results
// as if syncronous.
//
// eg.
//
// $$in( opts = {
//   fn: function(param){ return promise; }
// }, function(
//   arg // in.as {{async('param', $o.fn)}}
//                                 // todo, remove need for $o
//                                //        gsub eval...
// ){})
//
//

module.exports = Async;

function Async(conf) {
  $$in.promise(function(resolve, reject, notify) {

    resolve();

  })
}