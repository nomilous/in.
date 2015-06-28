// This adapter is called when no adapter is specified.
// 
//   ie.
//     
//   arg, // in.as.adapter1.adapter2 $ cat {{expand.dir('/etc/bind/zones/db.*')}}
// 
//     Would send the content of each zone file through adapter1 and then adapter2
//     as defined at:
// 
//     global.$$in.adapters.adapter1() and global.$$in.adapters.adapter2()
//
//
//   arg, // in.as $ cat ...
//
//     Has no adapters specified. It is sent through this adapter by default.
//
//     global.$$in.adapters.none()
//

module.exports = DefaultAdapter;

function DefaultAdapter(opts, inArgs, arg, results) {

  // adapter should return a promise if it wants to async

  return $$in.promise(function(resolve, reject, notify) {
    
    //   This adapter does nothing...

    resolve(results);

  });

}
