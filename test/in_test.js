objective('In', function(should) {

  // trace.filter = true;

  it('pollutes the global namespace', {

    why: "Extenders need only define global.$$in.<action>.<actor>" +
         "to integrate their argument infuser."

  }, function(In) {
    should.exist($$in);
  });

  it('returns a promise', function(done, In) {
    In(function(){}).then.should.be.an.instanceof(Function)
    done()
  });


  xcontext('formatting', function(In, Format, Action,  Injector) {

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
        return {then: function(resolver) {resolver()}}
      })
      In(function(arg1, arg2, arg3) {}).then(function() {
        done();
      });
    });
  });

  
  xcontext('action', function(In, Format, Action, Injector) {

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
        return {then: function(resolver) {resolver()}}
      })
      In(function(arg1, arg2, arg3) {}).then(function() {
        done();
      });
    })
  });

  xcontext('aliases', function(In, Injector) {

    it('calls shell on $', function(done) {

      Injector.stub(function perform(){
        return {then: function(resolver) {resolver()}}
      })

      $$in.actions = {as: {reason: {shell: done}}}
      In(function(progress) { // in.as.reason $ /usr/local/bin/being < /dev/imagination | /usr/sbin/culture |
      });
    })

  });

});
