# in.

an argument infuser <br>

`npm install in. --save` <br>


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
$$in(  {},  function(){} ).then...
```

#### It [injects](Injection) node modules (by name) into the function

```javascript
$$in(function(express){    
    
    app = express();

}).then...
```

#### It [infuses](Infusion) arguments from their comment

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

#### It has [Actions](#actions) and [Actors](#actors) and parameters

```javascript
$$in(function(

    arg // in.<action> <actor> <parameters>

){}).then...
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


## Actors


## Expanding


## Error Handling

What if things go wrong in the `//in.`...







### Options


### Injection


### Promising









### Infusion


### Why


