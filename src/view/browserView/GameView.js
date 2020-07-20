const h = require('snabbdom/h').default;
const {TileView, TILE_SIZE} = require('./TileView');

function GameView(viewData) {
    const rowWidth = viewData.tiles[0].length; //TODO: compute this better and include in board state

    const tiles = viewData.tiles.flatMap(makeTileViews);

    const style = {
        gridTemplateColumns: `repeat(${rowWidth}, ${TILE_SIZE}px)`
    };

    viewData.state.units.forEach(unitData => {
        const element = `div.unit.${unitData.name}`;
        const unitView = h(element, {}, unitData.name);
        console.log(unitData);

        const tileNumber = getTileNumber(unitData.positionX, unitData.positionY);
        tiles[tileNumber].children.push(unitView);
    });

    return h('div.game', {style}, tiles);

    function getTileNumber(x, y) {
        return y * rowWidth + x;
    }
}

function makeTileViews(row, rowNumber) {
    return row.map((tile, tileNumber) => TileView(tile, tileNumber, rowNumber));
}

module.exports = {
    GameView
}

