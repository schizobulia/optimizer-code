const { transform } = require("@babel/core");
const { optimizerPlugin } = require("../index");
const assert = require("assert");
const { getMd5 } = require("./tool");

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
    
    assert.strictEqual(getMd5(resultIos.code), '305b9afb60d5015ff94c09e9caf401aeb25fe831ad312f1f6c0022a45d4d21c9')

    const resultAndroid = transform(code, {
        plugins: [optimizerPlugin({
          removeCall: 'isIos'
        })]
    });
    assert.strictEqual(getMd5(resultAndroid.code), 'b4bda5c9b77228ec8437d5710147e10564d601199596b9feafd1cb796e8cdaec')
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
      console.log("This is not android");
    }
    `;
    const resultIos = transform(code, {
      plugins: [optimizerPlugin({
        removeCall: 'isAndroid'
      })]
    });
    assert.strictEqual(getMd5(resultIos.code), '9c0b402f0633464a99e783cfbc8b8b4465162cd1091fe601a681294575fff9c4')

    const resultAndroid = transform(code, {
        plugins: [optimizerPlugin({
          removeCall: 'isIos'
        })]
    });
    assert.strictEqual(getMd5(resultAndroid.code), 'b55309b1f0a613290b9b2279cdf23ec9d21bbc4d2131e19b9f70b90720e6a35f')
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
  assert.strictEqual(getMd5(resultIos.code), 'ad153bf711b1300e9b6fcf9f9d7ba0000922262fc4252aab3ef1637cf4268ea1')

  const resultAndroid = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isIos'
    })]
  });
  assert.strictEqual(getMd5(resultAndroid.code), '7022a8468f75dbc2a08915251744bf0d6512cf8f18734d87902c43230c91a8d9')
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
  assert.strictEqual(getMd5(resultIos.code), '9a493f4b947e0a58158a8b975b38e01617c7ddcd88218a0306c4fbef12e18fe4')

  const resultAndroid = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isIos'
    })]
  });
  assert.strictEqual(getMd5(resultAndroid.code), '1907159675e0a57bf6b05cd75af25246b9320369ec3b271b379d10b0560c8834')
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
  assert.strictEqual(getMd5(resultIos.code), 'c47f97755b14a455174cf8cc6fb71f835648ba24d083942dff58515873344472')

  const resultAndroid = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isIos'
    })]
  });
  assert.strictEqual(getMd5(resultAndroid.code), 'bb3e2aba929d2f7b1236d3c33d4685e4b00714caf8c521be79017b07c232ea02')
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

  assert.strictEqual(getMd5(result.code), '6de7b7442fb931b361ed0b20f1d6d1d78d596102d99cb6d4f3b51f93ef893717')

  const resultAndroid = transform(code, {
    plugins: [optimizerPlugin({
      removeCall: 'isIos'
    })]
  });

  assert.strictEqual(getMd5(resultAndroid.code), '0f36e767d355d04e0d3b965f7494b48a4e1a91ba6c87d65897ea7c6bbbc5199b')
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
  assert.strictEqual(getMd5(resultIos.code), 'cf0e2b9ccc07d087722124c6f0ba4199c22d7a0cef8da4281aa305c006f9e57a')
}

test_1()

test_2()

test_3()

test_4()

test_5()

test_6()

test_7()