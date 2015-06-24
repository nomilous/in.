
```javascript

$$in({
  processNew: function(customer) { /* return promise */ }
}, 
function(

  newCustomers, // in. database.tableName where new = true
  results,     // in. {{async(processNew(customer)) for customer in newCustomers}} 
  error

){  /* got results */  })


```