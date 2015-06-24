
```javascript
require('in.');
require('in.actor.postgres');

$$in({
  processNew: function(customer) { /* return promise */ }
}, 
function(
  newCustomers, // in. postgres.customers where new = true
  results,     // in. {{async(processNew(customer)) for customer in newCustomers}} 
  error
){  
  if (error) ...
})


```
