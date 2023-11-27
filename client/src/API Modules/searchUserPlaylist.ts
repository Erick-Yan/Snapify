import axios from "axios";

export const getUserPlaylist = async () => {
    try {
        const response = await axios.get(`/user/get_playlist`);
        return response.data;
    } catch (error) {
        throw error;
    }
};