objective 'Format infuser', ->

    beforeEach (In, Expander) ->

        Expander.stub perform: -> then: (resolve) -> resolve()
        global.$$in.actors.none = ->
        global.$$in.actors.actor = ->

    it 'defaults to module', (Format) ->

        Format.perform {}, {}, arg = name: 'name'
        arg.in.should.equal 'in.module name'

    it 'sets the actor to none if it does not exist', (Format) ->

        Format.perform {}, {}, arg = name: 'name', in: 'in.action moon-dancer ex pans ion'
        arg.actions[0].actor.should.equal 'none'


    it 'extracts the action and actor and parameters', (Format) ->

        Format.perform {}, {}, arg = name: 'name', in: 'in.action actor ex pans ion'
        arg.should.eql
            name: 'name'
            in: 'in.action actor ex pans ion'
            value: undefined
            actions: [
                action: 'action'
                filters: []
                actor: 'actor'
                expansion: 'ex pans ion'
            ]

    it 'extracts the action and actor', (Format) ->

        Format.perform {}, {}, arg = name: 'name', in: 'in.action actor'
        arg.should.eql
            name: 'name'
            in: 'in.action actor'
            value: undefined
            actions: [
                action: 'action'
                filters: []
                actor: 'actor'
                expansion: undefined
            ]

    it 'extracts the action', (Format) ->

        Format.perform {}, {}, arg = name: 'name', in: 'in.action'
        arg.should.eql
            name: 'name'
            in: 'in.action'
            value: undefined
            actions: [
                action: 'action'
                filters: []
                actor: 'none'
                expansion: undefined
            ]

    it 'extracts the action and filter and actor and params', (Format) ->

        Format.perform {}, {}, arg = name: 'name', in: 'in.action.filter actor params'
        arg.should.eql
            name: 'name'
            in: 'in.action.filter actor params'
            value: undefined
            actions: [
                action: 'action'
                filters: ['filter']
                actor: 'actor'
                expansion: 'params'
            ]

    it 'extracts the action and filter and actor', (Format) ->

        Format.perform {}, {}, arg = name: 'name', in: 'in.action.filter1.filter2 actor'
        arg.should.eql
            name: 'name'
            in: 'in.action.filter1.filter2 actor'
            value: undefined
            actions: [
                action: 'action'
                filters: ['filter1', 'filter2']
                actor: 'actor'
                expansion: undefined
            ]

    it 'extracts the action and filter', (Format) ->

        Format.perform {}, {}, arg = name: 'name', in: 'in.action.filter1.filter2'
        arg.should.eql
            name: 'name'
            in: 'in.action.filter1.filter2'
            value: undefined
            actions: [
                action: 'action'
                filters: ['filter1', 'filter2']
                actor: 'none'
                expansion: undefined
            ]

    it 'returns a promise', (Format, Expander, done) ->

        Format.perform({}, {}, arg = name: 'name', in: 'in.action')
        .then done, done


    it 'calls the expander', (Format, Expander, done) ->

        Expander.does perform: (opts, accum, arg) ->

            opts.should.equal 'OPTS'
            accum.should.equal 'ACCUM'
            arg.name.should.equal 'name'

            return then: done

        Format.perform 'OPTS', 'ACCUM', arg = {name: 'name', in: 'in.action'}
