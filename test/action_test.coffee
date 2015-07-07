objective 'Call infusion actor', (should) ->

    beforeEach ->

        @defer = 
            resolve: ->
            reject: (e) -> # console.log(e);
            nofity: ->
        @opts = {}
        @inArgs = {}
        @arg = 
            actions: [
                action: ['in', 'as']
                adapters: []
                actor: 'actor'
                expansion: ''
                value: ''
            ]

        global.$$in.actors = (global.$$in.actors || {})
        global.$$in.actors.actor = ->  
        global.$$in.actors.actor.$$can = ->
        global.$$in.adapters = (global.$$in.adapters || {})
        global.$$in.adapters.stream = ->

    it 'rejects with error if stream is not first adapter',

        # adapters process right to left

        (done, Action) ->

            global.$$in.actors.actor = done
            @arg.actions[0].adapters = ['json', 'stream']
            @defer.reject = (e) ->

                e.toString().should.match /InfusionError\: stream must be first adapter/
                done()

            Action.perform @defer, @opts, @inArgs, @arg


    it 'checks the actor for adapter support',

        (done, Action) ->

            @arg.actions[0].adapters = ['stream']

            global.$$in.actors.actor.$$can = (action) ->

                action.adapters.should.eql ['stream']
                done()
                true

            Action.perform @defer, @opts, @inArgs, @arg


    it 'calls the action actor',

        (done, Action) ->

            @arg.actions[0].adapters = ['stream']

            global.$$in.actors.actor = (opts, inArgs, actionArg, actorPath) ->

                actionArg.adapters.should.eql ['stream']
                done()

            global.$$in.actors.actor.$$can = () -> true

            Action.perform @defer, @opts, @inArgs, @arg


    it 'matters not how deep the rabbit hole goes',

        (done, Action) ->

            @arg.actions[0].actor = 'actor.can.do.multiple.things'

            global.$$in.actors.actor = (opts, inArgs, actionArg, actorPath) ->

                actorPath.should.eql ['can', 'do', 'multiple', 'things']
                done()

            global.$$in.actors.actor.$$can = () -> true

            Action.perform @defer, @opts, @inArgs, @arg


    context 'expansion', ->

        beforeEach ->

            @arg.actions[0].action = 'ACTION1'
            @arg.actions[0].actor = 'ACTOR1'
            @arg.actions[1] = 
                action: 'ACTION1'
                actor: 'ACTOR1'
                adapters: []

        it 'supports multiple actions in the same arg',

            (Action, Adapter, In, done) ->

                global.$$in.actors.ACTOR1 = -> 
                    $$in.promise (resolve) ->
                        resolve('RESULT')

                global.$$in.actors.ACTOR1.$$can = -> true

                Adapter.does perform: (opts, inArgs, arg, results) ->

                    results.should.eql ['RESULT', 'RESULT']
                    done()
                    then: ->

                @arg.asArray = true
                Action.perform @defer, @opts, @inArgs, @arg
                
