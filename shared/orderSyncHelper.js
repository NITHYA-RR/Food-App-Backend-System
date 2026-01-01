import axios from "axios";

export const syncOrder = async (targetServer, data) => {
    if (!targetServer) return;

    try {
        await axios.post(`${targetServer}/orders/sync`, data);
        console.log("Order synced");
    } catch (err) {
        console.log("Sync failed:", err.message);
    }
};