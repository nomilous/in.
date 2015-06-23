objective 'Expand infuser arguments', ->

    trace.filter = true

    beforeEach ->

        @opts = value: 1
        @accum = {}
        @arg = 
            name: 'arg1'
            value: undefined
            in: 'full infuser'
            actions: [
                action: 'as'
                actor: 'shell'
                params: 'echo {{opts.value}}'
            ]

    it 'creates the arg context',

        (done, Expander, Compiler) ->

            Compiler.stub perform: -> then: (resolver) -> resolver()
            Expander.perform(@opts, @accum, @arg).then =>
                @arg.context.should.eql {}
                done()


    it 'calls the compiler for each {{tib}}',

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


            @arg.actions[0].params = 'hello {{w}} {{o}}{{r}}{{l}}{{d}}'
            Expander.perform(@opts, @accum, @arg).then =>

                @arg.actions[0].params.should.equal 'hello w oRLd'
                @arg.actions.length.should.equal 1
                done()


    it 'expands if the compiler returns an array',

        (done, Expander, Compiler) ->

            Compiler.does perform: (opts, arg, args, expansion) ->
                expansion.eval.should.equal 'another bit of code'
                then: (resolve) -> resolve ['A', 'B', 'C']

            Compiler.does perform: (opts, arg, args, expansion) ->
                expansion.eval.should.equal 'bit of code'
                then: (resolve) -> resolve ['one', 'two', 'three']

            @arg.actions[0].params = 'testing, testing {{bit of code}} {{another bit of code}}'

            Expander.perform(@opts, @accum, @arg).then =>

                @arg.actions.length.should.equal 3 * 3
                @arg.actions[0].params.should.equal 'testing, testing one A'
                @arg.actions[1].params.should.equal 'testing, testing two A'
                @arg.actions[2].params.should.equal 'testing, testing three A'
                @arg.actions[3].params.should.equal 'testing, testing one B'
                @arg.actions[4].params.should.equal 'testing, testing two B'
                @arg.actions[5].params.should.equal 'testing, testing three B'
                @arg.actions[6].params.should.equal 'testing, testing one C'
                @arg.actions[7].params.should.equal 'testing, testing two C'
                @arg.actions[8].params.should.equal 'testing, testing three C'
                done()

