objective 'Async expander', ->

    xit 'works',

        (done, In) ->

            In.actors.none.$$can = -> true

            In

                onError: (e) ->

                    console.log e.stack
                    done e

                fn1: (arg1) -> $$in.promise (resolve) -> resolve arg1 * 10

                fn2: (arg1) -> $$in.promise (resolve) -> resolve arg1 * 100

                (arg) -> 

                    ### in(arg). {{async(1, fn1, fn2) }}###

                    console.log XXX: arg
                    done()

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

