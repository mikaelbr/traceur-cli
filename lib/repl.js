var repl = require('repl');
var vm = require('vm');
var traceur = require('traceur');

var options = {
  prompt: 'traceur> ',
  input: process.stdin,
  output: process.stdout,
  eval: function(block, context, filename, cb) {
    try {
      var compiled = traceur.compile(clean(block), { modules: false });
      if (compiled.errors && compiled.errors.length) {
        return cb(compiled.errors);
      }
      return cb(null, vm.runInContext(compiled.js, context));
    } catch (e) {
      cb(e);
    }
  }
}

module.exports = function () {
  return repl.start(options);
}


var clean = function (block) {
  if (!block) {
    return block;
  }

  block = block.substring(1);
  return block.substring(0, block.length-2);
}