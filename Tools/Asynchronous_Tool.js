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

tick = () => {
    processQueue();
};
