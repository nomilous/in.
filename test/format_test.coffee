objective 'Format infuser', ->

    it 'defaults to module', (Format) ->

        Format.perform {}, {}, arg = name: 'name'
        arg.in.should.equal 'in.module name'


    it 'extracts the action and actor', (Format) ->

        Format.perform {}, {}, arg = name: 'name', in: 'in.action actor p a r r a m s'
        arg.should.eql
            name: 'name'
            in: 'in.action actor p a r r a m s'
            value: undefined
            actions: [
                action: 'action'
                actor: 'actor'
                params: 'p a r r a m s'
            ]


        Format.perform {}, {}, arg = name: 'name', in: 'in.action actor'
        arg.should.eql
            name: 'name'
            in: 'in.action actor'
            value: undefined
            actions: [
                action: 'action'
                actor: 'actor'
                params: undefined
            ]


        Format.perform {}, {}, arg = name: 'name', in: 'in.action'
        arg.should.eql
            name: 'name'
            in: 'in.action'
            value: undefined
            actions: [
                action: 'action'
                actor: undefined
                params: undefined
            ]

    it 'returns a promise', (Format, done) ->

        Format.perform({}, {}, arg = name: 'name', in: 'in.action').then (arg) ->

            arg.name.should.equal 'name'
            done()


    it 'calls the expander', (Format, Expander, done) ->

        Expander.does perform: (opts, accum, arg, expansions) ->

            opts.should.equal 'OPTS'
            accum.should.equal 'ACCUM'
            arg.name.should.equal 'name'
            expansions.should.equal 'expansions'

            return then: done

        Format.perform 'OPTS', 'ACCUM', arg = {name: 'name', in: 'in.action'}, 'expansions'
