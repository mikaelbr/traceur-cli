'use strict';

var vm = require('vm');
var util = require('util');
var fs = require('fs');
var traceur = require('traceur');

var argv = process.argv;

var isRepl = argv.length < 3;

var script = argv[3];
var isEval = (argv[2] === "-e" || argv[2] === "--eval") && script;

var file = argv[2];
var isFile = argv.length === 3 && file.indexOf('.js') !== -1;

var traceurRepl = require('./repl');
if (isRepl) {
  traceurRepl();
} else if (isEval || isFile) {
  if (isFile) script = getFileContents(file);
  var compiled = traceur.compile(script);
  var result = vm.runInNewContext(compiled.js, {
    console: {
      log: print,
      error: print,
      dir: print
    }
  });

  if (typeof result === "undefined" || result == null) {
    result = typeof result;
  }

  if (typeof result === "object") {
    result = util.inspect(result);
  }

  print(result);
  process.exit(1);
} else {
  // Redirect to original traceur project
  require('traceur/src/node/command');
}

function getFileContents (file) {
  var stats = fs.statSync(file);
  if (!stats || !stats.isFile()) return;
  return fs.readFileSync(file, 'utf8');
}

function print (e) {
  process.stdout.write(e + "\n");
}