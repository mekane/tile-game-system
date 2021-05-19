import {h} from 'snabbdom/h.js';
import {TileView, TILE_SIZE} from './TileView.js';
import {UnitView} from './UnitView.js';

export function BoardView({activeLineOfSight, tiles, state, lastUnitMove = {}}) {
    /*PROFILE*/
    window.profileGameView['BoardView']++;
    const units = state.units;

    const rowHeight = tiles.length; //TODO: include in board state
    const rowWidth = tiles[0].length; //TODO: compute this better and include in board state

    const tileViews = tiles.flatMap(makeTileViews);

    const style = {
        gridTemplateColumns: `repeat(${rowWidth}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${rowHeight}, ${TILE_SIZE}px)`,
        fontSize: `${TILE_SIZE / 4}px`
    };

    units.forEach(makeUnitView);

    return h('div.board', {style}, tileViews);


    function getTileNumber(x, y) {
        return y * rowWidth + x;
    }

    function makeUnitView(unitData, unitNumber) {
        const tileNumber = getTileNumber(unitData.positionX, unitData.positionY);
        const isActive = (unitNumber === state.activeUnit);
        const lastMove = lastUnitMove.unitIndex === unitNumber ? lastUnitMove.direction : '';
        const unitView = UnitView(unitData, unitNumber, isActive, TILE_SIZE, lastMove);

        const container = tileViews[tileNumber];
        if (container)
            container.children.push(unitView);
    }

    function makeTileViews(row, rowNumber) {
        return row.map((tile, tileNumber) => TileView(tile, tileNumber, rowNumber, activeLineOfSight));
    }
}
