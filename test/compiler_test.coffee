objective 'Compile embedded in{{fusions}}', (should) ->

    beforeEach ->

        @opts = value: 'VALUE 1'
        @arg = {}
        @accum = {}
        @expans = []
        @expansion = eval: 'opts.value'

    it 'returns the result of the expansion eval',

        (done, Compiler) ->

            Compiler.perform @opts, @arg, @accum, @expans, @expansion
            .then (res) ->

                res.should.equal 'VALUE 1'
                done()

    it 'does not allow more than one call to expand.thing',

        (done, Compiler) ->

            @expansion = eval: 'expand.thing() and expand.thisToo()'
            Compiler.perform(@opts, @arg, @accum, @expans, @expansion)
            .then( 
                (res) ->
                (err) ->
                    should.exist err
                    done()
            )

    it 'calls the specified external expander',

        (done, In, Compiler) ->

            mock(global.$$in.expanders).does

                thing: (conf, arg1, arg2) ->

                    arg1.should.equal 'arg value'
                    arg2.should.equal 'VALUE'
                    then: (resolver) -> resolver([1, 2, 3]);
                    
            @expansion = eval: 'expand.thing(\'arg value\', $a.previousArg)'
            @accum = {previousArg: 'VALUE'};
            
            Compiler.perform(@opts, @arg, @accum, @expans, @expansion)
            .then (res) ->

                res.should.eql [1, 2, 3]
                done()

    it 'provides the expander result for further expansion by coffee script snippet',

        (done, In, Compiler) ->

            mock(global.$$in.expanders).does
                thirdPartyExpander: (conf, arg1) ->
                    then: (resolver) -> 
                        resolver [{a: 1}, {a: 2}, {a: 'THREE'}]

            @expansion = eval: 'thing.a for thing in expand.thirdPartyExpander(\'arg\')'
            
            Compiler.perform(@opts, @arg, @accum, @expans, @expansion)
            .then (res) ->
                res.should.eql [1, 2, 'THREE']
                done()


    context 'array flag', ->

        it 'is set if "for" appears in eval',

            (done, In, Compiler) ->

                @opts = vvv: [1, 3, 3]
                @expansion = eval: '{v:i} for i in $o.vvv'
                Compiler.perform(@opts, @arg, @accum, @expans, @expansion)
                .then (res) =>
                    @arg.asArray.should.equal true
                    # console.log res
                    done()

