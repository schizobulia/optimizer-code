const t = require("@babel/types");

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

module.exports = callOptimizer