#!/usr/bin/env node

require('../');

var japan = { // moustache scope / opts
  getBig: function(delay) {
    return $$in.promise(function(resolve) {

      setTimeout(function it( takes, time, to, get, big, In, Japan ) {

        resolve([
          'Big in Japan-tonight',
          'Big in Japan-be-tight',
          'Big in Japan ooh the eastern sea\'s so .blue'
        ])

      }, delay);

    });
  },
  home: process.env.HOME,
  player: process.env.MP3_PLAYER
}


$$in(japan, function(

  Japan, // in. {{getBig(100)}}
  ooh   // in. {{console.log "when you're #{Big}" for Big in Japan}}

){})

.then(
  $$in(japan, function(play){ // in. $ {{player}} {{home}}/music/Alphaville/Big\ In\ Japan.mp3
    
    // TODO: happens first... fix
    console.log(play)

  })
);
