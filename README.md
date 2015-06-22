# in.

an argument infuser

### Basics

It pollutes the global namespace.

```javascript
In = require('in.');
$$in() == In;
```

It returns a promise

```javascript
$$in().then( function(result){} );
```

It runs the function passed

```javascript
$$in( function(){} ).then...
```

It accepts [options](#options)

```javascript
$$in(  {},  function(){} ).then...
```







### Options