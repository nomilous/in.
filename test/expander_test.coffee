objective 'Expand infuser arguments', ->

    trace.filter = true

    beforeEach (Expander) ->

        @opts = value: 1, caller: {}
        @inArgs = {}
        @arg = 
            name: 'arg1'
            value: undefined
            in: 'full infuser'
            actions: [
                action: 'as'
                actor: 'shell'
                expansion: 'echo {{opts.value}}'
            ]

    it 'calls the compiler for each {{moustach}}',

        (done, Expander, Compiler) ->

            Compiler.does perform: (opts, arg, args, expansion) ->
                expansion.eval.should.equal 'd'
                then: (resolver) -> resolver('d')

            Compiler.does perform: (opts, arg, args, expansion) ->
                expansion.eval.should.equal 'l'
                then: (resolver) -> resolver('L')

            Compiler.does perform: (opts, arg, args, expansion) ->
                expansion.eval.should.equal 'r'
                then: (resolver) -> resolver('R')

            Compiler.does perform: (opts, arg, args, expansion) ->
                expansion.eval.should.equal 'o'
                then: (resolver) -> resolver('o')

            Compiler.does perform: (opts, arg, args, expansion) ->
                expansion.eval.should.equal 'w'
                then: (resolver) -> resolver('w')


            @arg.actions[0].expansion = 'hello {{w}} {{o}}{{r}}{{l}}{{d}}'
            Expander.perform(@opts, @inArgs, @arg).then =>

                @arg.actions[0].expansion.should.equal 'hello w oRLd'
                @arg.actions.length.should.equal 1
                done()

    it 'supports multiline expansions',

        (done, Expander, Compiler) ->

            Compiler.does perform: (opts, arg, args, expansion) ->

                expansion.eval.trim().should.equal 'bit of code'
                done()
                then: -> 

            @arg.actions[0].expansion = 'testing, testing  \n {{\n\nbit of code\n\n}} \n'

            Expander.perform(@opts, @inArgs, @arg)



    it 'expands if the compiler returns an array and sets the asArray flag',

        (done, Expander, Compiler) ->

            Compiler.does perform: (opts, arg, args, expansion) ->
                expansion.eval.should.equal 'another bit of code'
                then: (resolve) -> resolve ['A', 'B', 'C']

            Compiler.does perform: (opts, arg, args, expansion) ->
                expansion.eval.should.equal 'bit of code'
                then: (resolve) -> resolve ['one', 'two', 'three']

            @arg.actions[0].expansion = 'testing, testing {{bit of code}} {{another bit of code}}'

            Expander.perform(@opts, @inArgs, @arg).then =>

                @arg.asArray.should.equal true

                @arg.actions.length.should.equal 3 * 3
                @arg.actions[0].expansion.should.equal 'testing, testing one A'
                @arg.actions[1].expansion.should.equal 'testing, testing two A'
                @arg.actions[2].expansion.should.equal 'testing, testing three A'
                @arg.actions[3].expansion.should.equal 'testing, testing one B'
                @arg.actions[4].expansion.should.equal 'testing, testing two B'
                @arg.actions[5].expansion.should.equal 'testing, testing three B'
                @arg.actions[6].expansion.should.equal 'testing, testing one C'
                @arg.actions[7].expansion.should.equal 'testing, testing two C'
                @arg.actions[8].expansion.should.equal 'testing, testing three C'
                done()

