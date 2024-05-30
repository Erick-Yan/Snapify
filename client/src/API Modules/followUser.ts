import axios from "axios";
import { useQuery } from "react-query";

export const followUser = async (payload) => {
  try {
    const response = await axios.post(`/user/follow?public_id=${payload["user_page_id"]}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
