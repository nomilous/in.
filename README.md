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
