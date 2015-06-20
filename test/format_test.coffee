objective 'Format infuser', ->

    it 'defaults to module', (Format) ->

        Format.perform {}, {}, arg = name: 'name'
        arg.in.should.equal 'in.module name'
        # console.log(arg);


    it 'extracts the action and actor', (Format) ->

        # global.$$in.format = -> console.log arguments

        Format.perform {}, {}, arg = name: 'name', in: 'in.action actor p a r r a m s'
        arg.should.eql
            name: 'name'
            in: 'in.action actor p a r r a m s'
            action: 'action'
            actor: 'actor'
            params: 'p a r r a m s'


        Format.perform {}, {}, arg = name: 'name', in: 'in.action actor'
        arg.should.eql
            name: 'name'
            in: 'in.action actor'
            action: 'action'
            actor: 'actor'
            params: undefined


        Format.perform {}, {}, arg = name: 'name', in: 'in.action'
        arg.should.eql
            name: 'name'
            in: 'in.action'
            action: 'action'
            actor: undefined
            params: undefined

