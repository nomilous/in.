objective 'Dynamic Function Injector', (recurse, link) ->

    ### search for files to watch / run tests on changes ###

    # objective, bug: why must link before recurse?
    # objective, bug: can only link one?

    link.root './node_modules/in.shell/objective'
    # .then -> link.root './node_modules/in.expander.dir/objective'
    .then -> recurse ['lib', 'test'], createDir: true
    .then -> 
