const {BrowserView} = require('./view/browserView');
const LocalGameAdapter = require('./adapters/LocalGame');

const main = document.querySelector('#main');

BrowserView(main, LocalGameAdapter());
