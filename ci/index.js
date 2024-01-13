const { optimizerPlugin } = require('../index');
const { transform } = require("@babel/core");
const path = require('path');
const fs = require('fs-extra');

const env = {
    removeCall: process.env.removeCall
};

async function main(srcDir, destDir) {
    const files = await fs.readdir(srcDir, { withFileTypes: true });

    if (!fs.existsSync(srcDir)) {
        throw new Error(`Source directory ${srcDir} does not exist`);
    }
    if (!fs.existsSync(destDir)) {
        throw new Error(`Destination directory ${destDir} does not exist`);
    }

    for (const file of files) {
        if (file.isDirectory()) {
            await main(path.join(srcDir, file.name), path.join(destDir, file.name));
        } else if (path.extname(file.name) === '.js') {
            const code = await fs.readFile(path.join(srcDir, file.name), 'utf-8');
            const result = transform(code, {
                plugins: [optimizerPlugin({
                    removeCall: env.removeCall
                })]
            });
            await fs.outputFile(path.join(destDir, file.name), result.code);
        } else {
            await fs.copy(path.join(srcDir, file.name), path.join(destDir, file.name));
        }
    }
}

main(process.argv[2], process.argv[3]).catch(console.error);
