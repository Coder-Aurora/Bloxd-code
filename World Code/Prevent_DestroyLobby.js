const bannedItems = [
    "RPG", "Super RPG", "Grenade Launcher", "Moonstone Explosive", "Fireball", "Iceball", "Bouncy Bomb",
    "Moonstone Remote Explosive", "Ice Bridge", "Floor Creator", "Lucky Block", "Mining Grenade"
];

onWorldChangeBlock = (x, y, z, from, to, initiatorDbId, extraInfo) => {
    if (["Explosion", "Paintball", "FloorCreator"].includes(extraInfo?.cause)) {
        const playerId = initiatorDbId ? api.getPlayerIdFromDbId(initiatorDbId) : null;

        if (playerId) {
            for (let i = 0; i < 45; ++i) {
                const item = api.getItemSlot(playerId, i)?.name;

                if (bannedItems.includes(item)) {
                    const playerName = api.getEntityName(playerId);
                    api.removeItemName(playerId, item, 45954);
                    api.kickPlayer(playerId, "You have been kicked for carrying dangerous items!");
                    api.broadcastMessage([{ str: `${playerName} has been kicked for carrying dangerous items!`, style: { color: "Red" }}]);
                }
            }

            return "preventChange";
        }
    }
};
