objective('ensure it all works', function(should) {

  before(flush)
  before(function(){
    delete $$in.actors
    delete $$in.adapters

  });

  before(function(){
    mock('dir', require('in.expander.dir'));
  });

  context('general functionality', function() {

    it('runs the empty function', function(done, In) {

      In(function(){
        done()
      });
    });

    it('runs the infused function', function(done, In) {

      In(function(
        arg1, // in. moo
        arg2  // in. {{i for i in [1..3]}}
      ){
        arg1.should.equal('moo');
        arg2.should.eql([1,2,3]);
        done()
      });
    });

    it('accepts a scope', function(done, In) {

      scope = { someFn: function() {return [1, 2, 3]} }
      In(scope, function(array) { // in. {{someFn()}}
        array.should.eql([1, 2, 3]);
        done()
      })

    });

  });

  context('using the promise', function() {

    it('provides promise resolver into the function', function(done, In) {

      In(function(resolve) {
        resolve('result');
      }).then(function(result) {
        result.should.equal('result');
        done();
      })
    })

    it('provides promise rejector into the function', function(done, In) {

      In(function(reject) {
        reject(new Error('Oh! No!'));
      }).then(
        function(result) {
        },
        function(error) {
          error.toString.should.match(/Oh/);
          done();
        }
      )
    })

    it('provides promise notifier into the function', function(done, In) {

      In(function(notify) {
        notify('helloo')
      }).then(
        function(result) {
        },
        function(error) {
        },
        function(message) {
          message.should.equal('helloo');
          done();
        }
      )
    })

    it('rejects if the function throws after injection', function(done, In) {

      In(function(){
        throw new Error('Oh! No!')
      }).then(
        function(result){},
        function(error) {
          error.toString.should.match(/Oh/);
          done()
        }
      )
    })


    it('puts the promise resolver and rejector and notifier into moustach scope', function(done, In) {

      In(function(
        array, // in. {{[1,2,3]}}
        ps,   // in. {{notify array.length}}
        done // in. {{resolve array}}
      ){}).then(
        function(result){
          result.should.eql [1,2,3]
          done()
        },
        function(){},
        function(m) {
          // console.log(m);
        }
      )
    })
  })


  context('injecting functions', function() {

    it('does not run the function if in.as.function', function(done, In) {

      In(function(
        fn, // in.as.function {{-> throw new Error('Not run')}}
        err
      ){
        should.not.exist(err);
        try {
          fn()
        } catch (e) {
          e.toString().should.match(/Not run/);
          done()
        }
      });
    });

    it('does run the function if not in.as.function', function(done, In) {

      In(function(
        arg1, // in. {{-> throw new Error('Was run')}}
        err
      ){
        should.not.exist(arg1);
        err.toString().should.match(/Was run/);
        done()
      });
    });

    it('it uses the functions promise', function(done, In) {

      In(function(
        arg1, // in. {{ -> $$in.promise (resolve) -> resolve [1,2,3]}}
        err
      ){
        arg1.should.eql [1, 2, 3]
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
          // console.log(files)
          // files.should.eql ['file1', 'file2']
          done()
        }
      ).then(function(){}, done)

    })

  })


});
