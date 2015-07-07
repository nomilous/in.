objective 'Async expander', ->

    it 'works',

        (done, In) ->

            In

                onError: (e) ->

                    console.log e.stack
                    done e

                fn1: (arg1) -> $$in.promise (resolve) -> resolve arg1 * 10

                fn2: (arg1) -> $$in.promise (resolve) -> resolve arg1 * 100

                (arg) -> 

                    ### in(arg). {{ $$async(1, fn1, fn2) }} ###

                    arg.should.eql [10, 100]
                    done()

            .catch done

    it 'runs the provided function',

        (done, Async) ->

            Async {}, done


    it 'passes the provided args to the function',

        trace.filter = true

        (done, In, Async) ->

            fn = (arg1, arg2) -> 

                arg1.should.equal 'Arg1'
                arg2.should.equal 'Arg2'
                done()

            Async {}, 'Arg1', 'Arg2', fn


    it 'rejects on error',

        (done, In, Async) ->

            fn1 = (arg1) -> $$in.promise (r, reject) -> reject new Error 'Oh! No!'

            fn2 = (arg1) -> $$in.promise (r, reject) -> done new Error 'Should not run'

            Async {}, fn1, fn2

            .catch (e) ->

                e.toString().should.match /Oh/
                done()

