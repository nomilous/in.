/* This adapter does nothing. 
   It  serves only to inform the actor to provide raw buffer instead of decoded

   eg. 

   $$in(function(
     buff // in.as.buffer read filename
   ) {


 */

module.exports = BufferAdapter;

function BufferAdapter(opts, inArgs, arg, results) {}
