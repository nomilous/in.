#! /usr/bin/env coffee

The expander supports multiple asyncronous functions that `appear = synchronous()`.

To achieve that it needed to do some peculiar things.

__Very peculiar!__

Things that [some](https://www.google.co.za/search?q=uptight+people&espv=2&biw=1063&bih=1058&source=lnms&tbm=isch&sa=X&ei=q6CJVYTyIpPB7Ab95YLQBA&ved=0CAYQ_AUoAQ#tbm=isch&q=uptight) may disaprove of.

Like wearing [spandex in public](https://www.google.co.za/search?q=spandex+in+public+nuts&espv=2&biw=1063&bih=1058&tbm=isch&source=lnms&sa=X&ei=5Z-JVez6KeWY7gbl_oCYAg&ved=0CAYQ_AUoAQ#tbm=isch&q=spandex+in+public).

It broke the [expan](https://github.com/nomilous/in./blob/master/lib/expander.js)sion (to be [eval](https://github.com/nomilous/in./blob/master/lib/compiler.js#L57)'d) [into pieces and substituted](https://www.google.co.za/search?q=into+pieces+and+substituted+an+array&es_sm=91&source=lnms&tbm=isch&sa=X&ei=laOJVbKFOqKM7Abs4Y_ACw&ved=0CAkQ_AUoAw&biw=1063&bih=1058#tbm=isch&q=into+pieces+and+substituted) an array ($e[n]) for each function's results.

The results of the division are loaded into a variable called `spandex`...

Which happens to be in scope at injection eval.

    require('../')

    $$in (arg) ->

        ### in(arg).as {{1}}###

        console.log arg


#### Return and finish later - few bits still to wire together
