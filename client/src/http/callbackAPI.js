import { $host } from "./index.js";

/**
 * @param {{ name: string, phone: string, comment?: string }} data
 * @returns {Promise<{ message: string }>}
 */
export const sendCallback = async (data) => {
    const { data: res } = await $host.post("/callback", data);
    return res;
};