objective 'Error handling', ->

    # no longer callign the error handler, 
    # let the promise reject if no ee in args

    xit 'exits with errno if no handler',

        (In, done) ->

            mock(process).does exit: (errno) ->

                errno.should.equal 42
                done()

            $$in (arg) ->

                ### in(arg). {{

                    throw new InfusionError('Oh! No!', errno: 42)

                }} ###

            .catch ->


    xit 'calls optional error handler', 

        (In, done) ->

            $$in

                onError: (e) ->

                    e.errno.should.match 42
                    done()

                (arg) ->

                    ### in(arg). {{

                        throw new InfusionError('Oh! No!', errno: 42)

                    }} ###

            .catch ->


    it 'injects the error if (ee)',

        (In, done) ->

            $$in (arg, ee) ->

                ### in(arg). {{

                    throw new InfusionError 'Oh! No!'

                }} ###

                ee.toString().should.match /Oh/
                done()

