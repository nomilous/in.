# in[.](https://www.youtube.com/watch?v=zUDDiWtFtEM)

An argument infuser.

* __The Basics__
* [Infuser Composition](#infuser-composition)
* [Going Deeper](#going-deeper)
* [Error Handling](#error-handling)
* [Options](#options)
* [Promising](#promising)
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

#### It [interprets](#using-moustaches) moustaches

```javascript
$$in(function(
    txt, // in. here is some {{'t'}}ext
    num // in. {{1 + 1}}
){    
    
    txt === 'here is some text';
    num === 3;

}).then...
```

#### (TODO) It provides the [error](#error-handling)

```javascript
$$in(function(
    nothing, // in.as something as {{1}}
    somthingElse, // in. {{throw new Error('No such thing.')}}
    e
){
    e.toString() === 'Error: No such thing.'
    somthingElse === null
    somthing === 1 // happened before the error

}).then...
```
[e](http://wonderingminstrels.blogspot.com/2002/12/if-everything-happens-that-can-be-done.html) is a special argument. There are [others](#special-arguments).

#### The moustache interpreter is coffee-script

It [expands](#expanders) on `for` loops.

```javascript
$$in(function(
    array // in. {{i for i in [0..9]}}
){
    array === [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
}).then...
```


## Infuser Composition

[&#9650;](#in)

#### Unfortunately

No one can be told what an `infuser` is. You have to [see it](https://github.com/nomilous/in./blob/master/in.jokes/big-in.japan('All%20right!').js) for yourself...


#### It has [Actions](#creating-actions), [Adapters](#creating-adapters), [Actors](#creating-actors) and para{{'m'}}eters

```javascript
$$in(function(

    arg1 // in.as.json $ cat /file.json


    /*     <action>.<adapter1>.<adapter2...> <actor> para{{'m'}}eters

            in.as  .json                        $    cat /file.json

                                        $ is alias for shell actor */
){}).then...
```

#### (TODO) It has asynchronous [Expanders](#creating-expanders)

```javascript
$$in(function(

    bunchOFjsons, // in.as.json $ cat {{expand.dir('/my/*.json')}}
    ointment     // in.as.myFiltrationSystem {{expand.myExpander(bunchOFjson)}}

){}).then...

// dir is the only baked-in expander,
// and json is the only baked in adapter
// $$in.adapterss.myFiltrationSystem = function( ...see lib/none/adapter or npm in.adapter.json
// $$in.expanders.myExpander = function( ...see npm in.expander.dir

```

#### (TODO) Some [Actors](#creating-actors) support pipes

```javascript
$$in(function(pipe) { // in.as.pipe.tcpdump2json $ tcpdump -i en0
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

#### It has a faux scope

__This does not work.__

```javascript
var scopeVar = 'unaccessable in expander';
$$in(function(arg, // in. {{scopeVar}}
                               //
                              // var out of scope
```

__This does.__

```javascript
var scopeVar = 'unaccessable in expander';
$$in({scopeVar: scopeVar}, function(arg, // in. {{scopeVar}}
```

#### It has access to previous argument values.

```javascript
$$in(function(
  arg1,  // in. {{[1,2,3]}}
  arg2, // in. {{i for i in arg1}}
){});
```


## Going Deeper

[&#9650;](#in)

#### It will run the function

```javascript
$$in( function (argName, // in. {{ function() { console.log(arg.name); } }}
```

Recalling the {{moustash}} interpreter is [coffee-script](http://coffeescript.org/) - it would actually need to be like this:

```javascript
$$in( function (agrName, /* in. {{ -> console.log arg.name }} */
```

OR

```javascript
$$in( function (agrName, /* in.as.js {{ function() { console.log(arg.name); } }} */
```


#### It will use the returned promise to populate the argument asynchronously.

```javascript
$$in( function (array, // in. {{ -> $$in.promise (resolve, reject) -> resolve [1, 2, 3] }}
```


#### It can inject the function without running it

```javascript
$$in( function (fn, // in.as.js.function {{ function() {} }}
```

#### It is integratable

```javascript
$$in({
  onInject: function(arg, done){
    setTimeout(function is(Async) {
      var err = null;
      if (arg.name == 'one') arg.value = 1;
      done(err);
    }, 42);
  }
}, function(one, two, three) {
  console.log(one);
});
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

[&#9650;](#in)

What if things go wrong in the `//in.`...

# Options

[&#9650;](#in)

# Promising

[&#9650;](#in)

# Extending

[&#9650;](#in)

## Creating Actions

See also [Using Actions](#using-actions)

## Creating Adapters

See also [Using Adapters](#using-adapters)

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

### Using Adapters

### Using Actors

* '.' for no actor

### Using Moustaches

### Using Options

### Using Previous Argument

### Using for Loop

### Using Expanders

#### Special Expanders

* `async()` for promises.
* `callback()` for node callbacks.

### Using Expander Result

### Multiple Expanders

# Next

[&#9650;](#in)

__unfortunately npm's search ignores the dots - this section is therefore not valid__

Search npm for<br>
<br>
[&#9654;](https://www.npmjs.com/search?q=in.actor) Actors<br>
[&#9654;](https://www.npmjs.com/search?q=in.adapter) Adapters<br>
[&#9654;](https://www.npmjs.com/search?q=in.expander) Expanders<br>
[&#9654;](https://www.npmjs.com/search?q=in.jokes) Jokes<br>
[&#9654;](https://www.npmjs.com/search?q=in.love) Lovers<br>

# Why

[&#9650;](#in)

Because you can do some [crazy stuff](https://github.com/nomilous/in./blob/master/4LUNATICS.md)...

### But Besides That

Assuming that someone has taken the trouble to implement the following node modules

* `npm install in.adapter.uptime`
* `npm install in.adapter.unkle`

Then...

```javascript

require('in.');
require('in.adapter.uptime');
require('in.adapter.unkle');

$$in(function(uptime) { // in.as.uptime $ uptime
    
    /* and so forth... */

}).then.....
```

The [$](https://github.com/nomilous/in.actor.shell) aliases the shell [Actor](#creating-actors) to spawn the uptime command and provide the results into the uptime [Adapter](#creating-adapters) for formatting into probably json to be injected into the function argument completely devoid of all further effort ever. ([possible exageration?](#in))

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

It's about how `in.` makes it easier to camouflage.

So, [um?](https://github.com/nomilous/in./issues/1)

# And Finally

[&#9650;](#in)

```javascript
recurse = $$in(

{
  fusion: function(protonCount) { /* return promise */ }
  alchemy: function(atom, change) { /* return promise */ }
},

function(
  Pb,   // in.as.atom {{ fusion(82) }}
  Au,  // in.as.atom {{ alchemy(Pb, -3) }}
  out // out.as.atom to ...
){

  return recurse(out(Au));

});

```

&#9654;

