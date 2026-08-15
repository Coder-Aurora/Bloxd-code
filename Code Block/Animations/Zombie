api.animateEntity(playerId, {
    loop: true,
    animationDurationMs: 800,
    nodeAnimations: {
        TorsoNode: {
            timeline: [
                { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                { timeFraction: 0.3, rotation: { point: [0.15, 0.15, 0.15] } },
                { timeFraction: 0.6, rotation: { point: [-0.15, -0.15, -0.15] } },
                { timeFraction: 1, rotation: { point: [0, 0, 0] } }
            ]
        },

        LegRightMesh: {
            timeline: [
                { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                { timeFraction: 0.3, rotation: { point: [0.12, 0.12, 0.12] } },
                { timeFraction: 0.6, rotation: { point: [-0.12, -0.12, -0.12] } },
                { timeFraction: 1, rotation: { point: [0, 0, 0] } }
            ]
        },

        LegLeftMesh: {
            timeline: [
                { timeFraction: 0, rotation: { point: [0, 0, 0] } },
                { timeFraction: 0.3, rotation: { point: [-0.12, -0.12, -0.12] } },
                { timeFraction: 0.6, rotation: { point: [0.12, 0.12, 0.12] } },
                { timeFraction: 1, rotation: { point: [0, 0, 0] } }
            ]
        },

        ArmLeftMesh: {
            timeline: [
                { timeFraction: 0, rotation: { point: [-1.57, 0, 0] } },
                { timeFraction: 1, rotation: { point: [-1.57, 0, 0] } }
            ]
        },

        ArmRightMesh: {
            timeline: [
                { timeFraction: 0, rotation: { point: [-1.57, 0, 0] } },
                { timeFraction: 1, rotation: { point: [-1.57, 0, 0] } }
            ]
        }
    }
}, 0, 1);
