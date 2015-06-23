xobjective('ensure it all works', function(should) {

  trace.filter = false

  before(function(){
    mock('dir', require('in.expander.dir'));
  });

  context('general functionality', function() {

    before(flush)
    before(function(){
      delete $$in.actors.none
      delete $$in.filters.none
    });

    it('runs end to end with nothing to do', function(done, In) {
      In(function(
        arg1, // in. moo
        arg2  // in. {{i for i in [1..3]}}
      ){
        // arg.should.equal('moo');
        console.log({A1:arg1});
        console.log({A2:arg2});

        // return 1arg;
      }).then(
        function(arg) {
          // arg.should.equal('moo');
          // done();
        }
      )
    })

  })


  context('in.expander.dir', function() {

      it ('is called on expand.dir', function(In, dir, done) {

      // set expectation on expand.dir() handler

      dir.does(function perform(config, arg1){

        config.should.eql({
          opts: {
            // conf: 'ig'
          },
          expansion: {
            eval: 'expand.dir(\'./\')'
          }
        });

        arg1.should.equal('./');

        return {
          then: function(resolver) {
            resolver(['file1', 'file2']);
          }
        }
      })

      $$in(
        function(
          files // in. {{expand.dir('./')}}
        ){

          files.should.eql ['file1', 'file2']
          done()
        }
      ).then(function(){}, done)

    })

  })


  context('in.actor.shell', function() {

    it('is called on shell action', function(In, done) {


      $$in(
        function(
          files // in. {{i for i in [0..10]}}
        ){
          console.log(files)
          // files.should.eql ['file1', 'file2']
          done()
        }
      ).then(function(){}, done)

    })

  })


});
