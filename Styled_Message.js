// 薰衣草
api.broadcastMessage([
    { str: "✈️", style: { color: "#a78bfa", fontSize: "14px", fontWeight: "700" } },
    { str: " [AirBus] ", style: { color: "#60a5fa", fontSize: "14px", fontWeight: "700" } },
    { str: "[Linkin Park] ", style: { color: "#c084fc", fontSize: "14px", fontWeight: "700" } },
    { str: "Coder_Aurora: ", style: { color: "#93c5fd", fontSize: "14px", fontStyle: "italic", fontWeight: "600" } },
    { str: chatMessage, style: { color: "#ede9fe", fontSize: "14px", fontWeight: "500" } }
]);

// 深蓝紫色渐变
api.broadcastMessage([
    { str: "✈️", style: { color: "#8b5cf6", fontSize: "11px", fontWeight: "700" } },
    { str: " [AirBus] ", style: { color: "#6366f1", fontSize: "11px", fontWeight: "700" } },
    { str: "[Linkin Park] ", style: { color: "#a855f7", fontSize: "11px", fontWeight: "700" } },
    { str: "Coder_Aurora: ", style: { color: "#818cf8", fontSize: "11px", fontStyle: "italic", fontWeight: "600" } },
    { str: chatMessage, style: { color: "#c7d2fe", fontSize: "11px", fontWeight: "550" } }
]);

// 夜空极光
api.broadcastMessage([
    { str: "✈️", style: { color: "#22d3ee", fontSize: "11px", fontWeight: "700" } },
    { str: " [AirBus] ", style: { color: "#0ea5e9", fontSize: "11px", fontWeight: "700" } },
    { str: "[Linkin Park] ", style: { color: "#7a61e9", fontSize: "11px", fontWeight: "700" } },
    { str: "Coder_Aurora: ", style: { color: "#38bdf8", fontSize: "11px", fontStyle: "italic", fontWeight: "600" } },
    { str: chatMessage, style: { color: "#e0e7ff", fontSize: "11px", fontWeight: "550" } }
]);

// 霓虹灯
api.broadcastMessage([
    { str: "✈️", style: { color: "#d946ef", fontSize: "11px", fontWeight: "700" } },
    { str: " [AirBus] ", style: { color: "#06b6d4", fontSize: "11px", fontWeight: "700" } },
    { str: "[Linkin Park] ", style: { color: "#8b5cf6", fontSize: "11px", fontWeight: "700" } },
    { str: "Coder_Aurora: ", style: { color: "#2dd4bf", fontSize: "11px", fontStyle: "italic", fontWeight: "600" } },
    { str: chatMessage, style: { color: "#f0f9ff", fontSize: "11px", fontWeight: "500" } }
]);

// 蓝紫
api.broadcastMessage([
    { str: "✈️", style: { color: "#4f46e5", fontSize: "11px", fontWeight: "700" } },
    { str: " [AirBus] ", style: { color: "#2563eb", fontSize: "11px", fontWeight: "700" } },
    { str: "[Linkin Park] ", style: { color: "#7e22ce", fontSize: "11px", fontWeight: "700" } },
    { str: "Coder_Aurora: ", style: { color: "#4338ca", fontSize: "11px", fontStyle: "italic", fontWeight: "600" } },
    { str: chatMessage, style: { color: "#bfdbfe", fontSize: "11px", fontWeight: "500" } }
]);


// template
onPlayerChat = (playerId, chatMessage, channelName) => {
    const playerName = api.getEntityName(playerId);

    if (playerName === "Coder_Aurora") {
        api.broadcastMessage([
            { str: "✈️", style: { color: "#8b5cf6", fontSize: "11px", fontWeight: "700" } },
            { str: " [AirBus] ", style: { color: "#6366f1", fontSize: "11px", fontWeight: "700" } },
            { str: "[Linkin Park] ", style: { color: "#a855f7", fontSize: "11px", fontWeight: "700" } },
            { str: "Coder_Aurora: ", style: { color: "#818cf8", fontSize: "11px", fontStyle: "italic", fontWeight: "600" } },
            { str: chatMessage, style: { color: "#c7d2fe", fontSize: "11px", fontWeight: "550" } }
        ]);

        return false;
    }
};
