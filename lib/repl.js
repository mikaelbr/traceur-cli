var repl = require('repl');
var vm = require('vm');
var traceur = require('traceur');

var inherits = require('util').inherits;

traceur.require.makeDefault(unlessExternalDependency);

var options = {
  prompt: 'traceur> ',
  input: process.stdin,
  output: process.stdout,
  useGlobal: true,
  eval: function(block, context, filename, cb) {
    var compiled = traceur.compile(clean(block), {
      modules: 'commonjs',
      filename: filename,
      experimental: true
    });
    if (compiled.errors && compiled.errors.length) {
      defaultEval(block, context, filename, cb);
      return;
    }
    defaultEval(cleanOutput(compiled.js), context, filename, cb);
  }
}

module.exports = function () {
  return repl.start(options);
}

var clean = function (block) {
  if (!block || block.substring(0, 1) !== '(') {
    return block;
  }

  block = block.substring(1);
  return block.substring(0, block.length-2);
}

var cleanOutput = function (data) {
  if (!data) return data;
  return data.replace(/('|")use strict('|");\s*/, "");
};


// Code below this is taken from Node core
// Default eval function found at:
// https://github.com/joyent/node/blob/master/lib/repl.js


function defaultEval(code, context, file, cb) {
  var err, result;
  // first, create the Script object to check the syntax
  try {
    var script = vm.createScript(code, {
      filename: file,
      displayErrors: false
    });
  } catch (e) {
    if (isRecoverableError(e))
      err = new Recoverable(e);
    else
      err = e;
  }

  if (!err) {
    try {
      result = script.runInThisContext({ displayErrors: false });
    } catch (e) {
      err = e;
      if (err && process.domain) {
        process.domain.emit('error', err);
        process.domain.exit();
        return;
      }
    }
  }

  cb(err, result);
}


// If the error is that we've unexpectedly ended the input,
// then let the user try to recover by adding more input.
function isRecoverableError(e) {
  return e &&
      e.name === 'SyntaxError' &&
      /^(Unexpected end of input|Unexpected token :)/.test(e.message);
}

function Recoverable(err) {
  this.err = err;
}
inherits(Recoverable, SyntaxError);

function unlessExternalDependency (filename) {
  return filename.indexOf('node_modules') === -1;
}