`npm install in. --save`

# in.

an argument infuser

## Basics

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

#### It [injects](Injection) node modules (by name) into the function

```javascript
$$in(function(express){    
    
    app = express();

}).then...
```

#### It [injects](Injection) arguments from their comments

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

#### It has [Actions](#actions), [Filters](#filters), [Actors](#actors) and para[{{'m'}}](#expanders)eters

```javascript
$$in(function(

    arg // in.<action>.<filter1>.<filter2...> <actor> para{{'m'}}eters

){}).then...
```

#### It has infusion [Expanders](#expanders)

```javascript
$$in(function(

    bunchOFjson, // in.as.json $ cat {{expand.dir('/my/*.json')}}
    ointment    // in.as.myFiltrationSystem {{expand.myExpander(bunchOFjson)}}

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

loadJsonFrom('www.arg1.com/blimps').then...

// actor: 'web.*' has not been implemented
// $$in.actors.web(...) {...} 
// see lib/none/actor.js
```

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

## Actions

## Filters

## Actors

* '.' for no actor

## Expanders

### Special Expanders

* async
* async.cb

# Special Arguments


# Interpreter

### Using for loop

### Using options

### Using previous argument

### Using expander

### Using expander result

### Multiple expanders

### Options

### Injection

### Promising

### Infusion


## Why

because it's "the in. thing"... ;)

