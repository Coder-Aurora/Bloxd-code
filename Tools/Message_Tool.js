var txt = {
    local: (playerId, ...msg) => {
        api.sendMessage(playerId, [
            { icon: "fa-solid fa-gear", style: { color: "#ff99cc", fontSize: "9px" } },
            { str: " [ ", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: "PRIVATE", style: { color: "#6c5ce7", fontWeight: "600", fontStyle: "italic" } },
            { str: " ]", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: ": ", style: { color: "#4facfe", fontWeight: "400", fontStyle: "normal" } },
            { str: msg.join(", "), style: { color: "#9d8cff", fontWeight: "500", fontStyle: "italic" } },
        ]);
    },

    global: (...msg) => {
        api.broadcastMessage([
            { icon: "fa-solid fa-user-astronaut", style: { color: "#ff99cc", fontSize: "9px" } },
            { str: " [ ", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: "GLOBAL", style: { color: "#b19cd9", fontWeight: "600", fontStyle: "italic" } },
            { str: " ]", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: ": ", style: { color: "#4facfe", fontWeight: "400", fontStyle: "normal" } },
            { str: msg.join(", "), style: { color: "#9d8cff", fontWeight: "500", fontStyle: "italic" } },
        ]);
    },

    local_warn: (playerId, ...msg) => {
        api.sendMessage(playerId, [
            { icon: "fa-solid fa-triangle-exclamation", style: { color: "#ff99cc", fontSize: "9px" } },
            { str: " [ ", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: "PRIVATE_WARN", style: { color: "#ff6eb4", fontWeight: "700", fontStyle: "italic" } },
            { str: " ]", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: ": ", style: { color: "#4facfe", fontWeight: "400", fontStyle: "normal" } },
            { str: msg.join(", "), style: { color: "#ed5f5f", fontWeight: "700", fontStyle: "italic" } },
        ]);
    },

    global_warn: (...msg) => {
        api.broadcastMessage([
            { icon: "fa-solid fa-user-unlock", style: { color: "#ff99cc", fontSize: "9px" } },
            { str: " [ ", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: "GLOBAL_ALERT", style: { color: "#ff6eb4", fontWeight: "700", fontStyle: "italic" } },
            { str: " ]", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
            { str: ": ", style: { color: "#4facfe", fontWeight: "400", fontStyle: "normal" } },
            { str: msg.join(", "), style: { color: "#ed5f5f", fontWeight: "700", fontStyle: "italic" } },
        ]);
    }
};
