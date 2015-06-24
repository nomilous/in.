#!/usr/bin/env node

require('../');

$$in.expanders.japan = function(delay, possibly) { // in.as.possibly in a later version
                                                  // seems a bit excessive tho...
  $$in.promise(function(resolve) {

    setTimeout(function Because_You_ll_Know( when ) { // in.as.you 're big in Japan!
                                                     // 
                                                    // nope... this injection does
                                                   //          not happn (yet?)
                                                  //                     (impossible?)
                                                 //                      i('suspect so')
        resolve([
          'Big in Japan-be-tight',
          'Big in Japan ooh the eastern sea\'s so blue',
          'Big in Japan-alright'
        ])
    }, delay);
  })
}

$$in(function( 
    Big, // in. {{expand.japan(100)}}
     In // in. {{console.log line for line in $p.big}}
){/* Japan */});
