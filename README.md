# in.

an argument infuser

### Basics

#### It [pollutes](#extending) the global namespace.

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
    num === 3;

}).then...
```

#### So, with fun module names

```javascript
$$in(function(

    io // in. {{require('socket.io-client')}}

){}).then...
```
But [why](#why)?


### Error Handling

What if things go wrong in the `//in.`...




### Options


### Injection


### Promising



### Extending


### Infusion


### Why


