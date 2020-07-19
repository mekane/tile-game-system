const path = require('path');

const viewBundles = {
    entry: {
        browserApp: './src/browserGame/inBrowserApp.js',
    },
    mode: 'development',
    target: 'web',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build')
    }
}

module.exports = [viewBundles];
