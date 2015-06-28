/* This adapter does nothing. 
   It  serves only to inform the compiler to interpret js instead
   of the default coffee-script

   eg. 

   $$in(function(
     fnArg // in.as.js.function {{ function() {} }}

 */

module.exports = JsAdapter;

function JsAdapter(opts, inArgs, arg, results) {

  return $$in.promise(function(resolve) {

    resolve(results);

  });

}
