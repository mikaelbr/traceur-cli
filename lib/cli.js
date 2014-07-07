'use strict';

var vm = require('vm');
var util = require('util');
var traceur = require('traceur');

var argv = process.argv;

var isRepl = argv.length < 3;

var scriptString = argv[3];
var isEval = (argv[2] === '-e' || argv[2] === '--eval') && scriptString;

var traceurRepl;

// Show repl if no arguments (also on pipe)
if (isRepl) {
  // if data on stdin it is piped to repl
  traceurRepl = require('./repl');
  traceurRepl();
}
// If given a text string to compile
else if (isEval) {
  var compiled = traceur.compile(scriptString);

  // Send in faux context/sandbox
  var result = vm.runInNewContext(compiled.js, {
    console: {
      log: print,
      error: print,
      dir: print
    }
  });

  // To show what is returned and not empty
  if (typeof result === 'undefined' || result == null) {
    result = typeof result;
  }
  // Show detailed objects not just toString
  if (typeof result === 'object') {
    result = util.inspect(result);
  }

  print(result);
  // Just exit at once
  process.exit(1);
} else {
  // Redirect to original traceur project
  require('traceur/src/node/command');
}

function print () {
  var args = Array.prototype.slice.apply(arguments);
  process.stdout.write(args.join(' ') + '\n');
}
