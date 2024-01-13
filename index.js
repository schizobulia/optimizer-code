const callOptimizer = require("./src/callOptimizer")
const t = require("@babel/types")

let variables = {};

function trackVariable(path) {
  if (t.isVariableDeclarator(path.node)) {
    const id = path.node.id;
    const init = path.node.init;

    if (t.isIdentifier(id) && t.isNumericLiteral(init)) {
      variables[id.name] = init.value;
    }
  }
}


function optimizerPlugin(env) {
  return {
    visitor: {
      VariableDeclarator(path) {
        trackVariable(path);
      },
      IfStatement(path) {
        if (env && env.removeCall) {
          callOptimizer(path, env.removeCall, path.node.test);
        }
      }
    }
  }
}

module.exports = {
  optimizerPlugin
}
