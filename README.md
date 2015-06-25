# in[.](https://www.youtube.com/watch?v=zUDDiWtFtEM)

An argument infuser.

* __The Basics__
* [Infuser Composition](#infuser-composition)
* [Going Deeper](#going-deeper)
* [Error Handling](#error-handling)
* [Extending](#extending)
* [Injector](#injector)
* [Next](#next)
* [Why](#why)
* What About If... [the downside](#the-downside)
* [And Finally](#and-finally)

## The Basics

`npm install in. --save`

#### It uses eval

See [unfortunately](#unfortunately)

#### It pollutes the global namespace

```javascript
In = require('in.');
$$in() === In;
```
See [extending](#extending)

#### It returns a [promise](#promising)

```javascript
$$in().then( function(result){} );
```

#### It runs the function passed

```javascript
$$in( function(){} ).then...
```

#### It accepts [options](#options)

```javascript
$$in(  {opt:'ion'},  function(){} ).then...
```

#### (TODO) It [injects](injector) node modules (by name) into the function

maybe not... don't gain much

```javascript
$$in(function(express){    
    
    app = express();

}).then...
```

#### It [injects](injector) arguments from their comments

Using the `in.` operator.

```javascript
$$in(function(
    txt // in. here is some text
){    
    
    txt === 'here is some text';

}).then...
```

#### It [interprets](#interpreter) moustaches

```javascript
$$in(function(
    txt, // in. here is some {{'t'}}ext
    num // in. {{1 + 1}}
){    
    
    txt === 'here is some text';
    num === '3'; // todo - make actually number

}).then...
```

#### (TODO) It provides the [error](#error-handling)

```javascript
$$in(function(
    somthing, // in. {{this}}
    somthingElse, // in. {{throw new Error('No such thing.')}}
    e
){
    e.toString() === 'Error: No such thing.'
    somthingElse === null
    somthing === (dunno, haven't really thought about this and that)

}).then...
```
`e` is a special argument. There are [others](#special-arguments).

#### The moustache interpreter is coffee-script

It [expands](#expanders) on `for` loops.

```javascript
$$in(function(

    array // in. {{i for i in [0..9]}}

){
    array === ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
              // todo: these are strings... (not ideal)
}).then...
```
todo 'enable js in the expanders'


## Infuser Composition

[&#9650;](#in)

#### It has [Actions](#creating-actions), [Filters](#creating-filters), [Actors](#creating-actors) and para{{'m'}}eters

```javascript
$$in(function(

    arg // in.<action>.<filter1>.<filter2...> <actor> para{{'m'}}eters

){}).then...
```

#### (TODO) It has asynchronous [Expanders](#creating-expanders)

todo 'direct access to previous args as if in scope'

```javascript
$$in(function(

    bunchOFjsons, // in.as.json $ cat {{expand.dir('/my/*.json')}}
    ointment     // in.as.myFiltrationSystem {{expand.myExpander(bunchOFjson)}}

){}).then...

// dir is the only baked-in expander,
// and json is the only baked in filter
// $$in.filters.myFiltrationSystem = function( ...see lib/none/filter or npm in.filter.json
// $$in.expanders.myExpander = function( ...see npm in.expander.dir

```

#### (TODO) Some [Actors](#creating-actors) support pipes

```javascript
$$in(function(pipe) { // in.pipe.tcpdump2json $ tcpdump -i en0
  pipe.on('data', function(jsonFrame) {
    // ...
  })
})
```


#### (TODO) It can pend the function

```javascript
loadJsonFrom = $$in({pend: true}, function(
  arg1,
  arg2, // in.as.json web.get {{arg1}}
  resolve
){resolve(arg2)});

loadJsonFrom('www.arg1.com/spokes').then...

// actor: 'web.*' has not been implemented
// $$in.actors.web(...) {...} 
// see lib/none/actor.js or npm in.actor.shell
```

`resolve` is a special argument. There are [others](#special-arguments).

#### (TODO) It has a faux scope

This does not work.

```javascript
var scopeVar = 'unaccessable in expander';
$$in(function(arg, // in. {{scopeVar}}
                               //
                              // var out of scope
```

This does.

```javascript
function scopeFunction() { return $$in.promise(     //...
$$in({fn: scopeFunction}, function(arg, // in. {{asyncdList = $fn()}} //...
                                                  //
                                                 // desision pending:
                                                //
                                               // $.fn? or $fn, 
                                              // or reserve $ for asyncers (**)
                                             // and use @fn ( or @.fn
                                            // ... be easier ) 
                                           //
                                          // ** it has occurred to me that {{fn()}}
                                         //     can easily be asyncronously enabled
                                        //      
                                       //       if it returned a promise(
                                      //         
                                     //         then...
```

## Going Deeper

[&#9650;](#in)

#### (TODO) It will run the function

```javascript
$$in( function (arg, // in. {{ function() { ...
```

But actually, the {{moustash}} interpreter is [coffee-script](http://coffeescript.org/) (For it's for looping powers). So it would really look like this:

```javascript
$$in( function (arg, /* in. {{ (args...) -> console.log args }} */
```

Perhaps a flag will be added to set using js instead. But maybe not. Because putting a bunch of code into the infuser is not the point.



#### (TODO) It will handle the returned promise.

```javascript
$$in( function (arg, // in. {{ $$in( function(arg, // in. {{ ... 
```
todo - easilly pend, maybe $$in pends and $in runs

#### (TODO) It can inject the unrun function

```javascript
$$in( function (fn, // in.as.function {{  function(...  }}
```

#### (TODO) It is deeply integratable

```javascript
$$in(  {onInject: function(){}} , function() {});
```

See [hameln](https://github.com/nomilous/hameln)


#### It supports coffeescript

Coffee does not allow comments among the arguments. So the infusers can be specified inside the function.

```coffee
$$in (arg1, arg2) ->
    
    ### in(arg1). ... ###
    ### in(arg2). ... ###

.then (result) ->

```

#### Unfortunately

No one can be told what an `infuser` is. You have to [see it](https://github.com/nomilous/in./blob/master/in.jokes/big-in.japan('All%20right!').js) for yourself...

# Error Handling

[&#9650;](#in)

What if things go wrong in the `//in.`...


# Extending

[&#9650;](#in)

## Creating Actions

See also [Using Actions](#using-actions)

## Creating Filters

See also [Using Filters](#using-filters)

## Creating Actors

See also [Using Actors](#using-actors)

* Actor.$$can...

## Creating Expanders

See also [Using Expanders](#using-expanders)

# Injector

[&#9650;](#in)

## Special Arguments

## The Interpreter

### Using Actions

### Using Filters

### Using Actors

* '.' for no actor

### Using for loop

### Using options

### Using previous argument

### Using Expanders



#### Special Expanders

* `async()` for promises.
* `callback()` for node thingies. ([unimplemented](https://www.youtube.com/watch?v=aocK0TMiZKk?in.as.hello=1))

### Using expander result

### Multiple expanders

### Options

### Promising

# Next

[&#9650;](#in)

Search npm for<br>
<br>
[&#9654;](https://www.npmjs.com/search?q=in.actor) Actors<br>
[&#9654;](https://www.npmjs.com/search?q=in.filter) Filters<br>
[&#9654;](https://www.npmjs.com/search?q=in.expander) Expanders<br>
[&#9654;](https://www.npmjs.com/search?q=in.jokes) Jokes<br>
[&#9654;](https://www.npmjs.com/search?q=in.love) Lovers<br>
[&#9654;](https://github.com/nomilous/out.) Look `out.` ahead...<br>

# Why

[&#9650;](#in)

Because you can do some [crazy stuff](https://github.com/nomilous/in./blob/master/4LUNATICS.md)...

### But Besides That

Assuming that someone has taken the trouble to implement the following node modules

* `npm install in.filter.uptime`
* `npm install in.filter.unkle`

Then...

```javascript

require('in.');
require('in.filter.uptime');
require('in.filter.unkle');

$$in(function(uptime) { // in.as.uptime $ uptime
    
    /* and so forth... */

}).then.....
```

The [$](https://github.com/nomilous/in.actor.shell) aliases the shell [Actor](#creating-actors) to spawn the uptime command and provide the results into the uptime [Filter](#creating-filters) for formatting into probably json to be injected into the function argument completely devoid of all further effort ever. ([possible exageration?](#in))

```javascript
.....then($$in(function(result, Bob) { // in.as.unkle {{ is ( 'your\'s' ) }}`'

    // TODO: un-'currently unkle will be injected into result (i think)'

})).then...
```

`result` is a special argument. There are [others](#special-arguments).


# The Downside

[&#9650;](#in)

This world has some `Type: UnfortnatelyExisting` individials.

They might think <b>this</b> is funny, or fun, or who knows what.

```javascript

// in secret,
// deep inside their module you've installed

$$in(function(hehehe) { /* in. $ rm -rf {{process.env.HOME}} */ });

// or worse...

```

And it's not really about what they're doing, because they could just as easilly to this:

```javascript 
require('child_process').exec( ...
```

It's about how `in.` makes it so easy to camouflage.

So, [um?](https://github.com/nomilous/in./issues/1)

# And Finally

[&#9650;](#in)

```javascript
recurse = $$in(

{
  fusion: function(protons) { /* return promise */ }
  alchemy: function(atom, change) {}
},

function(
  Pb,   // in.as.atom {{fusion(82)}}
  Au,  // in.as.atom {{async(alchemy(Pb, -3))}}
  out // out.as.atom to ...
){

  recurse(out(Au));

});

```

&#9654;

