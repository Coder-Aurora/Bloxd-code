/* ----- Function Interface ----- */
var txt = {
    local: (playerId, ...msg) => {
        api.sendMessage(playerId, [
            { icon: "fa-solid fa-gear", style: { color: "#ff99cc", fontSize: "9px" } },
            { str: " [ ", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: "PRIVATE", style: { color: "#6c5ce7", fontWeight: "600", fontStyle: "italic" } },
            { str: " ]", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: ": ", style: { color: "#4facfe", fontWeight: "400", fontStyle: "normal" } },
            { str: msg.join(", "), style: { color: "#9d8cff", fontWeight: "500", fontStyle: "italic" } },
        ]);
    },

    global: (...msg) => {
        api.broadcastMessage([
            { icon: "fa-solid fa-user-astronaut", style: { color: "#ff99cc", fontSize: "9px" } },
            { str: " [ ", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: "GLOBAL", style: { color: "#b19cd9", fontWeight: "600", fontStyle: "italic" } },
            { str: " ]", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: ": ", style: { color: "#4facfe", fontWeight: "400", fontStyle: "normal" } },
            { str: msg.join(", "), style: { color: "#9d8cff", fontWeight: "500", fontStyle: "italic" } },
        ]);
    },

    local_warn: (playerId, ...msg) => {
        api.sendMessage(playerId, [
            { icon: "fa-solid fa-triangle-exclamation", style: { color: "#ff99cc", fontSize: "9px" } },
            { str: " [ ", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: "PRIVATE_WARN", style: { color: "#ff6eb4", fontWeight: "700", fontStyle: "italic" } },
            { str: " ]", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: ": ", style: { color: "#4facfe", fontWeight: "400", fontStyle: "normal" } },
            { str: msg.join(", "), style: { color: "#ed5f5f", fontWeight: "700", fontStyle: "italic" } },
        ]);
    },

    global_warn: (...msg) => {
        api.broadcastMessage([
            { icon: "fa-solid fa-user-unlock", style: { color: "#ff99cc", fontSize: "9px" } },
            { str: " [ ", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: "GLOBAL_ALERT", style: { color: "#ff6eb4", fontWeight: "700", fontStyle: "italic" } },
            { str: " ]", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: ": ", style: { color: "#4facfe", fontWeight: "400", fontStyle: "normal" } },
            { str: msg.join(", "), style: { color: "#ed5f5f", fontWeight: "700", fontStyle: "italic" } },
        ]);
    }
};

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

var builderHelper = {
    line: (pos1, pos2, blockType = "White Wool") => {
        const [x1, y1, z1] = pos1;
        const [x2, y2, z2] = pos2;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;

        const maxStep = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
        if (maxStep === 0) {
            api.setBlock(x1, y1, z1, blockType);
            return;
        }

        let i = 0;
        const loopId = async.setIntervalLoop(() => {
            const curX = Math.round(x1 + (dx * i) / maxStep);
            const curY = Math.round(y1 + (dy * i) / maxStep);
            const curZ = Math.round(z1 + (dz * i) / maxStep);
            api.setBlock(curX, curY, curZ, blockType);

            i++;
            if (i > maxStep) {
                async.clearIntervalLoop(loopId);
            }
        }, 10);
    },

    sphere: (center, radius, blockName = "Black Glass", isHollow = true, perTick = 6000, delay = 200) => {
        const [cx, cy, cz] = center;
        const rSq = radius * radius;
        const side = 2 * radius + 1;
        const totalCells = side * side * side;

        let index = 0;
        let placed = 0;

        const loopId = async.setIntervalLoop(() => {
            let batch = 0;
            while (batch < perTick && index < totalCells) {
                const dz = (index % side) - radius;
                const dy = (Math.floor(index / side) % side) - radius;
                const dx = (Math.floor(index / (side * side))) - radius;

                const distSq = dx * dx + dy * dy + dz * dz;
                let place = false;

                if (isHollow) {
                    const dist = Math.sqrt(distSq);
                    place = Math.abs(dist - radius) <= 0.5;
                } else {
                    place = distSq <= rSq;
                }

                if (place) {
                    api.setBlock(cx + dx, cy + dy, cz + dz, blockName);
                    placed++;
                }

                index++;
                batch++;
            }

            if (index >= totalCells) {
                async.clearIntervalLoop(loopId);
                txt.global(`Sphere generating complete, placed ${placed} blocks`);
            }
        }, delay);

        txt.global("Starting sphere generation...");
        return loopId;
    },

    ageBlocks: (pos1, pos2, blocks, targetBlocks = null, density = 0.4, interval = 100) => {
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
    },

    displace: (from, to) => {
        return [from[0] + to[0], from[1] + to[1], from[2] + to[2]];
    },
};


/* ----- Functions ----- */
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


/* ----- World Callbacks ----- */
tick = () => {
    processQueue();
};
