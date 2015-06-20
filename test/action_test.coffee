objective 'Call infuse action', (should) ->

    # trace.filter = true

    beforeEach ->

        @defer = 
            resolve: ->
            reject: ->
            nofity: ->
        @opts = {}
        @accum = {}
        @arg = 
            action: 'action'
            actor: 'actor'


    it 'calls the action actor',

        (done, Action) ->

            global.$$in.actions = action: actor: done
            Action.perform @defer, @opts, @accum, @arg


    it 'some actions have no actor',

        (done, Action) ->

            global.$$in.actions = action2: done
            @arg.actor = undefined
            @arg.action = 'action2'
            Action.perform @defer, @opts, @accum, @arg


    it 'rejects with an InfusionError if no action.actor',

        (done, Action) ->

            global.$$in.actions = action: actor: done
            @arg.actor = undefined
            @defer.reject = (e) ->
                e.toString().should
                .match /InfusionError\: No function at \$\$in\.actions\.action/
                done()

            Action.perform @defer, @opts, @accum, @arg


    it 'rejects with an InfusionError if no action.actor',

        (done, Action) ->

            global.$$in.actions = action: actor: done
            @arg.action = 'deeper.action'
            @defer.reject = (e) ->
                e.toString().should
                .match /InfusionError\: No function at \$\$in\.actions\.deeper\.action\.actor/
                done()

            Action.perform @defer, @opts, @accum, @arg


    it 'matters not how deep the rabbit hole goes',

        (done, Action) ->

            global.$$in.actions = once: upon: a: time: there: was: 1: ->

                arguments[2].should.eql action: 'once.upon.a.time.there.was', actor: '1'
                done()

            @arg.action = 'once.upon.a.time.there.was'
            @arg.actor = '1'
            Action.perform @defer, @opts, @accum, @arg


    it 'differentiates actionPath and actorPath',

        (done, Action) ->

            global.$$in.actions = and: they: lived: happily: ever: NaN: done

            @arg.action = 'and.they.lived'
            @arg.actor = 'happily.ever.NaN'
            Action.perform @defer, @opts, @accum, @arg


    it 'hands the remaing actorPath to the first function along it',

        (done, Action) ->

            global.$$in.actions = and: they: lived: happily: ->

                arguments[3].should.eql ['ever', 'NaN']
                done()

            @arg.action = 'and.they.lived'
            @arg.actor = 'happily.ever.NaN'
            Action.perform @defer, @opts, @accum, @arg



    context 'promise', ->

        beforeEach ->

            @arg.action = 'ACTION1'
            @arg.actor = 'ACTOR1'
            global.$$in.actions = ACTION1: ACTOR1: -> 'RESULT'


        it 'resolves with returned value if the actor returns no promise',

            (Action, done) ->

                @defer.resolve = (res) ->

                    res.should.equal 'RESULT'
                    done()

                Action.perform @defer, @opts, @accum, @arg


        it 'resolves with what the actor resolves with of actor returns a promise',

            (Action, In, done) ->

                @defer.resolve = (res) ->
                    res.should.equal 'RESULT'
                    done()

                global.$$in.actions = ACTION1: ACTOR1: -> 
                    $$in.promise (resolve) ->
                        resolve('RESULT')

                Action.perform @defer, @opts, @accum, @arg









