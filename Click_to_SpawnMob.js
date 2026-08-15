const mobInfo = new Map();

onPlayerClick = (playerId, wasAlt, x, y, z, block, targetEId) => {
    const heldItem = api.getHeldItem(playerId);

    if (heldItem?.name === "Stick") {
        const [px, py, pz] = api.getPosition(playerId) || [x, y, z];
        const facingInfo = api.getPlayerFacingInfo(playerId);
        const [dx, dy, dz] = facingInfo?.dir || [0, 0, 1];

        const mobId = api.attemptSpawnMob("Stalker", px + dx, py + dy + 1, pz + dz);
        const meshId = api.attemptCreateMeshEntity("BloxdBlock", {
            blockName: "Black Glass",
            size: 0.7,
        });

        if (mobId && meshId) {
            mobInfo.set(mobId, meshId);
            api.addFollowingEntityToPlayer(mobId, meshId, [0, 2.3, 0], true);
        }
    }
};

onPlayerKilledMob = (playerId, mobId, dmgDealt, withIem) => {
    const meshId = mobInfo.get(mobId) || null;

    if (meshId) {
        api.deleteMeshEntity(meshId);
        mobInfo.delete(mobId);
    }
};
