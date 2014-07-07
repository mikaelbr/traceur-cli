'use strict';

var vm = require('vm');
var util = require('util');
var fs = require('fs');
var traceur = require('traceur');

var argv = process.argv;

var isRepl = argv.length < 3;

var script = argv[3];
var isEval = (argv[2] === '-e' || argv[2] === '--eval') && script;

var file = argv[2];
var isFile = argv.length === 3 && file.indexOf('.js') !== -1;

var traceurRepl = require('./repl');
if (isRepl) {
  traceurRepl();
} else if (isEval || isFile) {
  var compiled = getCompiledOnEval();
  var script = vm.createScript(compiled.js, file ? file : void 0);

  var result = script.runInNewContext({
    console: {
      log: print,
      error: print,
      dir: print
    },
    require: function (file) {
      return traceur.require(file + (file.indexOf('.js') === -1 ? '.js' : ''));
    }
  });

  if (typeof result === 'undefined' || result == null) {
    result = typeof result;
  }

  if (typeof result === 'object') {
    result = util.inspect(result);
  }

  if (!isFile) {
    print(result)
  }

  process.exit(1);
} else {
  // Redirect to original traceur project
  require('traceur/src/node/command');
}

function getCompiledOnEval() {
  if (!isFile) {
    return traceur.compile(script);
  }
  var contents = getFileContents(file);
  var compiled = traceur.compile(contents, {
    modules: 'commonjs',
    filename: file
  });

  traceur.require.makeDefault(function(filename) {
    // don't transpile our dependencies, just our app
    return filename.indexOf('node_modules') === -1;
  });

  return compiled;
}

function getFileContents (file) {
  var stats = fs.statSync(file);
  if (!stats || !stats.isFile()) return;
  return fs.readFileSync(file, 'utf8');
}

function print () {
  var args = Array.prototype.slice.apply(arguments);
  process.stdout.write(args.join(' ') + '\n');
}