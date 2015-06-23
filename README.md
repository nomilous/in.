`npm install in. --save`

# in.

an argument infuser

## Basics

#### It [pollutes](#extending) the global namespace

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

#### It [injects](Injection) arguments from their comment using the `in.` operator

```javascript
$$in(function(
    txt // in. here is some text
){    
    
    txt === 'here is some text';

}).then...
```

#### It interprets the infuser's moustaches

```javascript
$$in(function(
    txt, // in. here is some {{'t'}}ext
    num // in. {{1 + 1}}
){    
    
    txt === 'here is some text';
    num === '3'; // todo - make actually number

}).then...
```

#### (TODO) So, for incompatible module names

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

## Actions

## Filters

## Actors

* '.' for no actor

## Expanders

### Special Expanders

* async
* async.cb

### Using for loop

### Using options

### Using previous argument

### Using expander

### Using expander result

### Multiple expanders


## Error Handling

What if things go wrong in the `//in.`...







### Options


### Injection


### Promising









### Infusion


### Why


