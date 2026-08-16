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

const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;

const hash2D = (x, y, seed = 0) => {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return value - Math.floor(value);
};

const smoothNoise2D = (x, y, seed = 0) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const xf = x - x0;
    const yf = y - y0;

    const u = fade(xf);
    const v = fade(yf);

    const n00 = hash2D(x0, y0, seed);
    const n10 = hash2D(x0 + 1, y0, seed);
    const n01 = hash2D(x0, y0 + 1, seed);
    const n11 = hash2D(x0 + 1, y0 + 1, seed);

    const nx0 = lerp(n00, n10, u);
    const nx1 = lerp(n01, n11, u);
    return lerp(nx0, nx1, v);
};

const perlinNoise2D = (x, y, seed = 0) => {
    let total = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let max = 0;

    for (let octave = 0; octave < 4; octave++) {
        total += smoothNoise2D(x * frequency, y * frequency, seed + octave * 17) * amplitude;
        max += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
    }

    return total / max;
};

/**
 * @param {number[]} pos1                  - 区域起点 [x, y, z]
 * @param {number[]} pos2                  - 区域终点 [x, y, z]
 * @param {string[]} blocks                - 候选方块列表，随机选取进行替换
 * @param {string[]} [targetBlocks = null] - 仅替换这些方块，传 null 表示不限制
 * @param {number}   [density = 0.4]       - 基础替换密度，取值范围 0 ~ 1
 * @param {number}   [interval = 100]      - 每批处理的间隔时间(ms)
 * @param {number}   [seed = 0]            - 噪声随机种子，用于生成稳定的噪声分布
 * @param {number}   [noiseScale = 0.01]   - 噪声缩放比例，越小越平滑，越大越密集/碎片化
 * @returns {{ stop: Function, getReplaced: Function }}
 */
var ageBlocksWithPerlinNoise = (pos1, pos2, blocks, targetBlocks = null,
    density = 0.4, cubeLength = 20, interval = 100, seed = 0, noiseScale = 0.01) => {
    const [minX, minY, minZ] = [
        Math.min(pos1[0], pos2[0]),
        Math.min(pos1[1], pos2[1]),
        Math.min(pos1[2], pos2[2]),
    ];
    const [maxX, maxY, maxZ] = [
        Math.max(pos1[0], pos2[0]),
        Math.max(pos1[1], pos2[1]),
        Math.max(pos1[2], pos2[2]),
    ];

    let active = true;
    let x = minX;
    let z = minZ;
    let replaced = 0;

    const timerId = async.setIntervalLoop(() => {
        if (!active) return;

        for (let dx = 0; dx < cubeLength; dx++) {
            const currentX = x + dx;
            if (currentX > maxX) continue;

            for (let dz = 0; dz < cubeLength; dz++) {
                const currentZ = z + dz;
                if (currentZ > maxZ) continue;

                const noiseValue = perlinNoise2D(currentX * noiseScale, currentZ * noiseScale, seed);
                const localDensity = Math.max(0, Math.min(1, density * (0.35 + noiseValue * 0.65)));

                for (let y = minY; y <= maxY; y++) {
                    if (targetBlocks && !targetBlocks.includes(api.getBlock(currentX, y, currentZ))) continue;

                    if (Math.random() < localDensity) {
                        const block = blocks[Math.floor(Math.random() * blocks.length)];
                        api.setBlock(currentX, y, currentZ, block);
                        replaced++;
                    }
                }
            }
        }

        x += cubeLength;
        if (x > maxX) {
            x = minX;
            z += cubeLength;
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


/* ----- World Callback ----- */
tick = (ms) => {
    processQueue();
};


/*
 Example:

 const { stop, replaced } = ageBlocksWithPerlinNoise(
    [8407, 20, -8241],
    [8260, 20, -8113],
    ["Purple Neon", "Purple Portal", "Purple Planks", "Purple Wool", "Purple Concrete", "Purple Baked Clay"],
    null,
    0.8,
    80,
    123,
    0.015,
);
*/
