import axios from "axios";
import { useQuery } from "react-query";

const API_URL = "/user/get_profile";

const getUserProfile = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useGetUserProfile = () => {
  const { data, error, isLoading } = useQuery("userProfile", getUserProfile);

  return { data, error, isLoading };
};
