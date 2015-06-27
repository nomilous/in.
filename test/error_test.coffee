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

            .catch ->


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

            .catch ->


    it 'injects the error if (e)',

        (In, done) ->

            $$in (arg, e) ->

                ### in(arg). {{

                    throw new InfusionError 'Oh! No!'

                }} ###

                e.toString().should.match /Oh/
                done()




    it 'injects the error if (err)',

        (In, done) ->

            $$in (arg, err) ->

                ### in(arg). {{

                    throw new InfusionError 'Oh! No!'

                }} ###

                err.toString().should.match /Oh/
                done()


    it 'injects the error if (error)',

        (In, done) ->

            $$in (arg, error) ->

                ### in(arg). {{

                    throw new InfusionError 'Oh! No!'

                }} ###

                error.toString().should.match /Oh/
                done()

