objective 'Callback expander', ->

    xit 'works',

        (done, In) ->

            In.actors.none.$$can = -> true

            In

                onError: (e) ->

                    console.log e.stack
                    done e

                fn1: (arg1, callback) -> $$in.promise (resolve) -> resolve arg1 * 10

                fn2: (arg1) -> $$in.promise (resolve) -> resolve arg1 * 100

                (arg) -> 

                    ### in(arg). {{callback(1, fn1, fn2) }}###

                    console.log XXX: arg
                    done()


    it 'runs the provided function',

        (done, In, Callback) ->

            Callback {}, done

    it 'passes the provided args to the function',

        (done, In, Callback) ->

            fn = (arg1, arg2) -> 

                arg1.should.equal 'Arg1'
                arg2.should.equal 'Arg2'
                done()

            Callback {}, 'Arg1', 'Arg2', fn


    it 'resolves the results',

        (done, In, Callback) ->

            fn1 = (callback) -> callback undefined, 1

            fn2 = (callback) -> callback null, 2

            Callback {}, fn1, fn2

            .then (r) -> 

                r.should.eql [1, 2]
                done()

            .catch done


    it 'rejects on error',

        (done, In, Callback) ->

            fn1 = (callback) -> callback new Error 'Oh! No!'

            fn2 = (callback) -> done new Error 'this should not run'

            Callback {}, fn1, fn2

            .catch (e) ->

                e.toString().should.match /Oh/
                done()






