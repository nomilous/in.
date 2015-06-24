objective 'Error handling', ->

    it 'exits with errno if no handler',

        (In, done) ->

            mock(process).does exit: (errno) ->

                errno.should.equal 42
                done()

            $$in (arg) ->

                ### in(arg). {{

                    throw new InfusionError('Oh! No!', errno: 42)

                }} ###


    it 'calls optional error handler', 

        (In, done) ->

            $$in

                onError: (e) ->

                    e.errno.should.match 42
                    done()

                (arg) ->

                    ### in(arg). {{

                        throw new InfusionError('Oh! No!', errno: 42)

                    }} ###


    it 'injects the error if (e)'

    it 'injects the error if (err)'

    it 'injects the error if (error)'

