objective 'Error handling', ->

    # no longer callign the error handler, 
    # let the promise reject if no ee in args

    it 'injects the error if (ee)',

        (In, done) ->

            $$in (arg, ee) ->

                ### in(arg). {{

                    throw new InfusionError 'Oh! No!'

                }} ###

                ee.toString().should.match /Oh/
                done()


    it 'rejects the error into next promise handler if no ee',

        (In, done) ->

            $$in (arg) ->

                ### in(arg). {{

                    throw new InfusionError 'Oh! No!'

                }} ###

            .then (->), (e) ->

                e.toString().should.match /Oh/
                done()


    it 'supports a catch handler',

        (In, done) ->

            $$in (arg) ->

                ### in(arg). {{

                    throw new InfusionError 'Oh! No!'

                }} ###

            .then (r) -> 1

            .catch (e) ->

                e.toString().should.match /Oh/
                done()
