#!/usr/bin/env node

require('../');

$$in.expanders.japan = function(delay) {

  // reutrn $$in(function(resolve) {...(pending)

  return $$in.promise(function(resolve) {

    setTimeout(function Because_You_ll_Know(when, youre, big, In, Japan) {
        resolve([
          'Big in Japan-tonight',
          'Big in Japan-be-tight',
          'Big in Japan ooh the eastern sea\'s so blue'
        ])
    }, delay);

  })
}

$$in(function(

   Japan, // in. {{expand.japan(100)}}
   ooh   // in. {{console.log 'when you\'re', big for big in Japan}}

){}).then( Japan = $$in({

    home: process.env.HOME,
    player: process.env.MP3_PLAYER

  },
  function(big){ // in. $ {{player}} {{home}}/music/Alphaville/Big\ In\ Japan.mp3
  }
)
