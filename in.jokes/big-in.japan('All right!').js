#!/usr/bin/env node

require('../');

$$in.expanders.japan = function(delay) {

  // reutrn $$in(function(resolve) {...(pending)

  return $$in.promise(function(resolve) {

    setTimeout(function Because_You_ll_Know(when, youre, big, In, Japan) {
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
    In // in. {{console.log line for line in Big}}
){/* Japan */});

