/* ----- definition ----- */
const config = {
    adventureRects: [],
};

const playerTempInfo = new Map();


/* ----- function ----- */
const isInAdventureRect = (x, y, z) => {
    const rects = config.adventureRects;
    if (!rects || rects.length === 0) return false;

    return rects.some(([start, end]) => {
        if (!Array.isArray(start) || !Array.isArray(end)
            || start.length !== 3 || end.length !== 3) return false;

        return api.isInsideRect([x, y, z], start, end, true);
    });
};

const changeTempInfo = (playerId, key, value) => {
    const tempInfo = playerTempInfo.get(playerId) || {};
    tempInfo[key] = value;
    playerTempInfo.set(playerId, tempInfo);
};

/* ----- world callback ----- */
onPlayerJoin = (playerId, fromReset) => {
    playerTempInfo.set(playerId, { inAdventureRect: false });
};

onBlockStandStart = (playerId, x, y, z, blockName) => {
    const standInfo = playerTempInfo.get(playerId);
    if (!standInfo) return;

    if (isInAdventureRect(x, y, z)) {
        api.setPlayerGamemode(playerId, "survivaladventure");
        changeTempInfo(playerId, "inAdventureRect", true);
    } else {
        if (standInfo.inAdventureRect === false) return;
        api.setPlayerGamemode(playerId, "survival");
        changeTempInfo(playerId, "inAdventureRect", false);
    }
};

onPlayerLeave = (playerId, isShuttingDown) => {
    if (playerTempInfo.has(playerId)) {
        playerTempInfo.delete(playerId);
    }
};
