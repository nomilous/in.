objective 'Dynamic Function Injector', (recurse, link) ->

    ### search for files to watch / run tests on changes ###

    link.root './node_modules/in.shell/objective'

        # objective, bug: why must link before recurse?

    .then -> recurse ['lib', 'test'], createDir: true
    .then -> 
