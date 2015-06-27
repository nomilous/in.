objective 'Compile embedded in. {{fusions}}', (should) ->

    beforeEach ->

        @opts = value: 'VALUE 1'
        @arg = context: {}
        @inArgs = {}
        @expansion = eval: 'opts.value'

    it 'returns the result of the expansion eval',

        (done, Compiler) ->

            Compiler.perform @opts, @arg, @inArgs, @expansion
            .then (res) ->

                res.should.equal 'VALUE 1'
                done()

    it 'does not allow more than one call to expand.thing',

        (done, Compiler) ->

            @expansion = eval: 'expand.thing() and expand.thisToo()'
            Compiler.perform(@opts, @arg, @inArgs, @expansion)
            .then( 
                (res) ->
                (err) ->
                    should.exist err
                    done()
            )

    context 'expanders', ->

        it 'calls the specified external expander',

            (done, In, Compiler) ->

                mock(global.$$in.expanders).does

                    thing: (conf, arg1, arg2) ->

                        arg1.should.equal 'arg value'
                        arg2.should.equal 'VALUE'
                        then: (resolver) -> resolver([1, 2, 3]);
                        
                @expansion = eval: 'expand.thing(\'arg value\', previousArg)'
                @inArgs = {previousArg: 'VALUE'};
                
                Compiler.perform(@opts, @arg, @inArgs, @expansion)
                .then( 
                    (res) ->
                        res.should.eql [1, 2, 3]
                        done()

                    failed = done
                )

        it 'provides the expander result for further expansion by coffee script snippet',

            (done, In, Compiler) ->

                mock(global.$$in.expanders).does
                    thirdPartyExpander: (conf, arg1) ->
                        then: (resolver) -> 
                            resolver [{a: 1}, {a: 2}, {a: 'THREE'}]

                @expansion = eval: 'thing.a for thing in expand.thirdPartyExpander(\'arg\')'
                
                Compiler.perform(@opts, @arg, @inArgs, @expansion)
                .then (res) ->
                    res.should.eql [1, 2, 'THREE']
                    done()

        it 'supports multiple sequencial expanders',

            (done, In, Compiler) ->

                mock(global.$$in.expanders).does

                    ex1: (conf, arg) -> then: (r) -> r [arg, 'a', 'b', 'c']
                    ex2: (conf, arg) -> then: (r) -> r [arg, 1, 2, 3]
                    # ex3: 
                    #     deeper: (arg) -> then: (r) -> r [arg, 'do', 're', 'me']
                    async: (conf, arg) -> then: (r) -> r [arg, 'alpha', 'beta', 'um?']


                global.$$in.expanders.ex3 = 
                    deeper: (conf, arg) -> then: (r) -> r [arg, 'do', 're', 'me']


                @expansion = eval: '[expand.ex1(\'arg1\'), expand.ex2(\'arg2\'), expand.ex3.deeper(\'arg3\'), async(\'one\')]'

                Compiler.perform(@opts, @arg, @inArgs, @expansion)
                .then( 
                    (res) ->
                        
                        res.should.eql [ [ 'arg1', 'a', 'b', 'c' ],
                                         [ 'arg2', 1, 2, 3 ],
                                         [ 'arg3', 'do', 're', 'me' ],
                                         [ 'one', 'alpha', 'beta', 'um?' ] ]

                        done()
                    (e) -> done e
                )

        it 'supports expansion passages',

            (done, In, Compiler) ->

                otherArgs = ''

                mock(global.$$in.expanders).does

                    A: (conf, arg, i) -> $$in.promise (resolve) ->

                        otherArgs += arg
                        ++a.i for a in i.anArray
                        resolve(i);

                    I: (conf, arg) -> $$in.promise (resolve) ->

                        otherArgs += arg
                        resolve anArray: [{i:1}, {i:2}, {i:3}]
                                                                                              # property on async call
                                                                                              # as if synchronous
                                                                                              #
                # @expansion = eval: 'console.log xxx: expand.A(\'loop\', expand.I(\'stem \')).anArray'
                @expansion = eval: '++a.i for a in expand.A(\'loop\', expand.I(\'stem \')).anArray'


                Compiler.perform(@opts, @arg, @inArgs, @expansion)
                .then(
                    (res) ->
                        otherArgs.should.equal 'stem loop'
                        res.should.eql [3, 4, 5]
                        done()
                    (err) ->
                        console.log ERR: err
                        done err
                )


        it 'supports passing opt variables to expanders as if in scope', 

            (done, In, Compiler) ->

                mock(global.$$in.expanders).does

                    fn: (conf, optFn, arg) -> $$in.promise (resolve) ->

                        optFn(arg).then resolve

                @expansion = eval: 'expand.fn(optFn, \'arg\')'

                @opts.optFn = (arg) -> $$in.promise (resolve) ->

                    resolve(arg + arg);

                Compiler.perform(@opts, @arg, @inArgs, @expansion)

                .then(
                    (res) ->
                        res.should.equal 'argarg'
                        done()
                    (err) ->
                        console.log ERR: err
                        done err
                )


        it 'supports passing previous arg to expanders as if in scope',

            (done, In, Compiler) ->

                mock(global.$$in.expanders).does

                    fn: (conf, argFn, arg) -> $$in.promise (resolve) ->

                        argFn(arg).then resolve

                @expansion = eval: 'expand.fn(argFn, \'arg\')'

                @inArgs = argFn: (arg) -> $$in.promise (resolve) ->

                    resolve(arg + arg);

                Compiler.perform(@opts, @arg, @inArgs, @expansion)

                .then(
                    (res) ->
                        res.should.equal 'argarg'
                        done()
                    (err) ->
                        console.log ERR: err
                        done err
                )      


        it 'puts the expansion results on the action arg',

            thought: 'Might be usefull. Dunno. No harm in it'

            (done, In, Compiler) ->

                mock(global.$$in.expanders).does

                    thing1: -> [1, 2, 3]

                    thing2: (conf) -> 

                        ['a' + conf.arg.$e[0][0], 
                         'b' + conf.arg.$e[0][1],
                         'c' + conf.arg.$e[0][2]]

                @expansion.eval = 'expand.thing2(expand.thing1())'
                Compiler.perform @opts, @arg, @inArgs, @expansion
                .then =>
                    @arg.$e.should.eql [ 
                        [ 1, 2, 3 ],
                        [ 'a1', 'b2', 'c3' ],
                    ]
                    done()


        it 'allows access to previous args as if in scope',

            (done, In, Compiler) ->

                @inArgs = array: [1, 2, 3]

                @expansion = eval: 'i for i in array'

                Compiler.perform(@opts, @arg, @inArgs, @expansion)

                .then(
                    (res) ->
                        res.should.eql [1,2,3]
                        done()
                    (err) ->
                        console.log ERR: err
                        done err
                ) 



    context 'array flag', ->

        it 'is set if "for" appears in eval',

            (done, In, Compiler) ->

                @opts = vvv: [1, 3, 3]
                @expansion = eval: '{v:i} for i in vvv'
                Compiler.perform(@opts, @arg, @inArgs, @expansion)
                .then (res) =>
                    @arg.asArray.should.equal true
                    # console.log res
                    done()

