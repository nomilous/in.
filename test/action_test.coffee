objective 'Call infuse action', (should) ->

    trace.filter = true

    beforeEach ->

        @defer = 
            resolve: ->
            reject: ->
            nofity: ->
        @opts = {}
        @accum = {}
        @expansions = []
        @arg = 
            actions: [
                action: 'action'
                actor: 'actor'
            ]


    it 'calls the action actor',

        (done, Action) ->

            global.$$in.actions = action: actor: done
            Action.perform @defer, @opts, @accum, @expansions, @arg


    it 'some actions have no actor',

        (done, Action) ->

            global.$$in.actions = action2: done
            @arg.actions[0].actor = undefined
            @arg.actions[0].action = 'action2'
            Action.perform @defer, @opts, @accum, @expansions, @arg


    it 'rejects with an InfusionError if no action.actor',

        (done, Action) ->

            global.$$in.actions = action: actor: done
            @arg.actions[0].actor = undefined
            @defer.reject = (e) ->
                e.toString().should
                .match /InfusionError\: No function at \$\$in\.actions\.action/
                done()

            Action.perform @defer, @opts, @accum, @expansions, @arg


    it 'rejects with an InfusionError if no action.actor',

        (done, Action) ->

            global.$$in.actions = action: actor: done
            @arg.actions[0].action = 'deeper.action'
            @defer.reject = (e) ->
                e.toString().should
                .match /InfusionError\: No function at \$\$in\.actions\.deeper\.action\.actor/
                done()

            Action.perform @defer, @opts, @accum, @expansions, @arg


    it 'matters not how deep the rabbit hole goes',

        (done, Action) ->

            global.$$in.actions = once: upon: a: time: there: was: 1: ->

                arguments[2].should.eql action: 'once.upon.a.time.there.was', actor: '1'
                done()

            @arg.actions[0].action = 'once.upon.a.time.there.was'
            @arg.actions[0].actor = '1'
            Action.perform @defer, @opts, @accum, @expansions, @arg


    it 'differentiates actionPath and actorPath',

        (done, Action) ->

            global.$$in.actions = and: they: lived: happily: ever: NaN: done

            @arg.actions[0].action = 'and.they.lived'
            @arg.actions[0].actor = 'happily.ever.NaN'
            Action.perform @defer, @opts, @accum, @expansions, @arg


    it 'hands the remaing actorPath to the first function along it',

        (done, Action) ->

            global.$$in.actions = and: they: lived: happily: ->

                arguments[3].should.eql ['ever', 'NaN']
                done()

            @arg.actions[0].action = 'and.they.lived'
            @arg.actions[0].actor = 'happily.ever.NaN'
            Action.perform @defer, @opts, @accum, @expansions, @arg



    context 'promise', ->

        beforeEach ->

            @arg.actions[0].action = 'ACTION1'
            @arg.actions[0].actor = 'ACTOR1'
            global.$$in.actions = ACTION1: ACTOR1: -> 'RESULT'


        it 'resolves with returned value if the actor returns no promise',

            (Action, done) ->

                @defer.resolve = (res) ->

                    res.should.equal 'RESULT'
                    done()

                Action.perform @defer, @opts, @accum, @expansions, @arg


        it 'resolves with what the actor resolves with if actor returns a promise',

            (Action, In, done) ->

                @defer.resolve = (res) ->
                    res.should.equal 'RESULT'
                    done()

                global.$$in.actions = ACTION1: ACTOR1: -> 
                    $$in.promise (resolve) ->
                        resolve('RESULT')

                Action.perform @defer, @opts, @accum, @expansions, @arg


    context 'expansion', ->

        beforeEach ->

            @arg.actions[0].action = 'ACTION1'
            @arg.actions[0].actor = 'ACTOR1'
            @arg.actions[1] = 
                action: 'ACTION1'
                actor: 'ACTOR1'
            global.$$in.actions = ACTION1: ACTOR1: -> 'RESULT'


        it 'supports multiple actions in the same arg',

            why: """Formatter can expand.
                    eg. // in.as shell cat {for file in expand.dir(/etc/bind/zones/db.*)} | zone2json
                 """

            (Action, In, done) ->

                @defer.resolve = (res) ->
                    
                    res.should.eql ['RESULT', 'RESULT']
                    done()

                global.$$in.actions = ACTION1: ACTOR1: -> 
                    $$in.promise (resolve) ->
                        resolve('RESULT')

                Action.perform @defer, @opts, @accum, @expansions, @arg


        it 'passes result through the infusers expansion handler if defined',

            (Action, In, done) ->

                @defer.resolve = (res) ->
                    
                    res.should.equal 'REFORMATTED BY EXPANSION HANDLER'
                    done()

                global.$$in.actions = ACTION1: ACTOR1: -> 
                    $$in.promise (resolve) ->
                        resolve('RESULT')

                global.$$in.actions.ACTION1.ACTOR1
                .onExpanded = (actionArgs, expansions, results) ->

                    results.should.eql ['RESULT', 'RESULT']
                    return 'REFORMATTED BY EXPANSION HANDLER'


                Action.perform @defer, @opts, @accum, @expansions, @arg








