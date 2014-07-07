'use strict';

var vm = require('vm');
var util = require('util');
var path = require('path');
var traceur = require('traceur');

var version = require(path.resolve(__dirname, '..', 'package.json')).version;

var argv = process.argv;

var isRepl = argv.length < 3;

var scriptString = argv[3];
var isEval = (argv[2] === '-e' || argv[2] === '--eval') && scriptString;
var isVersion = (argv[2] === '-v' || argv[2] === '--version');

var traceurRepl;

// Show repl if no arguments (also on pipe)
if (isRepl) {
  // if data on stdin it is piped to repl
  traceurRepl = require('./repl');
  traceurRepl();
}
// Show version info in addition to traceur version
else if (isVersion) {
  var System = require('traceur/src/node/System');
  var traceurVersion = System.version.split('@')[1];

  process.stdout.write(traceurVersion + ' (traceur-cli: ' + version + ')');
  process.exit(1);
}
// If given a text string to compile
else if (isEval) {
  var compiled = traceur.compile(scriptString, {
    filename: 'eval'
  });

  if (compiled.errors && compiled.errors.length) {
    process.stderr.write(compiled.errors.join('\n') + '\n');
    process.exit(0);
  }

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
