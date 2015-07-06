/* This adapter does nothing. 
   It  serves only to inform the actor to provide an event emitter for stream data

   eg. 

   $$in(function(
     arg // in.as.stream $ tail -F /var/log/syslog
   ) {
     arg.on('data', ...
     arg.on('error', ...
     arg.on('end', ...

 */

module.exports = StreamAdapter;

function StreamAdapter(opts, inArgs, arg, results) {}
