/* ----- function interface ----- */
const delayMap = new Map();
const loopMap = new Map();
let delayCounter = 0;
let loopCounter = 0;

var async = {
    setTimeout: (callback, ms) => {
        const id = ++delayCounter;
        delayMap.set(id, {
            fireAt: Date.now() + Math.max(0, ms),
            callback
        });
        return id;
    },

    cancelExecution: (callbackId) => {
        delayMap.delete(callbackId);
    },

    setIntervalLoop: (callback, intervalMs = 100) => {
        const loopId = ++loopCounter;
        const loopItem = {
            interval: Math.max(1, intervalMs),
            delayId: null,
            active: true,
        };
        loopMap.set(loopId, loopItem);

        const scheduleNext = () => {
            if (!loopItem.active) return;

            loopItem.delayId = async.setTimeout(() => {
                if (!loopItem.active) return;

                try {
                    callback();
                } catch (err) {
                    console.log(`Caught loop error: ${err}`);
                }

                if (loopItem.active) {
                    scheduleNext();
                }
            }, loopItem.interval);
        };

        scheduleNext();
        return loopId;
    },

    clearIntervalLoop: (loopId) => {
        const loopItem = loopMap.get(loopId);
        if (!loopItem) return false;

        loopItem.active = false;
        if (loopItem.delayId != null) {
            async.cancelExecution(loopItem.delayId);
        }
        loopMap.delete(loopId);

        return true;
    }
};


/* ----- function ----- */
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

/**
 * 在指定区域内逐步替换方块
 * 
 * @param {number[]} pos1                  - 区域起点 [x, y, z]
 * @param {number[]} pos2                  - 区域终点 [x, y, z]
 * @param {string[]} blocks                - 做旧方块列表，随机选取
 * @param {string[]} [targetBlocks = null] - 目标方块列表，只有这些方块会被替换
 * @param {number}   [density = 0.4]       - 密集度 0~1，每个格子被替换的概率
 * @param {number}   [interval = 100]      - 每次处理的间隔(ms)
 * @returns {{ stop: Function }}           - 调用 .stop() 可提前中断
 */
var ageBlocks = (pos1, pos2, blocks, targetBlocks = null, density = 0.4, interval = 100) => {
    const [minX, minY, minZ] =
        [Math.min(pos1[0], pos2[0]), Math.min(pos1[1], pos2[1]), Math.min(pos1[2], pos2[2])];
    const [maxX, maxY, maxZ] =
        [Math.max(pos1[0], pos2[0]), Math.max(pos1[1], pos2[1]), Math.max(pos1[2], pos2[2])];

    let active = true;
    let x = minX;
    let z = minZ;
    let replaced = 0;

    const timerId = async.setIntervalLoop(() => {
        if (!active) return;

        for (let dx = 0; dx < 5; dx++) {
            const currentX = x + dx;
            if (currentX > maxX) continue;

            for (let dz = 0; dz < 5; dz++) {
                const currentZ = z + dz;
                if (currentZ > maxZ) continue;

                for (let y = minY; y <= maxY; y++) {
                    if (targetBlocks && !targetBlocks.includes(api.getBlock(currentX, y, currentZ))) continue;

                    if (Math.random() < density) {
                        const block = blocks[Math.floor(Math.random() * blocks.length)];
                        api.setBlock(currentX, y, currentZ, block);
                        replaced++;
                    }
                }
            }
        }

        x += 5;
        if (x > maxX) {
            x = minX;
            z += 5;
        }

        if (z > maxZ) {
            active = false;
            async.clearIntervalLoop(timerId);
        }
    }, interval);

    return {
        stop: () => {
            active = false;
            return async.clearIntervalLoop(timerId);
        },
        getReplaced: () => replaced,
    };
};


/* ----- world callback ----- */
tick = () => {
    processQueue();
};


/*
 * examples:
 *
 * ageBlocks([], [],
 *     ["Purple Neon", "Purple Portal", "Purple Planks", "Purple Wool", "Purple Concrete", "Purple Baked Clay"],
 *     null, 1, 50);
 * 
 * ageBlocks([], [], ["Green Concrete", "Green Baked Clay"], ["Grass Block"], 0.6, 50);
*/
