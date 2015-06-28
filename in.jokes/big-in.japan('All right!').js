#!/usr/bin/env node

require('../');

var japan = { // moustache scope / opts

  getBig: $$in(function Japan(delay, resolve, reject, notify) {

    setTimeout(function it( takes, time, to, get, big, In, Japan ) {
      resolve([
        'Big in Japan-tonight',
        'Big in Japan-be-tight',
        'Big in Japan ooh the eastern sea\'s so .blue'
      ])
    }, delay);

  }),

  home: process.env.HOME,
  player: process.env.MP3_PLAYER
}


$$in(japan, function(

  Japan, // in. {{ getBig(1000) }}
  ooh,  // in. {{ console.log "when you're #{Big}" for Big in Japan }}
  the  // in. {{ resolve "eastern sea's so .blue" }}

){}).then(

  $$in(japan, function(result, play){ // in. $ {{player}} {{home}}/music/Alphaville/Big\ In\ Japan.mp3
    
    console.log(play)

  }),

  function(err) {
    // TODO: - how to get err into $$in above as error
    //       - or is that a bad idea?
    //         - rather fall to catch...
    //
  }

);
