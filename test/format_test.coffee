objective 'Format infuser', ->

    beforeEach (In, Expander) ->

        Expander.stub perform: -> then: (resolve) -> resolve()
        # global.$$in.actors.default = ->
        global.$$in.actors.actor = ->
        global.$$in.actors.actor.$$can = -> true
        global.$$in.actorAliases.$ = 'actor'

    it 'sets the actor to default if it does not exist (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as moon-dancer ex pans ion'
        arg.actions[0].actor.should.equal 'default'


    it 'sets the actor to default if it does not exist (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as moon-dancer ex pans ion'
        arg.actions[0].actor.should.equal 'default'


    it 'extracts the action and actor and parameters (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as     actor   ex   pans  ion'
        
        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'in.as     actor   ex   pans  ion'
            value: undefined
            asArray: false
            actions: [
                action: ['in', 'as']
                adapters: []
                actor: 'actor'
                expansion: 'ex   pans  ion'
            ]

    it 'extracts the action and actor and parameters (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as actor ex pans ion'

        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'out.as actor ex pans ion'
            value: undefined
            asArray: false
            actions: [
                action: ['out', 'as']
                adapters: []
                actor: 'actor'
                expansion: 'ex pans ion'
            ]

    it 'allows actor aliases with control chars', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as $ pa ra ms'

        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'in.as $ pa ra ms'
            value: undefined
            asArray: false
            actions: [
                action: ['in', 'as']
                adapters: []
                actor: 'actor'
                expansion: 'pa ra ms'
            ] 


    it 'extracts the action and actor (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as actor'

        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'in.as actor'
            value: undefined
            asArray: false
            actions: [
                action: ['in', 'as']
                adapters: []
                actor: 'actor'
                expansion: undefined
            ]

    it 'extracts the action and actor (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as actor'

        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'out.as actor'
            value: undefined
            asArray: false
            actions: [
                action: ['out', 'as']
                adapters: []
                actor: 'actor'
                expansion: undefined
            ]

    it 'extracts the action (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as'

        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'in.as'
            value: undefined
            asArray: false
            actions: [
                action: ['in', 'as']
                adapters: []
                actor: 'default'
                expansion: undefined
            ]

    it 'extracts the action (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as'

        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'out.as'
            value: undefined
            asArray: false
            actions: [
                action: ['out', 'as']
                adapters: []
                actor: 'default'
                expansion: undefined
            ]

    it 'extracts the action and adapter and actor and params (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as.adapter actor params'

        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'in.as.adapter actor params'
            value: undefined
            asArray: false
            actions: [
                action: ['in', 'as']
                adapters: ['adapter']
                actor: 'actor'
                expansion: 'params'
            ]

    it 'extracts the action and adapter and actor and params (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as.adapter actor params'

        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'out.as.adapter actor params'
            value: undefined
            asArray: false
            actions: [
                action: ['out', 'as']
                adapters: ['adapter']
                actor: 'actor'
                expansion: 'params'
            ]

    it 'extracts the action and adapters and actor (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as.adapter1.adapter2 actor'

        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'in.as.adapter1.adapter2 actor'
            value: undefined
            asArray: false
            actions: [
                action: ['in', 'as']
                adapters: ['adapter1', 'adapter2']
                actor: 'actor'
                expansion: undefined
            ]

    it 'extracts the action and adapters and actor (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as.adapter1.adapter2 actor'

        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'out.as.adapter1.adapter2 actor'
            value: undefined
            asArray: false
            actions: [
                action: ['out', 'as']
                adapters: ['adapter1', 'adapter2']
                actor: 'actor'
                expansion: undefined
            ]

    it 'extracts the action and adapters (for in)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'in.as.adapter1.adapter2'

        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'in.as.adapter1.adapter2'
            value: undefined
            asArray: false
            actions: [
                action: ['in', 'as']
                adapters: ['adapter1', 'adapter2']
                actor: 'default'
                expansion: undefined
            ]

    it 'extracts the action and adapters (for out)', (Format) ->

        Format.perform {}, {}, arg = name: 'name', infuse: 'out.as.adapter1.adapter2'

        delete arg.actions[0].toString
        arg.should.eql
            name: 'name'
            infuse: 'out.as.adapter1.adapter2'
            value: undefined
            asArray: false
            actions: [
                action: ['out', 'as']
                adapters: ['adapter1', 'adapter2']
                actor: 'default'
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
