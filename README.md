## optimizerPlugin
optimizerPlugin是一个Babel插件，用于通过静态分析的方法优化代码。主要是ChatGPT写代码和文档，我负责编写测试用例和校验代码效果是否符合预期。目前会持续更新...

## 安装
你可以使用npm或yarn来安装这个插件：
```bash
npm install --save-dev optimizer-plugin
# or
yarn add --dev optimizer-plugin
```

## 使用
你可以在你的.babelrc文件中配置这个插件，指定你想要删除的函数名，例如：
```json
{
  "plugins": [
    ["optimizer-plugin", { "removeCall": "isAndroid" }]
  ]
}
```

这样，你的源代码中所有调用isAndroid函数的地方，以及相关的if语句，都会被删除或替换。

你也可以在你的代码中使用注释来指定你想要删除的函数名，例如：
```javascript
// @removeCall isIos
if (isIos()) {
  console.log("This is ios");
} else {
  console.log("This is not ios");
}
//会被修改为
{
  console.log("This is not ios");
}
```
```javascript
// @removeCall isIos
if (isAndroid()) {
  console.log("This is android");
} else if(a1()) {
  console.log("This is a1");
} else {
  console.log("This is not test");
}
//会被修改为
if (a1()) {
  console.log("This is a1");
} else {
  console.log("This is not test");
}
//如果是包含 || 的就不会被处理
if (isIos(1, 789) || true && false) {
  console.log("This is ios");
} else {
  console.log("This is not ios");
}
```

这样，你的源代码中只有这个if语句会被删除或替换，其他地方的isIos函数调用不会受到影响。

## 功能
这个插件可以处理以下几种情况：

如果if语句的条件表达式是一个函数调用，且函数名与removeCall参数相同，那么就用if语句的then分支或else分支替换当前节点，取决于函数名是否与removeCall参数相同

持续更新中...