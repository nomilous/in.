objective 'Inject processed args into function', ->

    it 'populates each arg and calls the function', 

        (done, Injector) ->

            fn = (arg1, arg2, arg3) ->

                arg1.should.equal 1
                arg2.should.equal 2
                arg3.should.equal 3
                done()

            Injector.perform {},
                arg1: value: 1
                arg2: value: 2
                arg3: value: 3
                fn


    it 'calls onInject with each arg',

        (done, Injector) ->

            fn = (arg1, arg2, arg3) ->

                [arg1, arg2, arg3].should.eql [2,3,4]
                done()


            opts = 
                $$onInject: (arg, callback) ->
                    arg.value++
                    callback()


            Injector.perform opts,
                arg1: value: 1
                arg2: value: 2
                arg3: value: 3
                fn


    it 'calls the function with the error',

        (done, Injector) ->

            fn = (ee, arg1) ->
                ee.toString().should.match /Oh/
                done()

            opts = 
                $$onInject: (arg, callback) ->
                    callback new Error 'Oh! No!'

            Injector.perform opts, 
                ee: {}
                arg1: value: 2
                fn
