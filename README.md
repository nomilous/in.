# in.

An argument infuser,<br>
perhaps proceed directly to [why](#why)?

## Basics

`npm install in. --save`

#### It [pollutes](#extending) the global namespace

Sorry about that. (see [extending](#extending))

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


#### (TODO) (Perhaps remove this doc fragment, a deviation) For incompatible module names

```javascript
$$in(function(

    io // in. {{require('socket.io-client')}}

){}).then...
```

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

#### It has asynchronous [Expanders](#creating-expanders)

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


# Injector

## Special Arguments

## The in.terpreter

### Using Actions

### Using Filters

### Using Actors

* '.' for no actor

### Using for loop

### Using options

### Using previous argument

### Using expander

#### Special Expanders

* async
* async.cb

### Using expander result

### Multiple expanders

### Options

### Promising



## Why

Because you can do some [crazy stuff](https://github.com/nomilous/in./blob/master/4LUNATICS.md)...<br>

But besides that. Assuming that someone has taken the trouble to implement the modules `in.filter.uptime` and `in.filter.unkle` (search npm 'in.')<br>

```javascript

require('in.');
require('in.filter.uptime');

$$in(function(uptime) { // in.as.uptime $ uptime
    
    /* and so forth...
```

`$` aliases the shell [Actor](#creating-actors) to spawn the uptime command and provide the results into the uptime filter for formatting into probably json.<br>
<br>
and then: `bob, // in.as.unkle {{is('your\'s')}}`

## Also,

`one, // in. ring to rule {{them}}`<br>
`one, // in. ring to bind {{them}}`<br>


