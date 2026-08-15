const applyOppsiteImpulse = (playerId, impulse = 5) => {
    if (playerId) {
        const facingInfo = api.getPlayerFacingInfo(playerId);
        const [dx, dy, dz] = facingInfo?.dir;
        const impulseVec = [
            -dx * impulse,
            3,
            -dz * impulse
        ];

        api.applyImpulse(playerId, ...impulseVec);

        return true;
    }

    return false;
};
