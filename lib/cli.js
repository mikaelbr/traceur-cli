'use strict';

var vm = require('vm');
var util = require("util");

var argv = process.argv;

var isRepl = argv.length < 3;

var script = argv[3];
var isEval = (argv[2] === "-e" || argv[2] === "--eval") && script;

var traceurRepl = require('./repl');
if (isRepl) {
  traceurRepl();
} else if (isEval) {
  var result = vm.runInNewContext(script, {
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

function print (e) {
  process.stdout.write(e + "\n");
};