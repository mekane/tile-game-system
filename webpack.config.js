const path = require('path');

/**
 const viewBundle = {
    entry: './view/browserView/index.js',
    devtool: 'eval-cheap-source-map',
    mode: 'development',
    target: 'web',
    experiments: {
        outputModule: true,
    },
    output: {
        filename: 'view.bundle.js',
        path: path.resolve(__dirname, 'build'),
        library: {
            type: 'window',
            name: 'View'
        }
    }
} */

const viewBundle = {
    entry: './view/browserView/index.js',
    devtool: 'eval-cheap-source-map',
    mode: 'development',
    target: 'web',
    experiments: {
        outputModule: true,
    },
    output: {
        library: {
            type: 'module',
        },
        filename: 'view.bundle.js',
        path: path.resolve(__dirname, 'build')
    }
}

const gameBundle = {
    entry: {
        browserApp: './games/browserGame/inBrowserApp.js',
    },
    devtool: 'eval-cheap-source-map',
    mode: 'development',
    target: 'web',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build')
    }
}

module.exports = [viewBundle, gameBundle];
