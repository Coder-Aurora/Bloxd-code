const [x, y, z] = thisPos;

api.playParticleEffect({
    dir1: [-0.9, -0.9, -0.9],
    dir2: [0.9, 0.9, 0.9],
    pos1: [x + 0.5, y + 2, z + 0.5],
    pos2: [x + 0.5, y + 3.5, z + 0.5],
    texture: "critical_hit",
    maxLifeTime: 1,
    minLifeTime: 0.5,
    minEmitPower: 3,
    maxEmitPower: 5,
    minSize: 0.3,
    maxSize: 0.5,
    manualEmitCount: 500,
    gravity: [0, -5, 0],
    colorGradients: [
        { timeFraction: 0, minColor: [100, 180, 255], maxColor: [150, 220, 255] },
        { timeFraction: 1, minColor: [50, 100, 200], maxColor: [80, 150, 230] }
    ],
    velocityGradients: [
        { timeFraction: 0, factor: 10, factor2: 1 },
        { timeFraction: 1, factor: 0, factor2: 1 }
    ],
    blendMode: 4,
    hideDist: 64
});
