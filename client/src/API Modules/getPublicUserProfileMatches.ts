import axios from "axios";
import { useQuery } from "react-query";

const getPublicUserProfileMatches = async (payload) => {
  try {
    const response = await axios.get(`/user/get_public_profile_matches?public_id=${payload["user_page_id"]}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useGetPublicUserProfileMatches = (payload) => {
  const { data, error, isLoading } = useQuery("userPublicProfileMatches", () => getPublicUserProfileMatches(payload));

  return { data, error, isLoading };
};
