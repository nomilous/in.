xobjective('ensure it all works', function(should) {

  before(function(){
    mock('dir', require('in.expander.dir'));
  });

  context('general functionality', function() {

    // before(flush)
    // before(function(){
    //   delete $$in.actors.none
    //   delete $$in.adapters.none

    // });

    it('runs end to end with nothing to do', function(done, In) {

      In(function(
        arg1, // in. moo
        arg2  // in. {{i for i in [1..3]}}
      ){
        arg1.should.equal('moo');
        arg2.should.eql([1,2,3]);
        done()
      });
    });

  })


  xcontext('in.expander.dir', function() {

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
