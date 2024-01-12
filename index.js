const t = require("@babel/types");

function callOptimizer(path, functionName, test) {
    if (t.isCallExpression(test)) {
      const callee = test.callee;
      if (t.isIdentifier(callee) && (callee.name === functionName)) {
        const consequent = path.node.consequent;
        const alternate = path.node.alternate; // 判断当前节点是否有else分支
        if (callee.name === functionName) {
          // 如果else分支是else if语句，就用else if语句替换当前节点
          if (t.isIfStatement(alternate)) {
            path.replaceWith(alternate);
          } else {
            // 否则，就用consequent替换当前节点
            path.replaceWith(consequent);
            // 如果没有else分支，就删除当前节点
            if (!alternate) {
              path.remove()
            }
          }
        } else {
          // 如果else分支是else if语句，就用else if语句替换当前节点
          if (t.isIfStatement(alternate)) {
            path.replaceWith(alternate);
          } else {
            // 否则，就用alternate替换当前节点
            path.replaceWith(alternate);
            // 如果没有else分支，就删除当前节点
            if (!alternate) {
              path.remove();
            }
          }
        }
      }
    } else if (t.isLogicalExpression(test) && test.operator === '&&') {
      // 如果条件表达式是一个逻辑表达式，并且运算符是&&，就获取它的左右子表达式，并分别对它们调用callOptimizer函数
      callOptimizer(path, functionName, test.left);
      callOptimizer(path, functionName, test.right);
    }
  }
  

function optimizerPlugin(env) {
  return {
    visitor: {
      IfStatement(path) {
        if (env && env.removeCall) {
          // 调用callOptimizer函数时，传递path.node.test作为第三个参数
          callOptimizer(path, env.removeCall, path.node.test)
        }
      }
    }
  }
}

module.exports = {
  optimizerPlugin
}
