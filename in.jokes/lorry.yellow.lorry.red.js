#!/usr/bin/env node

// osx

require('../');

lorry = $$in(function(
  colours,
  say // in. $ say -r 250 lorry {{colours}}
){
  lorry(colours);
});

lorry(['yellow', 'red']);
