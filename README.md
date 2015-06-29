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

Hmmmm...

#### It pollutes the global namespace

```javascript
In = require('in.');
$$in() === In;
```
See [extending](#extending)

#### It runs the function passed

```javascript
$$in( function(){} )
```

#### It provides a [promise](#promising)

```javascript
$$in( function(resolve){resolve('result')} )
.then(function(result){})
```

#### It accepts [options](#options)

```javascript
$$in(  {opt:'ion'},  function(){} ).then...
```

#### It [injects](injector) arguments from their comments

__Using the `in.` operator.__

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

#### The moustache interpreter is coffee-script

It [expands](#expanders) on `for` loops.

```javascript
$$in(function(
    array // in. {{i for i in [0..9]}}
){
    array === [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
}).then...
```


#### It has access to previous argument values.

```javascript
$$in(function(
  array, // in. {{ [1,2,3] }}
  hello // in. hello {{i++ for i in array}}
){});
```

#### It provides the [error](#error-handling)

```javascript
$$in(function(
    ee,
    nothing,  // in.as something as {{1}}
    somthing, // in. {{throw new Error('No such thing.')}}
    one       // in. {{ 1 }}
){
    ee.toString() === 'Error: No such thing.';
    nothing === 'something as 1'; // populated before the error
    somthing === undefined;
    one === undefined; // not populated, after error

}).then...
```
[ee](http://objective.black/if/everything/happens/that/cant/be/done) is a special argument. There are [others](#special-arguments).


## Infuser Composition

[&#9650;](#in)

#### It has [Actions](#creating-actions), [Adapters](#creating-adapters), [Actors](#creating-actors) and para{{'m'}}eters

```javascript
$$in(function(

    arg1 // in.as.json $ cat /file.json


    /*     <action>.<adapter1>.<adapter2...> <actor> para{{'m'}}eters

            in.as  .json                        $    cat /file.json

                                        $ is alias for shell actor */
){}).then...
```

#### (TODO) It has [Expanders](#creating-expanders)

```javascript
$$in(function(

    bunchOFjsons // in.as.json $ cat {{expand.dir('/my/*.json')}}

){}).then...
```

#### (TODO) Some [Actors](#creating-actors) support pipes

```javascript
$$in(function(pipe) { // in.as.pipe.tcpdump2json $ tcpdump -i en0
  pipe.on('data', function(frame) {
    console.log(frame.source.ip);
    // the 'in.adapter.tcpdump2json' module might not exist?
  })
})
```

#### It can pend the function

```javascript
require('in.actor.web'); // actor might not exist yet?

loadJson = $$in.pend(function(
  arg1, // in.as.json web.get www.my-json.com/arg1.json
  arg2, // in.as.json web.get www.my-json.com/arg2.json
  resolve
){ resolve({one: arg1, two: arg2})});

loadJson().then...
```
`resolve` is a special argument. There are [others](#special-arguments).

#### It automatically pends the function if naked args are present.

`url` is a naked argument - no `in.` specified.

```javascript
require('in.actor.web'); // actor might not exist yet?

loadJsonFrom = $$in(function(
  url,
  a,     // in.as.json web.get {{url}}/a.json
  b,    // in.as.json web.get {{url}}/b.json
  end  // in. {{ resolve({a: a, b: b}) }}
) {});

loadJsonFrom('www.my-json.com')

.then(function(json) {
  json.a;
  json.b;
})

.catch(function(e) {})
```
Note: [special arguments](#special-arguments) are not naked even if no `in.` specified.

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
var opts = {
  scopeVar: 'accessable in expander'
}
$$in(opts, function(arg, // in. {{scopeVar}}
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
$$in( function (array, // in. {{ $$in (resolve) -> resolve [1, 2, 3] }}
```
```javascript
$$in( function (array, // in.as.js {{ $$in(function(resolve) { resolve([1, 2, 3]) }) }}
```


#### It can inject the function without running it

```javascript
$$in( function (fn, // in.as.js.function {{ function() {} }}
```

#### It is integratable

```javascript
var opts = {
  $$onInject: function(arg, done){
    if (arg.name == 'one') arg.value = 1;
    done(err = null);
  }
}

$$in(opts, function(one, two, three) {
  console.log(one);
});
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

[&#9650;](#in)

What if things go wrong in the `//in.`...

# Options

[&#9650;](#in)

# Promising

[&#9650;](#in)

### Resolving in the argument chain.

```javascript
$$in(function(
  ar,  // in. {{[1..9]}}
  ps, // in. {{notify("got #{ar.length} elements")}}
  ok // in. {{resolve(ar)}}
){ /* this funcition body will still run,
    * but the resolved result will have passed into .then() already
    */ })
.then(
  function(array) {},
  function(error) {},
  function(notice) {}
);

```


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

* scope

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

