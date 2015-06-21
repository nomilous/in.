objective('In', function(should) {

  // trace.filter = true;

  it('pollutes the global namespace', {

    why: "Extenders need only define global.$$in.<action>.<actor>" +
         "to integrate their argument infuser."

  }, function() {
    should.exist($$in);
  });


  context('formatting', function(In, Format, Action) {

    it('calls format.perform with each argument', function(done) {

      // wait(Action); return

      Action.stub(function perform(defer){
        defer.resolve();
      });
      Format.does(
        function perform(opts, accum, arg){
          arg.name.should.equal('arg1');
        },
        function perform(opts, accum, arg){
          arg.name.should.equal('arg2');
        },
        function perform(opts, accum, arg){
          arg.name.should.equal('arg3');
        }
      );
      In(function(arg1, arg2, arg3) {}).then(function() {
        done();
      });
    });
  });

  
  context('action', function(In, Format, Action) {

    it('calls action.perform with each argument', function(done) {
      Format.stub(function perform() {});
      Action.does(
        function perform(defer) { defer.resolve() },
        function perform(defer) { defer.resolve() },
        function perform(defer) { defer.resolve() }
      )
      In(function(arg1, arg2, arg3) {}).then(function() {
        done();
      });
    })
  });

  context('aliases', function(In) {

    it('calls shell on $', function(done) {
      $$in.actions = {as: {reason: {shell: done}}}
      In(function(progress) { // in.as.reason $ /usr/local/bin/being < /dev/imagination | /usr/sbin/culture |
      });
    })

  });

  

});
