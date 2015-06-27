objective 'Format infuser', ->

    beforeEach (In, Expander) ->

        Expander.stub perform: -> then: (resolve) -> resolve()
        global.$$in.actors.none = ->
        global.$$in.actors.actor = ->

    xit 'defaults to module', (Format) ->

        Format.perform {}, {}, arg = name: 'name'
        arg.infuse.should.equal 'in.module name'

    it 'sets the actor to none if it does not exist (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as moon-dancer ex pans ion'
        arg.actions[0].actor.should.equal 'none'


    it 'sets the actor to none if it does not exist (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as moon-dancer ex pans ion'
        arg.actions[0].actor.should.equal 'none'


    it 'extracts the action and actor and parameters (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as actor ex pans ion'

        arg.should.eql
            name: 'name'
            infuse: 'in.as actor ex pans ion'
            value: undefined
            actions: [
                action: ['in', 'as']
                adapters: []
                actor: 'actor'
                expansion: 'ex pans ion'
            ]

    it 'extracts the action and actor and parameters (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as actor ex pans ion'

        arg.should.eql
            name: 'name'
            infuse: 'out.as actor ex pans ion'
            value: undefined
            actions: [
                action: ['out', 'as']
                adapters: []
                actor: 'actor'
                expansion: 'ex pans ion'
            ]

    it 'extracts the action and actor (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as actor'
        arg.should.eql
            name: 'name'
            infuse: 'in.as actor'
            value: undefined
            actions: [
                action: ['in', 'as']
                adapters: []
                actor: 'actor'
                expansion: undefined
            ]

    it 'extracts the action and actor (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as actor'
        arg.should.eql
            name: 'name'
            infuse: 'out.as actor'
            value: undefined
            actions: [
                action: ['out', 'as']
                adapters: []
                actor: 'actor'
                expansion: undefined
            ]

    it 'extracts the action (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as'
        arg.should.eql
            name: 'name'
            infuse: 'in.as'
            value: undefined
            actions: [
                action: ['in', 'as']
                adapters: []
                actor: 'none'
                expansion: undefined
            ]

    it 'extracts the action (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as'
        arg.should.eql
            name: 'name'
            infuse: 'out.as'
            value: undefined
            actions: [
                action: ['out', 'as']
                adapters: []
                actor: 'none'
                expansion: undefined
            ]

    it 'extracts the action and adapter and actor and params (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as.adapter actor params'
        arg.should.eql
            name: 'name'
            infuse: 'in.as.adapter actor params'
            value: undefined
            actions: [
                action: ['in', 'as']
                adapters: ['adapter']
                actor: 'actor'
                expansion: 'params'
            ]

    it 'extracts the action and adapter and actor and params (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as.adapter actor params'
        arg.should.eql
            name: 'name'
            infuse: 'out.as.adapter actor params'
            value: undefined
            actions: [
                action: ['out', 'as']
                adapters: ['adapter']
                actor: 'actor'
                expansion: 'params'
            ]

    it 'extracts the action and adapters and actor (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as.adapter1.adapter2 actor'
        arg.should.eql
            name: 'name'
            infuse: 'in.as.adapter1.adapter2 actor'
            value: undefined
            actions: [
                action: ['in', 'as']
                adapters: ['adapter1', 'adapter2']
                actor: 'actor'
                expansion: undefined
            ]

    it 'extracts the action and adapters and actor (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as.adapter1.adapter2 actor'
        arg.should.eql
            name: 'name'
            infuse: 'out.as.adapter1.adapter2 actor'
            value: undefined
            actions: [
                action: ['out', 'as']
                adapters: ['adapter1', 'adapter2']
                actor: 'actor'
                expansion: undefined
            ]

    it 'extracts the action and adapters (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as.adapter1.adapter2'
        arg.should.eql
            name: 'name'
            infuse: 'in.as.adapter1.adapter2'
            value: undefined
            actions: [
                action: ['in', 'as']
                adapters: ['adapter1', 'adapter2']
                actor: 'none'
                expansion: undefined
            ]

    it 'extracts the action and adapters (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as.adapter1.adapter2'
        arg.should.eql
            name: 'name'
            infuse: 'out.as.adapter1.adapter2'
            value: undefined
            actions: [
                action: ['out', 'as']
                adapters: ['adapter1', 'adapter2']
                actor: 'none'
                expansion: undefined
            ]

    it 'returns a promise', (Format, Expander, done) ->

        Format.perform({}, {}, arg = name: 'name', infuse: 'in.as')
        .then done, done


    it 'calls the expander', (Format, Expander, done) ->

        Expander.does perform: (opts, accum, arg) ->

            opts.should.equal 'OPTS'
            accum.should.equal 'ACCUM'
            arg.name.should.equal 'name'

            return then: done

        Format.perform 'OPTS', 'ACCUM', arg = {name: 'name', infuse: 'in.as'}
