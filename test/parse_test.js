objective('Parse function args', function(Parse, should) {

  require('../');

  // trace.filter = true;

  it('finds args from function definition', function() {
    fn = function(arg1, arg2) {}
    args = Parse({}, fn);
    args.arg1.name.should.equal('arg1');
    args.arg2.name.should.equal('arg2');
  });


  it('has no problem with wtf', function() {
    fn = function(   /*oldArg, */ arg1, /* another, */arg2 ) {// ,old, bunch, of, args) {
                                      // even ,older, bunch, of, args) {
    }
    args = Parse({}, fn);
    args.arg1.name.should.equal('arg1');
    args.arg2.name.should.equal('arg2');
  });


  it('populates the infusion', function() {
    fn = function( /*mor junk*/ arg) {// in.action actor bl(a,b)lah
    }
    args = Parse({}, fn);
    args.arg.infuse.should.eql('in.action actor bl(a,b)lah')

  });

  it('populates multiple infusers', function() {
    fn = function(
        arg1 // in.action1 actor1 kljanasf sadf asdf
      , arg2 // in.action2 actor2 as;dfjkn lkjfsad ds80783§123$%#^!#$
      , arg3) { // in.someone being difficult
    }
    args = Parse({}, fn);
    args.arg1.infuse.should.eql('in.action1 actor1 kljanasf sadf asdf')
    args.arg2.infuse.should.eql('in.action2 actor2 as;dfjkn lkjfsad ds80783§123$%#^!#$')
    args.arg3.infuse.should.eql('in.someone being difficult')
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
    args.arg1.infuse.should.match(/\n/)
    args.arg1.infuse.should.match(/please/)
    args.arg2.infuse.should.equal('in.cognito')
  })

  it('handles nested inner $$in ok', function() {
    fn = function(
      arg1, // in. text1
      arg2, // in. {{2}}
      arg3  // in. text3
    ) {
      $$in(function(
        arg1, // in. nested1
        arg2  // in. nested2
      ){})
    };
    args = Parse({}, fn);
    args.should.eql({
      arg1: { name: 'arg1', infuse: 'in. text1' },
      arg2: { name: 'arg2', infuse: 'in. {{2}}' },
      arg3: { name: 'arg3', infuse: 'in. text3' }
    })
  });

  it('handles nested inner and outer $$in ok', function() {
    fn = function(
      arg1,  // in. text1
      arg2, //in. {{2}}
      arg3
    ) { // in. text3
      $$in(function(
        arg1, // in. nested1
        arg2  // in. nested2
      ){})
    };
    args = Parse({}, fn);
    args.should.eql({
      arg1: { name: 'arg1', infuse: 'in. text1' },
      arg2: { name: 'arg2', infuse: 'in. {{2}}' },
      arg3: { name: 'arg3', infuse: 'in. text3' }
    })
  });

  it('handles nested outer and contained $$in ok', function() {
    fn = function(
      arg1,
      arg2,
      arg3
    ) { // in. text3

      // in(arg1). text1
      // in(arg2). {{2}}

      $$in(function(
        arg1, // in. nested1
        arg2  // in. nested2
      ){})
    };
    args = Parse({}, fn);
    args.should.eql({
      arg1: { name: 'arg1', infuse: 'in. text1' },
      arg2: { name: 'arg2', infuse: 'in. {{2}}' },
      arg3: { name: 'arg3', infuse: 'in. text3' }
    })
  });

  it('does the same for out', function() {

    fn = function(
        arg1 // out.action1 actor1 kljanasf sadf asdf
      , arg2 // out.action2 actor2 as;dfjkn lkjfsad ds80783§123$%#^!#$
      , arg3) { // out.someone being difficult
    }

    args = Parse({}, fn);
    args.arg1.infuse.should.eql('out.action1 actor1 kljanasf sadf asdf')
    args.arg2.infuse.should.eql('out.action2 actor2 as;dfjkn lkjfsad ds80783§123$%#^!#$')
    args.arg3.infuse.should.eql('out.someone being difficult')
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

      args.should.eql({
        arg1: { name: 'arg1', infuse: 'in.action actor A' },
        arg2: { name: 'arg2', infuse: 'in.action actor D' },
        arg3: { name: 'arg3', infuse: 'in.action actor C' }
      })

    });

    it('does the same for out', function() {
      fn = function(arg1, arg2, arg3) {
        /* out(arg1).action actor A */
        /* out(arg0).action actor B */ //ignored!
        /* out(arg3).action actor C */
        /* out(arg2).action actor D */
      }
      args = Parse({}, fn);

      args.should.eql({
        arg1: { name: 'arg1', infuse: 'out.action actor A' },
        arg2: { name: 'arg2', infuse: 'out.action actor D' },
        arg3: { name: 'arg3', infuse: 'out.action actor C' }
      })

    });

  })

});
