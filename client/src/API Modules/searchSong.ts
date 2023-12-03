import axios from "axios";
import { useQuery } from "react-query";

export const getSpotifySong = async (track) => {
    try {
        const response = await axios.get(`/user/get_track?track=${track}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};