const { transform } = require("@babel/core");
const crypto = require('crypto');
const { optimizerPlugin } = require("../index");
const assert = require("assert");

function getMd5(code) {
    const hash = crypto.createHash('md5')
    hash.update(code)
    const md5Value = hash.digest('hex')
    return md5Value
}

function test_1() {
    const code = `
    if (isIos()) {
      console.log("This is ios");
    } else {
      console.log("This is not ios");
    }
    
    if (isAndroid()) {
      console.log("This is android");
    } else {
      console.log("This is not android");
    }
    `;
    const resultIos = transform(code, {
      plugins: [optimizerPlugin({
        removeCall: 'isAndroid'
      })]
    });
    assert.strictEqual(getMd5(resultIos.code), 'b55e99cc134172a4d051197b83e83c3d')

    const resultAndroid = transform(code, {
        plugins: [optimizerPlugin({
          removeCall: 'isIos'
        })]
    });
    assert.strictEqual(getMd5(resultAndroid.code), '8694d61d038de16761feaa77e1670b33')
}

function test_2() {
    const code = `
    if (isIos(1, 789)) {
      console.log("This is ios");
    } else {
      console.log("This is not ios");
    }
    
    if (isAndroid(2, 456)) {
      console.log("This is android");
    } else {
      const a = 1 + 2;
      console.log("This is not android");
    }
    `;
    const resultIos = transform(code, {
      plugins: [optimizerPlugin({
        removeCall: 'isAndroid'
      })]
    });
    assert.strictEqual(getMd5(resultIos.code), 'aab44e8da050d37d083044301a3e62e3')

    const resultAndroid = transform(code, {
        plugins: [optimizerPlugin({
          removeCall: 'isIos'
        })]
    });
    assert.strictEqual(getMd5(resultAndroid.code), 'af51a16e0933c66e01360a6f1adaaf05')
}


function test_3() {
  const code = `
  if (isIos(1, 789)) {
    console.log("This is ios");
  }
  
  if (isAndroid()) {
    console.log("This is android");
  }
  `;

  const resultIos = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isAndroid'
    })]
  });
  assert.strictEqual(getMd5(resultIos.code), '5ae80b6f19a81c2555ede82808d0ed00')

  const resultAndroid = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isIos'
    })]
  });
  assert.strictEqual(getMd5(resultAndroid.code), '2ac4bff620829c73628cc62049c41c4b')
}

function test_4() {
  const code = `
  if (isIos(1, 789) && true) {
    console.log("This is ios");
  }
  
  if (isAndroid() && true) {
    console.log("This is android");
  }
  `;

  const resultIos = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isAndroid'
    })]
  });
  assert.strictEqual(getMd5(resultIos.code), '411b43464eb19d734a53942b7fd3dd22')

  const resultAndroid = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isIos'
    })]
  });
  assert.strictEqual(getMd5(resultAndroid.code), '3bf3a38d5a4170162fe25f0ebe1353f3')
}

function test_5() {
  const code = `
  if (isIos(1, 789) && true) {
    console.log("This is ios");
  } else {
    console.log("This is not ios");
  }
  
  if (isAndroid() && true) {
    console.log("This is android");
  } else {
    console.log("This is not android");
  }
  `;

  const resultIos = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isAndroid'
    })]
  });
  assert.strictEqual(getMd5(resultIos.code), '4faacb46ba4e08a1170c990fd40f0470')

  const resultAndroid = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isIos'
    })]
  });
  assert.strictEqual(getMd5(resultAndroid.code), 'f721149a177b540b2f18d84ec706c329')
}

function test_6() {
  const code = `
  if (isIos(1, 789) && true && false) {
    console.log("This is ios");
  } else {
    console.log("This is not ios");
  }
  
  if (isAndroid() && get() || test()) {
    console.log("This is android");
  } else {
    console.log("This is not android");
  }
  `;

  const result = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isAndroid'
    })]
  });
  assert.strictEqual(getMd5(result.code), '77c2cbdae9a7231ba7200c16fba698bf')

  const resultAndroid = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isIos'
    })]
  });
  assert.strictEqual(getMd5(resultAndroid.code), '6b188a4a309e4a389e5ad439e66a8409')
}

function test_7() {
  const code = `
  if (isAndroid()) {
    console.log("This is android");
  } else if(a1()) {
    console.log("This is a1");
  } else {
    console.log("This is not test");
  }
  `;
  const resultIos = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isAndroid'
    })]
  });
  assert.strictEqual(getMd5(resultIos.code), '74100397d593746ea5869dc456fa58b3')
}

test_1()

test_2()

test_3()

test_4()

test_5()

test_6()

test_7()