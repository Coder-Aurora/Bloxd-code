/**
 * @param {string} playerId
 * @param {Record<string, number>} costConfig  - 需要消耗的物品配置，格式：{ "物品名": 数量 }
 * @param {Record<string, { amount: number, customAttributes?: Record<string, any> }>} returnConfig
 *  - 返回的物品配置，格式：{ "物品名": { amount: 数量, customAttributes?: 自定义属性 } }
 * @returns {boolean} 是否交易成功
 */
const tradeItems = (playerId, costConfig, returnConfig) => {
    if (!playerId || !costConfig || !returnConfig) return false;

    const costEntries = Object.entries(costConfig);
    const returnEntries = Object.entries(returnConfig);

    const missing = costEntries.filter(([itemName, amount]) => {
        const have = api.getInventoryItemAmount(playerId, itemName);
        return have < amount;
    });

    if (missing.length > 0) {
        const missingText = missing
            .map(([itemName, amount]) => `${amount} ${itemName}`)
            .join(", ");

        api.sendMessage(playerId, `You need ${missingText} to trade!`, { color: "Red" });
        return false;
    }

    for (const [itemName, amount] of costEntries) {
        api.removeItemName(playerId, itemName, amount);
    }

    for (const [itemName, itemInfo] of returnEntries) {
        const amount = Number(itemInfo?.amount ?? 0);
        const attributes = itemInfo?.customAttributes ?? null;

        if (amount <= 0) continue;

        if (attributes && Object.keys(attributes).length > 0) {
            api.giveItem(playerId, itemName, amount, attributes);
        } else {
            api.giveItem(playerId, itemName, amount);
        }
    }

    api.sendMessage(playerId, "Trade succeeded!", { color: "Green" });
    return true;
};
