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

  var script = vm.createScript(compiled.js, {
    filename: "traceur-cli eval",
    displayErrors: true
  });

  // Send in faux context/sandbox
  var result = script.runInThisContext({ displayErrors: true });

  print(util.inspect(result, {
    colors: true
  }));

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
