objective 'Call infusion actor', (should) ->

    beforeEach ->

        @defer = 
            resolve: ->
            reject: (e) -> console.log(e);
            nofity: ->
        @opts = {}
        @accum = {}
        @arg = 
            actions: [
                action: 'action'
                adapters: []
                actor: 'actor'
                params: ''
            ]

        global.$$in.actors = actor: ->
        global.$$in.actors.actor.$$can = ->
        global.$$in.adapters.pipe = ->

    it 'rejects with error if pipe is not first adapter',

        # adapters process right to left

        (done, Action) ->

            global.$$in.actors = actor: done
            @arg.actions[0].adapters = ['json', 'pipe']
            @defer.reject = (e) ->

                e.toString().should.match /InfusionError\: pipe must be first adapter/
                done()

            Action.perform @defer, @opts, @accum, @arg


    it 'checks the actor for adapter support',

        (done, Action) ->

            @arg.actions[0].adapters = ['pipe']

            global.$$in.actors.actor.$$can = (doStuff) ->

                doStuff.adapters.should.eql ['pipe']
                done()
                true

            Action.perform @defer, @opts, @accum, @arg


    it 'calls the action actor',

        (done, Action) ->

            @arg.actions[0].adapters = ['pipe']

            global.$$in.actors.actor = (opts, accumulate, actionArg, actorPath) ->

                actionArg.adapters.should.eql ['pipe']
                done()

            global.$$in.actors.actor.$$can = () -> true

            Action.perform @defer, @opts, @accum, @arg


    it 'matters not how deep the rabbit hole goes',

        (done, Action) ->

            @arg.actions[0].actor = 'actor.can.do.multiple.things'

            global.$$in.actors.actor = (opts, accumulate, actionArg, actorPath) ->

                actorPath.should.eql ['can', 'do', 'multiple', 'things']
                done()

            global.$$in.actors.actor.$$can = () -> true

            Action.perform @defer, @opts, @accum, @arg


    context 'promise', ->

        beforeEach ->

            @arg.actions[0].action = 'ACTION1'
            @arg.actions[0].actor = 'ACTOR1'
            global.$$in.actors = ACTOR1: -> 'RESULT'
            global.$$in.actors.ACTOR1.$$can = -> true


        xit 'resolves with returned value if the actor returns no promise',

            (Action, done) ->

                @defer.resolve = (res) ->

                    res.should.eql ['RESULT']
                    done()

                Action.perform @defer, @opts, @accum, @arg


        xit 'resolves with what the actor resolves with if actor returns a promise',

            (Action, In, done) ->

                @defer.resolve = (res) ->
                    res.should.eql ['RESULT']
                    done()

                global.$$in.actions = ACTION1: ACTOR1: -> 
                    $$in.promise (resolve) ->
                        resolve('RESULT')

                Action.perform @defer, @opts, @accum, @arg


    context 'expansion', ->

        beforeEach ->

            @arg.actions[0].action = 'ACTION1'
            @arg.actions[0].actor = 'ACTOR1'
            @arg.actions[1] = 
                action: 'ACTION1'
                actor: 'ACTOR1'
                adapters: []
            global.$$in.actions = ACTION1: ACTOR1: -> 'RESULT'


        it 'supports multiple actions in the same arg',

            why: """Formatter can expand.
                    eg. // in.as shell cat {{file for file in expand.dir('/etc/bind/zones/db.*')}}
                 """

            (Action, In, done) ->

                @defer.resolve = (res) ->

                    res.should.eql [['RESULT', 'RESULT']]
                    done()

                global.$$in.actors = ACTOR1: -> 
                    $$in.promise (resolve) ->
                        resolve('RESULT')

                global.$$in.actors.ACTOR1.$$can = -> true

                @arg.asArray = true
                Action.perform @defer, @opts, @accum, @arg


        xit 'passes result through the infusers expansion handler if defined',

            (Action, In, done) ->

                @defer.resolve = (res) ->
                    
                    res.should.equal 'REFORMATTED BY EXPANSION HANDLER'
                    done()

                global.$$in.actions = ACTION1: ACTOR1: -> 
                    $$in.promise (resolve) ->
                        resolve('RESULT')

                global.$$in.actions.ACTION1.ACTOR1
                .onExpanded = (arg, actionArgs, results) ->

                    results.should.eql ['RESULT', 'RESULT']
                    return 'REFORMATTED BY EXPANSION HANDLER'

                @arg.asArray = true
                Action.perform @defer, @opts, @accum, @arg








