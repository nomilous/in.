
```javascript

$$in({
  processNew: function(customer) { /* return promise */ }
}, 
function(
                             // 
                            // require('in.actor.postgres') does not exist
                           //
  newCustomers, // in. postgres.tableName where new = true
  results,     // in. {{async(processNew(customer)) for customer in newCustomers}} 
  error

){  /* got results */  })


```
