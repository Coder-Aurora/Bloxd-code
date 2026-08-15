/* ----- Definitions ----- */
const FIRE_INTERVAL_MS = 300;
const activeLoops = new Map();

/* ----- Function Interface ----- */
const delayMap = new Map();
const loopMap = new Map();
let delayCounter = 0;
let loopCounter = 0;

var async = {
    setTimeout: (callback, ms) => {
        const id = ++delayCounter;
        delayMap.set(id, {
            fireAt: Date.now() + ms,
            callback
        });
        return id;
    },

    cancelExecution: (callbackId) => delayMap.delete(callbackId),

    setIntervalLoop: (callback, intervalMs = 100) => {
        const loopId = ++loopCounter;

        const scheduleNext = () => {
            const delayId = async.setTimeout(() => {
                if (!loopMap.has(loopId)) return;

                try {
                    callback();
                } catch (err) {
                    console.log(`Caught loop error: ${err}`);
                }

                if (loopMap.has(loopId)) {
                    scheduleNext();
                }
            }, intervalMs);

            const loopItem = loopMap.get(loopId);
            if (loopItem) loopItem.delayId = delayId;
        };

        loopMap.set(loopId, { interval: intervalMs, delayId: null });
        scheduleNext();

        return loopId;
    },

    clearIntervalLoop: (loopId) => {
        const loopItem = loopMap.get(loopId);
        if (!loopItem) return false;

        if (loopItem.delayId) {
            async.cancelExecution(loopItem.delayId);
        }
        loopMap.delete(loopId);

        return true;
    }
};

const processQueue = () => {
    const now = Date.now();

    for (const [id, item] of delayMap) {
        if (now >= item.fireAt) {
            delayMap.delete(id);
            try {
                item.callback();
            } catch (err) {
                console.log(`Caught error: ${err}`);
            }
        }
    }
};

/* ----- Functions ----- */
const fireFireball = (playerId) => {
    const info = api.getPlayerFacingInfo(playerId);
    if (!info) return null;

    const [cx, cy, cz] = info.camPos;
    const [dx, dy, dz] = info.dir;

    const spawnPos = [
        cx + dx * 0.8,
        cy + dy * 0.8,
        cz + dz * 0.8
    ];

    const throwableId = api.attemptCreateThrowable(playerId, "Fireball", spawnPos, [dx, dy, dz]);

    return throwableId;
};

const deleteLoop = (playerId) => {
    const identifier = `${playerId}`;
    const loopId = activeLoops.get(identifier);
    if (loopId) {
        async.clearIntervalLoop(loopId);
        activeLoops.delete(identifier);
    }
};


/* ----- Callbacks ----- */
tick = (ms) => {
    processQueue();
};

onPlayerClick = (playerId, wasAltClick, x, y, z, block, targetEId) => {
    const identifier = `${playerId}`;
    if (activeLoops.has(identifier)) return;

    const firstId = fireFireball(playerId);

    const loopId = async.setIntervalLoop(() => {
        const throwableId = fireFireball(playerId);
    }, FIRE_INTERVAL_MS);

    activeLoops.set(identifier, loopId);
};

onPlayerClickUp = (playerId, wasAltClick, x, y, z, block, targetEId) => {
    deleteLoop(playerId);
};

onWorldChangeBlock = (x, y, z, from, to, initiatorDbId, extraInfo) => {
    if (extraInfo?.cause === "Explosion") {
        return "preventDrop";
    }
};

onPlayerLeave = (playerId) => {
    deleteLoop(playerId);
};
