objective('In', function(should) {

  // trace.filter = true;

  it('pollutes the global namespace', function(In) {
    should.exist($$in);
  });

  it('masquerades as original function', function(In) {
    fn = In(function(done) {});
    fn.toString().should.equal('function (done) {}');
  });

  it('remove special and infused arguments from toString', function(In) {
    fn = In(function(done, ee, xx) { // in.as xx
    });
    fn.toString().should.equal('function (done) { // in.as xx\n    }');
  });

  it('returns a promise', function(done, In) {
    In(function(){}).then.should.be.an.instanceof(Function)
    done()
  });


  context('formatting', function(In, Format, Action,  Injector) {

    it('calls format.perform with each argument', function(done) {

      // wait(Action); return

      Action.stub(function perform(defer){
        defer.resolve();
      });
      Format.does(
        function perform(opts, inArgs, arg){
          arg.name.should.equal('arg1');
          return {then: function(resolver) {resolver(arg)}}
        },
        function perform(opts, inArgs, arg){
          arg.name.should.equal('arg2');
          return {then: function(resolver) {resolver(arg)}}
        },
        function perform(opts, inArgs, arg){
          arg.name.should.equal('arg3');
          return {then: function(resolver) {resolver(arg)}}
        }
      );
      Injector.stub(function perform(){
        done()
        return {then: function(resolver) {resolver()}}
      })
      In(function(
        arg1, // in. 1
        arg2, // in. 2
        arg3 // in. 3
      ){
      }).catch(done);
    });
  });

  
  context('action', function(In, Format, Action, Injector) {

    trace.filter = true;

    it('calls action.perform with each argument', function(done) {
      Format.stub(function perform(opts, inArgs, arg) {
        return {then: function(resolver) {resolver(arg)}}
      });
      Action.does(
        function perform(defer) { defer.resolve() },
        function perform(defer) { defer.resolve() },
        function perform(defer) { defer.resolve() }
      )
      Injector.stub(function perform(){
        done()
        return {then: function(resolver) {resolver()}}
      })
      In(function(
        arg1, // in. 1
        arg2, // in. 2
        arg3  // in. 3
      ){});
    })
  });
});
