/* This adapter does nothing. 
   It  serves only to inform the actor to provide value from stderr instead of stdout

   eg. 

   $$in(function(
     arg // in.as.stderr $ command that writes to stderr

 */

module.exports = JsAdapter;

function JsAdapter(opts, inArgs, arg, results) {}
