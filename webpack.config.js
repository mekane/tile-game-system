const path = require('path');

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
        path: path.resolve(__dirname, 'test', 'view')
    }
}

const gamesBundles = {
    entry: {
        heroGame: './games/heroGame/heroGame.js',
        spaceshipGame: './games/spaceshipGame/spaceshipGame.js',
        woodlandsGame: './games/woodlandsGame/woodlandsGame.js'
    },
    devtool: 'eval-cheap-source-map',
    mode: 'development',
    target: 'web',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build')
    }
}

module.exports = [viewBundle, gamesBundles];
