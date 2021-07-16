import _ from 'lodash';

// Calculates every tile currently visible onscreen based on current player coordinates
const calculateVisitedTiles = (coordinates) => {
  const {x, y} = coordinates;
  const horizontalTileCount = 64;
  const currentRow = y - 30;
  const currentCol = x;
  const currentTileNumber = currentRow * horizontalTileCount + currentCol;
  
  // This gets us part of the way there...this gives us a vertical slice of the visible onscreen tiles
  const yAxisExploredTiles = _.range(currentTileNumber - 7 * horizontalTileCount, currentTileNumber + 7 * horizontalTileCount, horizontalTileCount);
  
  // Fill in the rest of the visible grid
  return _.reduce(yAxisExploredTiles, (accum, tileNumber) => {
    accum = _.union(accum, _.range(tileNumber - 8, tileNumber + 7)); // fills in the rest of the x axis tiles m...easy so far
    accum = _.filter(accum, tileNumber => {
      // Prevent wrapping to the other side of the screen using link's current position
      const tileRow = Math.floor(tileNumber / horizontalTileCount);
      const tileCol = tileNumber - tileRow * horizontalTileCount;
      return tileCol <= currentCol + 7 && tileCol >= currentCol - 8 && tileNumber >= 0;
    });
    return accum;
  }, []);
};

const convertCoordinatesToTileNumber = (coordinates) => {
  const {x, y} = coordinates;
  const horizontalTileCount = 64;
  const currentRow = y - 30;
  const currentCol = x;
  const tileNumber = currentRow * horizontalTileCount + currentCol;
  return tileNumber;
};

const validateCoordinates = (coordinates) => {
  const {x, y} = coordinates;
  
  if (x !== undefined && y !== undefined) {
    return y > 29 && y < 150 && x > -1 && x < 64;
  } else if (x !== undefined) {
    return x > -1 && x < 64;
  } else if (y !== undefined) {
    return y > 29 && y < 150;
  } else {
    return false;
  }
};

export {calculateVisitedTiles, convertCoordinatesToTileNumber, validateCoordinates};
