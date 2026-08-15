const rad = deg => deg * Math.PI / 180;

api.animateEntity(playerId, {
    loop: true,
    animationDurationMs: 300,

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
                { timeFraction: 0, rotation: { point: [0, 0, rad(90)] } },
                { timeFraction: 1, rotation: { point: [0, 0, rad(90)] } },
            ]
        },

        ArmRightMesh: {
            timeline: [
                { timeFraction: 0, rotation: { point: [0, 0, -rad(90)] } },
                { timeFraction: 1, rotation: { point: [0, 0, -rad(90)] } },
            ]
        },
    }
}, 0, 1);
