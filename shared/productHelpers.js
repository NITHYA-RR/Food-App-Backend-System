import axios from "axios";

// ======================Product Validation========================

export const validationProduct = ({ name , price }) => {
    if(!name || name.trim() === "") return "Product name required";
    if(!price || price <= 0) return "Price must be greater than 0";
}


//=======================Product Sync================================
export const syncProduct = async (targetServer, data) => {
    console.log(targetServer, data,"DATA");
    try {
        await axios.post(`${targetServer}/products/sync`, data);
        console.log("Product synced");
    } catch (err) {
        console.log("Sync failedS:", err.message);
    }
};
