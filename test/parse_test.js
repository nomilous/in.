objective('Parse function args', function(Parse, should) {

  // trace.filter = true;

  it('finds args from function definition', function() {
    fn = function(arg1, arg2) {}
    args = Parse({}, fn);
    args[0].name.should.equal('arg1');
    args[1].name.should.equal('arg2');
  });


  it('has no problem with wtf', function() {
    fn = function(   /*oldArg, */ arg1, /* another, */arg2 ) {// ,old, bunch, of, args) {
                                      // even ,older, bunch, of, args) {
    }
    args = Parse({}, fn);
    args[0].name.should.equal('arg1');
    args[1].name.should.equal('arg2');
  });


  it('populates the infusion', function() {
    fn = function( /*mor junk*/ arg) {// in.action actor bl(a,b)lah
    }
    args = Parse({}, fn);
    args[0].in.should.eql('in.action actor bl(a,b)lah')

  });

  it('populates multiple infusers', function() {
    fn = function(
        arg1 // in.action1 actor1 kljanasf sadf asdf
      , arg2 // in.action2 actor2 as;dfjkn lkjfsad ds80783§123$%#^!#$
      , arg3) { // in.someone being difficult
    }
    args = Parse({}, fn);
    args[0].in.should.eql('in.action1 actor1 kljanasf sadf asdf')
    args[1].in.should.eql('in.action2 actor2 as;dfjkn lkjfsad ds80783§123$%#^!#$')
    args[2].in.should.eql('in.someone being difficult')
  });

  it('carries new lines for special people', function() {
    fn = function(
      arg1, /*        in.action actor y\
                                      e\
                                      s\
                                      please*/
      arg2 // in.cognito
    ) {};
    args = Parse({}, fn);
    args[0].in.should.match(/\n/)
    args[0].in.should.match(/please/)
    args[1].in.should.equal('in.cognito')
  })

  context("coffee script can't put comments in (h,ere) ->", function() {

    it('can post assign infusers from within function body', function() {
      fn = function(arg1, arg2, arg3) {
        /* in(arg1).action actor A */
        /* in(arg0).action actor B */ //ignored!
        /* in(arg3).action actor C */
        /* in(arg2).action actor D */
      }
      args = Parse({}, fn);
      args.should.eql([
        { name: 'arg1', in: 'in.action actor A' },
        { name: 'arg2', in: 'in.action actor D' },
        { name: 'arg3', in: 'in.action actor C' }
      ])

    });
  })
});
