const [dx, dy, dz] = [0.5, 9.5, 1];
const [x, y, z] = thisPos;

api.playParticleEffect({
    dir1: [0, 0, 0],
    dir2: [0, 0, 0],
    pos1: [x + 1.5 + dx, y + 20 + dy, z + 1.5 + dz],
    pos2: [x - 1.5 + dx, y + dy, z - 1.5 + dz],
    texture: 'glint',
    minLifeTime: 1,
    maxLifeTime: 0.6,
    minEmitPower: 1,
    maxEmitPower: 13,
    minSize: 0.25,
    maxSize: 1.5,
    manualEmitCount: 900,
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
    blendMode: 0,
});

api.playParticleEffect({
    dir1: [5, 2, 5],
    dir2: [-5, 0, -5],
    pos1: [x + 0.5 + dx, y + dy, z + dz],
    pos2: [x - 0.5 + dx, y + dy, z + dz],
    texture: 'drift',
    minLifeTime: 1,
    maxLifeTime: 0.6,
    minEmitPower: 1,
    maxEmitPower: 13,
    minSize: 0.25,
    maxSize: 1.5,
    manualEmitCount: 300,
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
    blendMode: 0,
});

api.attemptSpawnMob('Draugr Warper', x + dx, y + dy, z + dz);
