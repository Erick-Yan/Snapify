// AuthApi.js
import axios from "axios";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
// import jwt from 'jsonwebtoken';

const API_URL = "/auth/check_auth";

const checkAuth = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CheckAuthMutation = () => {
  const dispatch = useDispatch();

  return useMutation(() => checkAuth(), {
    onSuccess: (data) => {
      // const decoded = jwt.decode(data)
      // console.log(decoded)
      dispatch({ type: "LOGIN_SUCCESS", payload: { data } });
    },
  });
};
