objective 'Error handling', ->

    it.only 'exits with errno if no handler',

        (In, done) ->

            mock(process).does exit: (errno) ->

                errno.should.equal 42
                done()

            $$in (arg) ->

                ### in(arg). {{

                    throw new InfusionError('Oh! No!', errno: 42)

                }} ###
