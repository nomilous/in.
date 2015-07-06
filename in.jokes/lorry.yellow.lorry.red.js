#!/usr/bin/env node

// osx
// TODO: redo with out. (say is slow to start)

require('../');

lorry = $$in(function(
  colours,
  say // in. $ say -r 250 lorry {{colours}}
){
  lorry(colours);
});

lorry(['yellow', 'red']);
