const t = require("@babel/types")


/**
 * 我的意思不是希望当isAndroid()返回false时，移除。而是babel在检测到if判断中存在isAndroid()的函数时就删除对应的if分支,
 * 留下else分支和else if分支。
 * @param {*} path 
 * @param {*} functionName 函数名称，比如isAndroid
 * @param {*} test 
 */
function callOptimizer(path, functionName, test) {
  if (t.isCallExpression(test)) {
    const callee = test.callee;
    if (t.isIdentifier(callee) && (callee.name === functionName)) {
      const alternate = path.node.alternate; // 判断当前节点是否有else分支
      // 如果else分支是else if语句，就用else if语句替换当前节点
      if (t.isIfStatement(alternate)) {
        path.replaceWith(alternate);
      } else if (alternate) {
        // 否则，如果有else分支，就用else分支替换当前节点
        path.replaceWith(alternate);
      } else {
        // 如果没有else分支，就删除当前节点
        path.remove();
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
          callOptimizer(path, env.removeCall, path.node.test);
        }
      },
      // 添加一个ConditionalExpression属性，来访问和转换三目运算符的节点
      ConditionalExpression(path) {
        if (env && env.removeCall) {
          const functionName = env.removeCall;
          const test = path.node.test; // 获取条件表达式的测试部分
          const consequent = path.node.consequent; // 获取条件表达式的真值部分
          const alternate = path.node.alternate; // 获取条件表达式的假值部分
          if (t.isCallExpression(test)) {
            const callee = test.callee;
            if (t.isIdentifier(callee) && (callee.name === functionName)) {
              // 如果测试部分是一个函数调用，并且函数名是functionName，就用假值部分替换当前节点
              path.replaceWith(alternate);
            }
          } else if (t.isLogicalExpression(test) && test.operator === '&&') {
            // 如果测试部分是一个逻辑表达式，并且运算符是&&，就获取它的左右子表达式，并分别对它们调用callOptimizer函数
            callOptimizer(path, functionName, test.left);
            callOptimizer(path, functionName, test.right);
          }
        }
      },
      SwitchStatement(path) {
        // 获取switch语句的所有case分支
        const cases = path.get("cases");
        // 遍历每个case分支
        for (let i = 0; i < cases.length; i++) {
          const casePath = cases[i];
          const testNode = casePath.get("test").node;
          if(t.isCallExpression(testNode) && testNode.callee && testNode.callee.name === env.removeCall) {
            casePath.remove();
          }
        }
      }
    }
  }
}

module.exports = {
  optimizerPlugin
}
