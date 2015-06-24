* * in.js - setup, default
* ** into parser.js - extract the necesseries from function.toString
* * into in.js - loop over args
* ** into format.js - arrange, and default the arg~[filters,actor,params,actions]
* *** into expander.js - for each arg, expand...
* **** into compiler.js - ...and compile {{bits}}
* ***** if the compiler returns an array the argument is expanded into multiple actions
* * into in.js - now with arg1~[action,action,action]
* ** into action.js - with expanded arg with possibly multiple actions
* *** loop actions into SPECIFIED actor and resolve array of results
