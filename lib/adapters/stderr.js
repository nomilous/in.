module.exports = StderrAdapter;

// informs actor to use stderr

function StderrAdapter(opts, inArgs, arg, results) {

  return $$in.promise(function(resolve) {

    resolve(results);

  });

}