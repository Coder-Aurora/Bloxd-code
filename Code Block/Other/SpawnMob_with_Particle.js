const [x, y, z] = thisPos;

api.playParticleEffect({
    dir1: [0, 0, 0],
    dir2: [0, 0, 0],
    pos1: [x + 1, y + 30, z + 2.5],
    pos2: [x - 1, y + 30, z - 0.5],
    texture: 'glint',
    minLifeTime: 3,
    maxLifeTime: 3.5,
    minEmitPower: 1,
    maxEmitPower: 13,
    minSize: 0.25,
    maxSize: 1.5,
    manualEmitCount: 400,
    gravity: [0, -100, 0],
    colorGradients: [{
        timeFraction: 0,
        minColor: [100, 200, 800, 1],
        maxColor: [100, 200, 800, 1],
    }],
    velocityGradients: [{
        timeFraction: 0,
        factor: 0.1,
        factor2: 1,
    }],
    blendMode: 4,
});

api.playParticleEffect({
    dir1: [5, 2, 5],
    dir2: [-5, 0, -5],
    pos1: [x + 1, y + 35, z + 1],
    pos2: [x, y + 30, z + 1],
    texture: 'drift',
    minLifeTime: 3,
    maxLifeTime: 3.5,
    minEmitPower: 0.1,
    maxEmitPower: 13,
    minSize: 0.25,
    maxSize: 1.5,
    manualEmitCount: 5000,
    gravity: [0, 0, 0],
    colorGradients: [{
        timeFraction: 0,
        minColor: [100, 200, 800, 1],
        maxColor: [100, 200, 800, 1],
    }],
    velocityGradients: [{
        timeFraction: 0,
        factor: 0.1,
        factor2: 1,
    }],
    blendMode: 4,
});

api.attemptSpawnMob("Draugr Warper", x + 0.5, y + 23, z + 0.5);
