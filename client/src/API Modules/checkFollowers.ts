import axios from "axios";
import { useQuery } from "react-query";

const checkFollowers = async () => {
  try {
    const response = await axios.get(`/user/check_followers`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useCheckFollowers = () => {
  const { data, error, isLoading } = useQuery("userCheckFollowers", () => checkFollowers());

  return { data, error, isLoading };
};
