# in[.](https://www.youtube.com/watch?v=zUDDiWtFtEM)

An argument infuser.

* [Error Handling](#error-handling)
* [Extending](#extending)
* [Injector](#injector)
* [Next](#next)
* [Why?](#why)

## The Basics

`npm install in. --save`

#### It uses eval

Sorry about that? (see [the interpreter](#the-interpreter))

#### It [pollutes](#extending) the global namespace

Sorry about that? (see [extending](#extending))

```javascript
In = require('in.');
$$in() === In;
```

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

#### It [injects](injector) node modules (by name) into the function

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

#### (TODO) It will run the function

```javascript
$$in( function (arg, // in. {{ function() { ...
```

#### (TODO) It will handle the returned promise.

```javascript
$$in( function (arg, // in. {{ $$in( function(arg, // in. {{ ... 
```
todo - easilly pend, maybe $$in pends and $in runs


#### It is deeply integratable

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


# Error Handling

What if things go wrong in the `//in.`...


# Extending

## Creating Actions

See also [Using Actions](#using-actions)

## Creating Filters

See also [Using Filters](#using-filters)

## Creating Actors

See also [Using Actors](#using-actors)

## Creating Expanders

See also [Using Expanders](#using-expanders)

"Unfortunately, no-one can be <b>told</b> what an expander is, you have to [see it](https://github.com/nomilous/in./blob/master/in.jokes/big-in.japan('All%20right!').js) for yourself."

"This is your last chance."

"After this there is no turning back."

"<b>You take the [red pill](http://objective.red)</b> - The story ends. You wake up in your bed and believe whatever you want to believe."

"<b>You take the [blue pill](http://objective.blue)</b>" - You stay in wonderland. And I show you how deep the rabbit hole goes."

"Hang-on..."

"It might be the other way round?"

Pause.

"Trinity!?"

"Can you remember which pill's which?"

Silence.

"Um. I could take both."

"Assuming the blue pill's like taking nothing anyway."

More silence.

"Good point."

"Trinity!"

"What?"

"We're gonna need a bigger glass of water."

# Injector

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

Search npm for

* [Actors](https://www.npmjs.com/search?q=in.actor)
* [Filters](https://www.npmjs.com/search?q=in.filter)
* [Expanders](https://www.npmjs.com/search?q=in.expander)
* [Jokes](https://www.npmjs.com/search?q=in.jokes)
* [Lovers](https://www.npmjs.com/search?q=in.love)

Also, 'look [out.](https://github.com/nomilous/out.)'

# Why

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

}).then...
```

The [$](https://github.com/nomilous/in.actor.shell) aliases the shell [Actor](#creating-actors) to spawn the uptime command and provide the results into the uptime [Filter](#creating-filters) for formatting into probably json to be injected into the function argument completely devoid of all further effort ever. ([possible exageration?](#in))

```javascript
.then($$in(function(result, Bob) { // in.as.unkle {{ is ( 'your\'s' ) }}`'

    // TODO: un-'currently unkle will be injected into result (i think)'

})).then...
```

`result` is a special argument. There are [others](#special-arguments).
