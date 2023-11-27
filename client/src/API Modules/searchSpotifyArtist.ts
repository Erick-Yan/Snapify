import axios from "axios";
import { useQuery } from "react-query";

export const getSpotifyArtist = async (artist) => {
    try {
        const response = await axios.get(`/user/get_artist?artist=${artist}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};