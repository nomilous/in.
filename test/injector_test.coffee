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
                []
                fn

    it 'injectes otherArgs into the gaps',

        (done, Injector) ->

            fn = (arg1, other1, arg2, other2, arg3, other3) ->

                console.log arguments

                [arg1, arg2, arg3].should.eql [1,2,3]
                [other1, other2, other3].should.eql ['a','b','c']
                done()

            Injector.perform {}, 
                arg1: value: 1
                other1: {}
                arg2: value: 2
                other2: {}
                arg3: value: 3
                other3: {}
                ['a', 'b', 'c']
                fn



    it 'calls onInject with each arg',

        (done, Injector) ->

            fn = (arg1, arg2, arg3) ->

                [arg1, arg2, arg3].should.eql [2,3,4]
                done()


            opts = 
                onInject: (arg, callback) ->
                    arg.value++
                    callback()


            Injector.perform opts, 
                arg1: value: 1
                arg2: value: 2
                arg3: value: 3
                []
                fn


    it 'calls opts.onError if error in onInject',

        (done, Injector) ->

            fn = ->

            opts = 
                onInject: (arg, callback) ->
                    callback new Error 'Oh! No!'

                onError: (e) ->
                    e.toString().should.match /Oh/
                    done()


            Injector.perform opts, 
                arg1: value: 1
                arg2: value: 2
                arg3: value: 3
                []
                fn

            .catch ->


    it 'calls the function with the error',

        (done, Injector) ->

            fn = (e, arg1) ->
                e.toString().should.match /Oh/
                done()

            opts = 
                onError: (e) -> e
                onInject: (arg, callback) ->
                    callback new Error 'Oh! No!'

            Injector.perform opts, 
                e: {}
                arg1: value: 2
                []
                fn
