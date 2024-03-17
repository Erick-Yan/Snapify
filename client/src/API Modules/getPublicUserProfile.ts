import axios from "axios";
import { useQuery } from "react-query";

const getPublicUserProfile = async (payload) => {
  try {
    console.log(payload["user_page_id"])
    const response = await axios.get(`/user/get_public_profile?public_id=${payload["user_page_id"]}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useGetPublicUserProfile = (payload) => {
  const { data, error, isLoading } = useQuery("userPublicProfile", () => getPublicUserProfile(payload));

  return { data, error, isLoading };
};
