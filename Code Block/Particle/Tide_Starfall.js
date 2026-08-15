const [x, y, z] = thisPos;

api.playParticleEffect({
    dir1: [-1, -1, -1],
    dir2: [1, 1, 1],
    pos1: [x + 0.5, y + 1.5, z + 0.5],
    pos2: [x + 0.5, y + 3.5, z + 0.5],
    texture: "square_particle",
    maxLifeTime: 1.2,
    minLifeTime: 0.8,
    minEmitPower: 2,
    maxEmitPower: 4,
    minSize: 0.2,
    maxSize: 0.4,
    manualEmitCount: 400,
    gravity: [0, -2, 0],
    colorGradients: [
        { timeFraction: 0, minColor: [140, 230, 255], maxColor: [200, 245, 255] },
        { timeFraction: 1, minColor: [40, 110, 255], maxColor: [80, 150, 230] }
    ],
    velocityGradients: [
        { timeFraction: 0, factor: 9, factor2: 1 },
        { timeFraction: 1, factor: 0.2, factor2: 1 }
    ],
    blendMode: 4,
    hideDist: 64
});
