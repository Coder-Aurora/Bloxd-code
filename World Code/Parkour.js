/* ----- Function Tools ----- */
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


/* ----- Definitions ----- */
const PARKOUR_INFO_PREFIX = "parkour_info_key";
const playerTempInfo = {};

const admins = [
    "Coder_Aurora", "mayb__", "Chinese886_xiaohao2", "rex111111", "201hhhhh", "lemonade_cn_builder",
    "Sandy_A321", "Skingfff_JiuZhou", "CHINA_FOX_PRO_SMALL", "Crase_ephemera_awa", "LXF_NEW_jzxk_bilibili",
    "two_fifths_"
];

let arrowLoopCreated = false;
let itemCheckLoopCreated = false;
let posLoopCreated = false;

const preventChangeType = ["Explosion", "Paintball", "FloorCreator"];

const bannedItems = [
    "RPG", "Super RPG", "Grenade Launcher", "Moonstone Explosive", "Fireball", "Iceball", "Bouncy Bomb",
    "Moonstone Remote Explosive", "Ice Bridge", "Floor Creator", "Lucky Block", "Mining Grenade"
];

const messagePool = [];

const coordinates = {
    spawn: [8119.5, 100, 8119.5],

    arrowRect: [[8114, 106, 8094], [8124, 99, 8122]],
    arrowPosition: {
        Practise: [8121.5, 101.5, 8094.5],
        Level: [8117.5, 101.5, 8094.5],
    },

    practiseZone: {
        xingHaiCity: {
            start: [1009.5, 3005, 1002.5],
            end: [1112.5, 3135, 1025],
            rect: [[1000.5, 3000, 1000.5], [1149.5, 3150, 1114.5]]
        },
    },

    levelRect: [[995, 999, 1003], [3705, 999, 980]],
    levelZone: {
        level1: [1000.5, 1000, 1000.5], level2: [1054.5, 1000, 1000.5], level3: [1108.5, 1000, 1000.5],
        level4: [1162.5, 1000, 1000.5], level5: [1216.5, 1000, 1000.5], level6: [1270.5, 1000, 1000.5],
        level7: [1324.5, 1000, 1000.5], level8: [1378.5, 1000, 1000.5], level9: [1432.5, 1000, 1000.5],
        level10: [1486.5, 1000, 1000.5], level11: [1540.5, 1000, 1000.5], level12: [1594.5, 1000, 1000.5],
        level13: [1648.5, 1000, 1000.5], level14: [1702.5, 1000, 1000.5], level15: [1756.5, 1000, 1000.5],
        level16: [1810.5, 1000, 1000.5], level17: [1864.5, 1000, 1000.5], level18: [1918.5, 1000, 1000.5],
        level19: [1972.5, 1000, 1000.5], level20: [2026.5, 1000, 1000.5], level21: [2080.5, 1000, 1000.5],
        level22: [2134.5, 1000, 1000.5], level23: [2188.5, 1000, 1000.5], level24: [2242.5, 1000, 1000.5],
        level25: [2296.5, 1000, 1000.5], level26: [2350.5, 1000, 1000.5], level27: [2404.5, 1000, 1000.5],
        level28: [2458.5, 1000, 1000.5], level29: [2512.5, 1000, 1000.5], level30: [2566.5, 1000, 1000.5],
        level31: [2620.5, 1000, 1000.5], level32: [2674.5, 1000, 1000.5], level33: [2728.5, 1000, 1000.5],
        level34: [2782.5, 1000, 1000.5], level35: [2836.5, 1000, 1000.5], level36: [2890.5, 1000, 1000.5],
        level37: [2944.5, 1000, 1000.5], level38: [2998.5, 1000, 1000.5], level39: [3052.5, 1000, 1000.5],
        level40: [3106.5, 1000, 1000.5], level41: [3160.5, 1000, 1000.5], level42: [3214.5, 1000, 1000.5],
        level43: [3268.5, 1000, 1000.5], level44: [3322.5, 1000, 1000.5], level45: [3376.5, 1000, 1000.5],
        level46: [3430.5, 1000, 1000.5], level47: [3484.5, 1000, 1000.5], level48: [3538.5, 1000, 1000.5],
        level49: [3592.5, 1000, 1000.5], level50: [3646.5, 1000, 1000.5],
    },
};

const rad = degree => degree * Math.PI / 180;
const animations = {
    celebrate: {
        loop: false,
        animationDurationMs: 800,

        nodeAnimations: {
            TorsoNode: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.3, rotation: { point: [rad(-20), 0, 0] } },
                    { timeFraction: 0.5, rotation: { point: [rad(10), 0, 0] } },
                    { timeFraction: 0.7, rotation: { point: [rad(-10), 0, 0] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },

            ArmLeftMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.3, rotation: { point: [rad(-150), 0, 0] } },
                    { timeFraction: 0.6, rotation: { point: [rad(-120), 0, 0] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },

            ArmRightMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.3, rotation: { point: [rad(-150), 0, 0] } },
                    { timeFraction: 0.6, rotation: { point: [rad(-120), 0, 0] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },

            LegLeftMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.4, rotation: { point: [rad(30), 0, 0] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },

            LegRightMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.4, rotation: { point: [rad(30), 0, 0] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },
        }
    },

    bow: {
        loop: false,
        animationDurationMs: 1000,

        nodeAnimations: {
            TorsoNode: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.4, rotation: { point: [rad(80), 0, 0] } },
                    { timeFraction: 0.6, rotation: { point: [rad(80), 0, 0] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },

            ArmRightMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.4, rotation: { point: [rad(-100), rad(15), rad(15)] } },
                    { timeFraction: 0.6, rotation: { point: [rad(-100), rad(15), rad(15)] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },
        }
    },

    dab: {
        loop: false,
        animationDurationMs: 600,

        nodeAnimations: {
            HeadMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.3, rotation: { point: [rad(10), 0, rad(-10)] } },
                    { timeFraction: 0.8, rotation: { point: [rad(10), 0, rad(-10)] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },

            ArmRightMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.3, rotation: { point: [rad(-140), rad(-30), 0] } },
                    { timeFraction: 0.8, rotation: { point: [rad(-140), rad(-30), 0] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },

            ArmLeftMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.3, rotation: { point: [0, rad(-70), rad(-80)] } },
                    { timeFraction: 0.8, rotation: { point: [0, rad(-70), rad(-80)] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },
        }
    },

    spin: {
        loop: true,
        animationDurationMs: 200,

        nodeAnimations: {
            TorsoNode: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.25, rotation: { point: [0, rad(90), 0] } },
                    { timeFraction: 0.5, rotation: { point: [0, rad(180), 0] } },
                    { timeFraction: 0.75, rotation: { point: [0, rad(270), 0] } },
                    { timeFraction: 1, rotation: { point: [0, rad(360), 0] } },
                ]
            },

            ArmLeftMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, rad(120)] } },
                    { timeFraction: 1, rotation: { point: [0, 0, rad(120)] } },
                ]
            },

            ArmRightMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, -rad(120)] } },
                    { timeFraction: 1, rotation: { point: [0, 0, -rad(120)] } },
                ]
            },
        }
    },

    floss: {
        loop: true,
        animationDurationMs: 400,

        nodeAnimations: {
            TorsoNode: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.25, rotation: { point: [0, 0, rad(15)] } },
                    { timeFraction: 0.75, rotation: { point: [0, 0, rad(-15)] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },

            ArmRightMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.25, rotation: { point: [rad(-60), 0, rad(-20)] } },
                    { timeFraction: 0.75, rotation: { point: [rad(60), 0, rad(-20)] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },

            ArmLeftMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.25, rotation: { point: [rad(60), 0, rad(20)] } },
                    { timeFraction: 0.75, rotation: { point: [rad(-60), 0, rad(20)] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },
        }
    },

    wave: {
        loop: false,
        animationDurationMs: 1000,

        nodeAnimations: {
            ArmRightMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [rad(-150), 0, rad(-30)] } },
                    { timeFraction: 0.25, rotation: { point: [rad(-150), 0, rad(-60)] } },
                    { timeFraction: 0.5, rotation: { point: [rad(-150), 0, rad(-30)] } },
                    { timeFraction: 0.75, rotation: { point: [rad(-150), 0, rad(-60)] } },
                    { timeFraction: 1, rotation: { point: [rad(-150), 0, rad(-30)] } },
                ]
            },
        }
    },

    headshake: {
        loop: true,
        animationDurationMs: 350,

        nodeAnimations: {
            HeadMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.25, rotation: { point: [0, 0, rad(-30)] } },
                    { timeFraction: 0.75, rotation: { point: [0, 0, rad(30)] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },
        }
    },

    xihai: {
        loop: false,
        animationDurationMs: 700,

        nodeAnimations: {
            HeadMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.3, rotation: { point: [rad(25), 0, 0] } },
                    { timeFraction: 0.7, rotation: { point: [rad(25), 0, 0] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },

            ArmRightMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.3, rotation: { point: [rad(-100), rad(10), rad(-5)] } },
                    { timeFraction: 0.7, rotation: { point: [rad(-100), rad(10), rad(-5)] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },
        }
    },

    shrug: {
        loop: false,
        animationDurationMs: 600,

        nodeAnimations: {
            ArmLeftMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.3, rotation: { point: [rad(-80), rad(-30), rad(70)] } },
                    { timeFraction: 0.7, rotation: { point: [rad(-80), rad(-30), rad(70)] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },

            ArmRightMesh: {
                timeline: [
                    { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                    { timeFraction: 0.3, rotation: { point: [rad(-80), rad(30), rad(-70)] } },
                    { timeFraction: 0.7, rotation: { point: [rad(-80), rad(30), rad(-70)] } },
                    { timeFraction: 1, rotation: { point: [0, 0, 0] } },
                ]
            },
        }
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

const getParkourDbKey = (playerDbId) => `${PARKOUR_INFO_PREFIX}.${playerDbId}`;

const isAdmin = playerId => admins.includes(api.getEntityName(playerId));

const createArrow = () => {
    if (arrowLoopCreated) return;
    arrowLoopCreated = true;

    async.setIntervalLoop(() => {
        api.getPlayerIds().forEach(playerId => {
            const playerPos = api.getPosition(playerId);
            const arrowRectData = coordinates.arrowRect;

            if (api.isInsideRect(playerPos, ...arrowRectData, true)) {
                api.setDirectionArrow(playerId, "Practise", coordinates.arrowPosition.Practise, "Practice", true, {
                    color: "#fff830", fontSize: "10px"
                });

                api.setDirectionArrow(playerId, "Level", coordinates.arrowPosition.Level, "Level", true, {
                    color: "#fff830", fontSize: "10px"
                });
            }
        });
    }, 10 * 1000);
};

const checkItem = () => {
    if (itemCheckLoopCreated) return;
    itemCheckLoopCreated = true;

    async.setIntervalLoop(() => {
        api.getPlayerIds().forEach(playerId => {
            for (let i = 0; i <= 45; i++) {
                const item = api.getItemSlot(playerId, i)?.name;

                if (bannedItems.includes(item)) {
                    const playerName = api.getEntityName(playerId);
                    api.removeItemName(playerId, item, 45954);
                    api.kickPlayer(playerId, "You have been kicked for carrying dangerous items!");
                    txt.global_warn(`${playerName} has been kicked for carrying dangerous items!`);
                }
            }
        });
    }, 10 * 1000);
};

const broadcastChatMessage = () => {
    if (messagePool.length === 0) return;

    messagePool.forEach((msg, indx) => {
        api.broadcastMessage(msg);
        messagePool.splice(indx, 1);
    });
};

const setAdminSettings = (playerId) => {
    api.updateEntityNodeMeshAttachment(playerId, "HeadMesh", "BloxdBlock", {
        autoRotate: false,
        blockName: "Fat Red Mushroom",
        hideDist: 64,
        size: [1, 1, 1],
    }, [0, 1, 0]);

    api.configureShopCategoryForPlayer(playerId, "admin", {
        autoSelectCategory: false,
        redDot: false,
        sortPriority: 1000,
        customTitle: "Admin"
    });

    api.createShopItemForPlayer(playerId, "admin", "Teleport", {
        image: "fa-solid fa-bee",
        imageColour: "#4187bd",
        redDot: false,
        buyButtonText: "Teleport",
        userInput: {
            type: "player"
        }
    });

    api.createShopItemForPlayer(playerId, "admin", "TP Here", {
        image: "fa-solid fa-sync",
        imageColour: "#4187bd",
        redDot: false,
        buyButtonText: "TP Here",
        userInput: {
            type: "player"
        }
    });

    api.createShopItemForPlayer(playerId, "admin", "Gamemode", {
        image: "fa-solid fa-cog",
        imageColour: "#4187bd",
        redDot: false,
        buyButtonText: "Change",
        userInput: {
            type: "dropdown",
            dropdownOptions: [
                "creative", "survival", "peaceful",
                "spectator", "survivaladventure", "peacefuladventure"
            ],
            shouldResetSelectionOnOptionsChange: false,
            initialValue: "creative"
        },
    });
};

const tempInfo = () => ({
    parkourZone: null,
});

const parkourInfo = () => ({
    practiseZone: {
        lastReachedPos: {
            xingHaiCity: [...coordinates.practiseZone.xingHaiCity.start],
        },

        reachedFinishPoint: {
            xingHaiCity: false,
        }
    },

    levelZone: {
        currentZone: coordinates.levelZone.level1,
    },

    unlockedAnimations: [],

    unlockedLevels: [1],
});

const setPlayerTempInfo = (key, value) => {
    playerTempInfo[key] = value;
};

const isValidPosition = (pos) =>
    Array.isArray(pos) && pos.length === 3 && pos.every(coord => Number.isFinite(coord));

const getOrCreatePlayerParkourInfo = (playerId) => {
    const identifier = api.getPlayerDbId(playerId);
    if (!identifier) return parkourInfo();

    const key = getParkourDbKey(identifier);
    const raw = api.getLobbyDbValue(key);

    if (raw) {
        try {
            const storedInfo = JSON.parse(raw);
            const defaultData = parkourInfo();
            return {
                practiseZone: {
                    ...(storedInfo.practiseZone || {}),
                    lastReachedPos: {
                        ...defaultData.practiseZone.lastReachedPos,
                        ...(storedInfo.practiseZone?.lastReachedPos || {})
                    },
                    reachedFinishPoint: {
                        ...defaultData.practiseZone.reachedFinishPoint,
                        ...(storedInfo.practiseZone?.reachedFinishPoint || {})
                    }
                },
                levelZone: storedInfo.levelZone ?? defaultData.levelZone,
                unlockedAnimations: Array.isArray(storedInfo.unlockedAnimations)
                    ? [...storedInfo.unlockedAnimations]
                    : [...defaultData.unlockedAnimations],

                unlockedLevels: Array.isArray(storedInfo.unlockedLevels)
                    ? [...storedInfo.unlockedLevels]
                    : [...defaultData.unlockedLevels]
            };
        } catch (err) {
            console.log(`Failed to parse parkour info for ${identifier}: ${err}`);
        }
    }

    return parkourInfo();
};

const getOrCreatePlayerTempInfo = (playerId) => {
    const identifier = api.getPlayerDbId(playerId);

    if (!playerTempInfo[identifier]) {
        playerTempInfo[identifier] = tempInfo();
    }

    return playerTempInfo[identifier];
};

const changeParkourInfo = (playerId, pathStr, value) => {
    const identifier = api.getPlayerDbId(playerId);
    if (!identifier) return;

    const key = getParkourDbKey(identifier);
    const raw = api.getLobbyDbValue(key);
    let playerData = parkourInfo();
    if (raw) {
        try { playerData = JSON.parse(raw); } catch { }
    }

    const pathArr = pathStr.split('.');
    const lastKey = pathArr.pop();

    const target = pathArr.reduce((curr, k) => {
        if (!curr[k]) curr[k] = {};
        return curr[k];
    }, playerData);

    target[lastKey] = value;
    api.setLobbyDbValue(key, JSON.stringify(playerData));
};

const changeTempInfo = (playerId, pathStr, value) => {
    const identifier = api.getPlayerDbId(playerId);
    const tempData = getOrCreatePlayerTempInfo(playerId);
    const pathArr = pathStr.split('.');
    const lastKey = pathArr.pop();

    const target = pathArr.reduce((curr, k) => {
        if (!curr[k]) curr[k] = {};
        return curr[k];
    }, tempData);

    target[lastKey] = value;
    setPlayerTempInfo(identifier, tempData);
};

const getLevel = (playerId) => {
    const playerParkourInfo = getOrCreatePlayerParkourInfo(playerId);
    const currentPos = playerParkourInfo.levelZone.currentZone;
    const levelPosList = Object.values(coordinates.levelZone);
    const levelIndex = levelPosList.findIndex(pos =>
        pos[0] === currentPos[0] &&
        pos[1] === currentPos[1] &&
        pos[2] === currentPos[2]
    );

    return levelIndex === -1 ? 1 : levelIndex + 1;
};

const createNameTag = (playerId) => {
    const realLevel = getLevel(playerId);
    const tag = isAdmin(playerId)
        ? {
            backgroundColor: "#291800CC",
            content: [
                { str: "👑 ", style: { color: "#FFD700", fontSize: "50px" } },
                { str: api.getEntityName(playerId), style: { color: "#FFF8DC", fontSize: "50px" } },
            ],
            subtitleBackgroundColor: "#70380090",
            subtitle: [
                { str: `Admin | Level: ${realLevel}`, style: { color: "#FFE073", fontSize: "40px" } },
            ]
        }
        : {
            backgroundColor: "#120E44AA",
            content: [
                { str: "✨ ", style: { color: "#A69BFF", fontSize: "50px" } },
                { str: api.getEntityName(playerId), style: { color: "#E7E2FF", fontSize: "50px" } },
            ],
            subtitleBackgroundColor: "#1E2E6C80",
            subtitle: [
                { str: `Level: ${realLevel}`, style: { color: "#B6D3FF", fontSize: "40px" } },
            ]
        };

    api.setTargetedPlayerSettingForEveryone(playerId, "nameTagInfo", tag, true);
};

const createRightText = (playerId) => {
    const realLevel = getLevel(playerId);
    const maxLevel = Object.keys(coordinates.levelZone).length;
    const isPlayerAdmin = isAdmin(playerId);

    const textSettings = {
        showBackground: true,
        content: [
            { str: ` -=-=-= PARKOUR =-=-=- \n`, style: { color: "#6366f1", fontSize: "18px", fontWeight: "900" } },
            { str: ` Owner & Coedr: Coder_Aurora \n`, style: { color: "#2563eb", fontSize: "15px", fontStyle: "italic" } },
            { str: ` Builders: mayb__ | Chinese886_xiaohao2 \n`, style: { color: "#e375f9", fontSize: "15px", fontStyle: "italic" } },
            { str: ` ——————————————————— \n`, style: { color: "#7b61ff", fontSize: "14px" } },
            { str: ` Current Level: ${realLevel} / ${maxLevel} \n`, style: { color: "#a855f7", fontSize: "15px", fontStyle: "italic" } },
            { str: ` Progress: ${((realLevel / maxLevel) * 100).toFixed(1)}% \n`, style: { color: "#8c68f0", fontSize: "14px", fontStyle: "italic" } },
            { str: ` ——————————————————— \n`, style: { color: "#7b61ff", fontSize: "14px" } },
            { str: isPlayerAdmin ? " ✅ Role: Server Admin \n" : " 🎮 Role: Normal Player \n", style: { color: "#4facfe", fontSize: "14px" } },
            { str: ` 💡 Tip: Type #help to view all commands \n`, style: { color: "#699bff", fontSize: "13px" } },
        ],
    };

    api.setClientOptions(playerId, {
        RightInfoText: textSettings,
    });
};

const transaction = (playerId, cost, currency, amount, reward, attributes = null) => {
    const itemAmount = api.getInventoryItemAmount(playerId, currency);

    if (itemAmount >= cost) {
        api.removeItemName(playerId, currency, +cost);

        if (attributes) {
            api.giveItem(playerId, reward, +amount, attributes);
        } else {
            api.giveItem(playerId, reward, +amount);
        }
        api.sendMessage(playerId, `You received ${amount} ${reward}!`, { color: "Green" });
    } else {
        api.sendMessage(playerId, `You need ${cost} ${currency} to buy ${amount} ${reward}!`, { color: "Red" });
    }
};

const createNormalShop = (playerId) => {
    api.configureShopCategoryForPlayer(playerId, "shop", {
        autoSelectCategory: false,
        customTitle: "Shop",
        redDot: false,
        sortPriority: 999
    });

    api.configureShopCategoryForPlayer(playerId, "achievement", {
        autoSelectCategory: false,
        customTitle: "Achievement",
        redDot: false,
        sortPriority: 998
    });

    api.createShopItemForPlayer(playerId, "shop", "Get Poop", {
        image: "Poopy",
        imageColour: "#ffc508",
        redDot: false,
        buyButtonText: "Get Poop"
    });

    api.createShopItemForPlayer(playerId, "shop", "Watermelon Slice", {
        image: "Jump Boost",
        imageColour: "#c5ff08",
        redDot: false,
        buyButtonText: "Buy",
        userInput: {
            type: "number",
            placeholderText: "1000 for one"
        }
    });

    api.createShopItemForPlayer(playerId, "shop", "Knockback Potion", {
        image: "Vertical Knockback Enchantment",
        imageColour: "#fffb00",
        redDot: false,
        buyButtonText: "Buy",
        userInput: {
            type: "number",
            placeholderText: "5000 for one"
        }
    });

    api.createShopItemForPlayer(playerId, "achievement", "Unlocked Animations", {
        image: "fa-solid fa-fire",
        imageColour: "#ff6600",
        redDot: false,
        buyButtonText: "Play",
        userInput: {
            type: "dropdown",
            dropdownOptions: [],
            shouldResetSelectionOnOptionsChange: false
        }
    });

    api.createShopItemForPlayer(playerId, "achievement", "Unlocked Levels", {
        image: "fa-solid fa-lock-open",
        imageColour: "#51c765",
        redDot: false,
        buyButtonText: "Teleport",
        userInput: {
            type: "dropdown",
            dropdownOptions: [],
            shouldResetSelectionOnOptionsChange: false
        }
    });
};

const getPractiseZone = (playerId) => {
    const [px, py, pz] = api.getPosition(playerId);
    const practiseZones = Object.entries(coordinates.practiseZone);

    for (const [zoneName, zoneInfo] of practiseZones) {
        const [x1, y1, z1] = zoneInfo.rect[0];
        const [x2, y2, z2] = zoneInfo.rect[1];

        if (api.isInsideRect([px, py, pz], [x1, y1, z1], [x2, y2, z2])) {
            changeTempInfo(playerId, "parkourZone", zoneName);
            return zoneName;
        }
    }

    changeTempInfo(playerId, "parkourZone", null);
    return null;
};

const getLastPosition = (playerId) => {
    const [px, py, pz] = api.getPosition(playerId);
    const zone = getPractiseZone(playerId);
    if (zone) {
        changeParkourInfo(playerId, `practiseZone.lastReachedPos.${zone}`, [px, py, pz]);
    }
};

const recordPosition = () => {
    if (posLoopCreated) return;
    posLoopCreated = true;

    async.setIntervalLoop(() => {
        api.getPlayerIds().forEach(playerId => {
            const zone = getPractiseZone(playerId);
            if (zone) getLastPosition(playerId);
        });
    }, 2 * 1000);
};

const updateUnlockedLevelsShop = (playerId) => {
    const info = getOrCreatePlayerParkourInfo(playerId);
    const maxLevel = Object.keys(coordinates.levelZone).length;
    const unlocked = info.unlockedLevels;

    const options = [];
    for (let lv = 1; lv <= maxLevel; lv++) {
        if (unlocked.includes(lv)) {
            options.push({ option: `Level ${lv}`, cost: 0 });
        }
    }

    api.updateShopItemForPlayer(playerId, "achievement", "Unlocked Levels", {
        userInput: {
            type: "dropdown",
            dropdownOptions: options,
            shouldResetSelectionOnOptionsChange: false
        }
    });
};

const updateUnlockedAnimationsShop = (playerId) => {
    const info = getOrCreatePlayerParkourInfo(playerId);
    const unlocked = info.unlockedAnimations;
    const allKeys = Object.keys(animations);

    const options = [];
    for (const key of allKeys) {
        if (unlocked.includes(key)) {
            options.push({ option: key, cost: 0 });
        }
    }

    api.updateShopItemForPlayer(playerId, "achievement", "Unlocked Animations", {
        userInput: {
            type: "dropdown",
            dropdownOptions: options,
            shouldResetSelectionOnOptionsChange: false
        }
    });
};

var parkourInterface = {
    goToNextLevel: (playerId) => {
        const playerParkourInfo = getOrCreatePlayerParkourInfo(playerId);
        const currentZone = playerParkourInfo.levelZone.currentZone;
        const levelArr = Object.values(coordinates.levelZone);
        const unlockArr = [...playerParkourInfo.unlockedLevels];

        if (!isValidPosition(currentZone)) {
            txt.local_warn(playerId, "Level data abnormal, unable to jump");
            return;
        }

        const nowIndex = levelArr
            .findIndex(pos => pos[0] === currentZone[0] && pos[1] === currentZone[1] && pos[2] === currentZone[2]);

        if (nowIndex === -1) {
            txt.local_warn(playerId, "Current level unrecognized, unable to jump");
            return;
        }

        if (nowIndex + 1 >= levelArr.length) {
            txt.local(playerId, "You have completed all levels, please wait for new levels update");
            return;
        }

        const nextZone = levelArr[nowIndex + 1];
        const nextLvNum = nowIndex + 2;

        changeParkourInfo(playerId, "levelZone.currentZone", nextZone);

        if (!unlockArr.includes(nextLvNum)) {
            unlockArr.push(nextLvNum);
            changeParkourInfo(playerId, "unlockedLevels", unlockArr);
            updateUnlockedLevelsShop(playerId);
        }

        api.setPosition(playerId, nextZone);

        createNameTag(playerId);
        createRightText(playerId);

        api.giveItem(playerId, "Gold Coin", 100);

        const nextLv = getLevel(playerId);
        txt.local(playerId, `Successfully teleported to Level ${nextLv}`);
    },

    goToCurrentLevel: (playerId) => {
        const playerParkourInfo = getOrCreatePlayerParkourInfo(playerId);
        const currentZone = playerParkourInfo.levelZone.currentZone;
        if (!isValidPosition(currentZone)) {
            txt.local_warn(playerId, "Level data abnormal");
            return;
        }
        api.setPosition(playerId, currentZone);
    },

    goToPractiseZone: (playerId, zoneName) => {
        const lastPos = getOrCreatePlayerParkourInfo(playerId).practiseZone.lastReachedPos[zoneName];
        if (lastPos) {
            api.setPosition(playerId, lastPos);
        } else {
            api.setPosition(playerId, coordinates.practiseZone[zoneName].start);
        }
    },

    unlockAnimation: (playerId, animationKey) => {
        const info = getOrCreatePlayerParkourInfo(playerId);
        const unlocked = [...info.unlockedAnimations];

        if (unlocked.includes(animationKey)) {
            txt.local_warn(playerId, `Animation "${animationKey}" already unlocked`);
            return false;
        }

        unlocked.push(animationKey);
        changeParkourInfo(playerId, "unlockedAnimations", unlocked);
        updateUnlockedAnimationsShop(playerId);
        txt.local(playerId, `Unlocked animation: ${animationKey}`);
        return true;
    },

    finishPractiseZone: (playerId, zoneName) => {
        changeParkourInfo(playerId, `practiseZone.${zoneName}.finished`, true);
        txt.local(playerId, `Finished practise zone: ${zoneName}`);
    },
};

/* ----- World Callback ----- */
tick = (ms) => {
    processQueue();
    broadcastChatMessage();
};

onWorldChangeBlock = (x, y, z, from, to, initiatorDbId, extraInfo) => {
    const shouldPrevent = preventChangeType.includes(extraInfo?.cause);
    if (shouldPrevent) {
        return "preventChange";
    }
};

onInventoryUpdated = (playerId) => {
    for (let i = 0; i <= 45; i++) {
        const item = api.getItemSlot(playerId, i)?.name;

        if (bannedItems.includes(item)) {
            api.removeItemName(playerId, item, 45954);
            api.kickPlayer(playerId, "You have been kicked for carrying dangerous items!");
            txt.global_warn(`${api.getEntityName(playerId)} has been kicked for carrying dangerous items!`);
        }
    }
};

onPlayerJoin = (playerId, fromReset) => {
    const playerParkourInfo = getOrCreatePlayerParkourInfo(playerId);
    const playerTempInfo = getOrCreatePlayerTempInfo(playerId);

    if (isAdmin(playerId)) {
        setAdminSettings(playerId);
    } else {
        api.setPosition(playerId, coordinates.spawn);
        api.setPlayerGamemode(playerId, "survivaladventure");
    }

    createArrow();
    checkItem();
    recordPosition();

    createNameTag(playerId);
    createRightText(playerId);
    createNormalShop(playerId);
    updateUnlockedLevelsShop(playerId);
    updateUnlockedAnimationsShop(playerId);

    api.setClientOption(playerId, "secsToRespawn", 0);
};

onPlayerBoughtShopItem = (playerId, categoryKey, itemKey, item, userInput) => {
    if (categoryKey === "admin") {
        if (itemKey === "Teleport") {
            const [px, py, pz] = api.getPosition(userInput);
            api.setPosition(playerId, px, py, pz);
            txt.local(playerId, `Teleported to player ${api.getEntityName(userInput)}`);
        } else if (itemKey === "TP Here") {
            api.setPosition(userInput, api.getPosition(playerId));
            txt.local(playerId, `Teleported player ${api.getEntityName(userInput)} to you`);
        } else if (itemKey === "Gamemode") {
            api.setPlayerGamemode(playerId, userInput);
        }
    }

    else if (categoryKey === "shop") {
        if (itemKey === "Get Poop") {
            transaction(playerId, 0, "Air", 1, "Poop", {
                customAttributes: {
                    enchantmentTier: "Tier 5",
                }
            });
        } else if (itemKey === "Watermelon Slice") {
            if (/^([1-9]|[1-4]\d|50)$/.test(userInput)) {
                transaction(playerId, userInput * 1000, "Gold Coin", 1, "Watermelon Slice");
            } else {
                txt.local_warn(playerId, `Invalid input: ${userInput}; Please enter a number less or equals to 50`);
            }
        } else if (itemKey === "Knockback Potion") {
            if (/^([1-9]|10)$/.test(userInput)) {
                transaction(playerId, userInput * 5000, "Gold Coin", 1, "Splash Knockback Potion II");
            } else {
                txt.local_warn(playerId, `Invalid input: ${userInput}; Please enter a number less or equals to 10`);
            }
        }
    }

    else if (categoryKey === "achievement") {
        if (itemKey === "Unlocked Animations") {
            const animName = userInput;
            if (animations[animName]) {
                if (animName === "celebrate") {
                    async.setTimeout(() => {
                        api.applyImpulse(playerId, 0, 7, 0);
                    }, 200);
                }

                api.animateEntity(playerId, animations[animName], 0, 1);
                txt.local(playerId, `Playing animation: ${animName}`);
            } else {
                txt.local_warn(playerId, `Animation not found: ${animName}`);
            }
        } else if (itemKey === "Unlocked Levels") {
            const levelKey = userInput.replace(/\s/g, '').toLowerCase();
            const levelCoord = coordinates.levelZone[levelKey];
            if (levelCoord) {
                api.setPosition(playerId, levelCoord);
                txt.local(playerId, `Teleported to ${userInput}`);
            } else {
                txt.local_warn(playerId, `Level not found: ${userInput}`);
            }
        }
    }
};

onPlayerDamagingOtherPlayer = (attackingPlayer, damagedPlayer, damageDealt, withItem, bodyPartHit, damagerDbId) => {
    const [ax, ay, az] = api.getPosition(attackingPlayer);

    if (api.isInsideRect([ax, ay, az], coordinates.levelRect[0], coordinates.levelRect[1], false)) {
        return "preventDamage";
    }
};

onPlayerChat = (playerId, chatMessage, channelName) => {
    const playerName = api.getEntityName(playerId);

    const trimmed = chatMessage.trim();
    const cmd = trimmed.split(/\s+/);
    const prefix = cmd[0][0];
    const command = cmd[0].slice(1).toLowerCase();

    if (prefix === "#") {
        if (command === "help") {
            txt.local(playerId, `\n#:\n  #kill - Kill yourself\n\n@:\n  @<PlayerName> <message> - Send a message to a player`);
        } else if (command === "kill") {
            api.killLifeform(playerId, { lifeformId: playerId, withItem: "Fat Red Mushroom" });
        }

        return false;
    }
    else if (prefix === "@") {
        const targetPlayerName = cmd[0].slice(1);
        const message = cmd.slice(1).join(' ');

        if (!targetPlayerName) {
            txt.local_warn(playerId, "Usage: @<player> <message>");
            return false;
        }

        const targetId = api.getPlayerId(targetPlayerName);
        if (!targetId) {
            txt.local_warn(playerId, `Player "${targetPlayerName}" not found`);
            return false;
        }

        const senderName = api.getEntityName(playerId);

        api.sendMessage(targetId, [
            { icon: "fa-solid fa-file-text", style: { color: "#ff99cc" } },
            { str: " [ ", style: { color: "#74b1ff" } },
            { str: "PM", style: { color: "#a855f7", fontWeight: "bold" } },
            { str: " from ", style: { color: "#74b1ff", fontStyle: "italic" } },
            { str: senderName, style: { color: "#facc15", fontWeight: "700" } },
            { str: " ]", style: { color: "#74b1ff" } },
            { str: ": ", style: { color: "#4facfe" } },
            { str: message || "(empty)", style: { color: "#9d8cff", fontWeight: "700", fontStyle: "italic" } },
        ]);

        api.sendMessage(playerId, [
            { icon: "fa-solid fa-file-text", style: { color: "#ff99cc" } },
            { str: " [ ", style: { color: "#74b1ff" } },
            { str: "PM", style: { color: "#a855f7", fontWeight: "bold" } },
            { str: " to ", style: { color: "#74b1ff", fontStyle: "italic" } },
            { str: targetPlayerName, style: { color: "#facc15", fontWeight: "700" } },
            { str: " ]", style: { color: "#74b1ff" } },
            { str: ": ", style: { color: "#4facfe" } },
            { str: message || "(empty)", style: { color: "#9d8cff", fontWeight: "700", fontStyle: "italic" } },
        ]);

        return false;
    }

    let styledMessage;
    if (playerName === "Coder_Aurora") {
        styledMessage = [
            { str: "✈️", style: { color: "#a78bfa", fontSize: "13px", fontWeight: "700" } },
            { str: " [AirBus] ", style: { color: "#60a5fa", fontSize: "13px", fontWeight: "700" } },
            { str: "[Linkin Park] ", style: { color: "#c084fc", fontSize: "13px", fontWeight: "700" } },
            { str: "Coder_Aurora: ", style: { color: "#93c5fd", fontSize: "13px", fontStyle: "italic", fontWeight: "600" } },
            { str: chatMessage, style: { color: "#ede9fe", fontSize: "13px", fontWeight: "500" } }
        ];
    } else {
        styledMessage = [
            { str: `${playerName}: `, style: { color: "#9c9b9b", fontSize: "13px", fontStyle: "italic", fontWeight: "600" } },
            { str: chatMessage, style: { color: "#f0f0f0", fontSize: "13px", fontStyle: "normal", fontWeight: "500" } }
        ];
    }

    messagePool.push(styledMessage);

    return false;
};

onPlayerLeave = (playerId) => {
    getLastPosition(playerId);
    delete playerTempInfo[api.getPlayerDbId(playerId)];
};
