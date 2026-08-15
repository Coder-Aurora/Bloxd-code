const railwayConfig = {
    impulse: 20
};

onBlockStandStart = (playerId, x, y, z, blockName) => {
    const blockId = api.getBlockId(x, y, z);
    const index = blockId - 253;

    if (index < 0 || index > 3) return;

    const angle = index * Math.PI / 2;
    const vx = -Math.sin(angle) * railwayConfig.impulse;
    const vz = -Math.cos(angle) * railwayConfig.impulse;

    api.applyImpulse(playerId, vx, 0, vz);
};
