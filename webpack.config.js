const path = require('path');

const viewBundles = {
    entry: {
        browserApp: './src/inBrowserApp.js',
    },
    mode: 'development',
    target: 'web',
    output: {
        filename: '[name].bundle.js',
        //library: 'TileGame',
        path: path.resolve(__dirname, 'build')
    }
}

module.exports = [viewBundles];
