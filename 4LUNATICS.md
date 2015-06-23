# for likeminded lunatics

```javascript

unleash = $$in(opts = {

  pend: true,

  lions: $$in(opts, function(
    mustafa, // in. ...
    simba,  // in. ...
    scar   // in. ... 
  ) { /*..*/ }),

  bears: $$in(opts, function(
    paddinton, // in. ...
    rupert,   // in. ...
    pooh     // in. ...
  ) { /*..*/ }),

  frogs: $$in(opts, function(
    kermit // in. ...
  ) { /*..*/ })

}, function(
  where,
  when,
  who, // in. {{async(lions, bears, frogs)}}
  instructions // in. ...
) { /* ... */ })


unleash( 'Cape Town', Date.now() ).then...

```

<b>Note:</b> This is missing resolvers, see [Special Args](https://github.com/nomilous/in.#special-arguments) 