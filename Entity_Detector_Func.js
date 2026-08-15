const degToRad = (deg) => deg * Math.PI / 180;

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const len = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

const normalize = (v) => {
    const l = len(v);
    if (l === 0) return [0, 0, 0];
    return [v[0] / l, v[1] / l, v[2] / l];
};

const angleBetween = (dirA, dirB) => {
    const nA = normalize(dirA);
    const nB = normalize(dirB);
    const cosTheta = Math.max(-1, Math.min(1, dot(nA, nB)));
    return Math.acos(cosTheta) * 180 / Math.PI;
};

const detectEntities = (playerId, angle = 90, distance = 5) => {
    angle = Math.max(0, Math.min(180, angle));
    distance = Math.max(0, distance);

    const facing = api.getPlayerFacingInfo(playerId);
    if (!facing) return [];

    const [cx, cy, cz] = facing.camPos;
    const [dx, dy, dz] = facing.dir;

    if (angle === 0) {
        const targetInfo = api.getPlayerTargetInfo(playerId);
        if (!targetInfo) return [];

        if (targetInfo.eid) return [targetInfo.eid];

        if (targetInfo.position) {
            const entities = api.getEntitiesInRect(
                [targetInfo.position[0] - 0.5, targetInfo.position[1] - 0.5, targetInfo.position[2] - 0.5],
                [targetInfo.position[0] + 0.5, targetInfo.position[1] + 0.5, targetInfo.position[2] + 0.5]
            );
            return entities.filter(eid => eid !== playerId);
        }

        return [];
    }

    const minX = cx - distance, minY = cy - distance, minZ = cz - distance;
    const maxX = cx + distance, maxY = cy + distance, maxZ = cz + distance;

    let entities = [];
    try {
        entities = api.getEntitiesInRect([minX, minY, minZ], [maxX, maxY, maxZ]);
    } catch (e) {
        return [];
    }

    if (!entities || entities.length === 0) return [];

    const halfAngle = angle / 2;

    const results = [];
    for (const eid of entities) {
        if (eid === playerId) continue;

        const pos = api.getPosition(eid);
        if (!pos) continue;

        const toTarget = [
            pos[0] - cx,
            pos[1] - cy,
            pos[2] - cz
        ];

        const dist = len(toTarget);
        if (dist > distance || dist < 0.1) continue;

        const angleDiff = angleBetween([dx, dy, dz], toTarget);
        if (angleDiff > halfAngle) continue;

        results.push(eid);
    }

    return results;
};
