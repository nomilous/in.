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

function DefaultAdapter(opts, accumulate, arg, results) {

  // adapter should return a promise if it wants to async

  // console.log({FILTER: arguments});

  return $$in.promise(function(resolve, reject, notify) {

    //
    //  
    //   note
    //   ----
    //
    //   Inbound is arg.asArray which was set to true if the expansion
    //   contained a for loop.                    |
    //                                            |
    //   eg.                                     \|/ 
    //                                            v
    //    contacts, // in.as {{[c.name, c.email] for c in expand.mydb('customers')}}
    //
    //   After all the adapters have run the arg.asArray flag is checked
    //   and if set false, only the first element in the results array
    //   will be passed in as the argument value, otherwise the whole 
    //   array is passed.
    //
    //   If the adapter wants to construct an object from the results array
    //   it should place the object into results[0] and set the arg.asArry
    //   to false.
    //  
    //   Here are some things a adapter may like to use / do.
    //
    //   Accumulated previous arguments.
    //
    // console.log(accumulate)
    //
    //   Or from data placed onto this argument's context either by the 
    //   actor or by one of the {{expand.ers(..)}}
    //
    // console.log(arg.context)
    //
    //   Or the adapter could use a function passed in through opts
    //   to process the results into the final arg.value 
    //
    //   Anyway.
    //
    
    //   This adapter does nothing...

    resolve(results);

  });

}
