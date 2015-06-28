/* This adapter does nothing. 
   It  serves only to inform the compiler not to run the
   the function but instead to allow it to be injected.

   eg. 

   $$in(function(
     fnArg // in.as.function {{ -> return 1 }}

 */

module.exports = FunctionAdapter;

function FunctionAdapter(opts, accumulate, arg, results) {

  return $$in.promise(function(resolve) {

    resolve(results);

  });

}
