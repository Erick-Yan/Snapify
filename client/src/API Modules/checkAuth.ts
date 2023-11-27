import axios from "axios";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import jwt from 'jwt-decode';
import {jwtToken} from '../types'

const API_URL = "/auth/check_auth";

const checkAuth = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log(response)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CheckAuthMutation = () => {
  const dispatch = useDispatch();

  return useMutation(() => checkAuth(), {
    onSuccess: (data) => {
      const token:jwtToken = jwt(data)
      if (token["user_id"] && token["token"] && token["expiration"] !== -1) {
        console.log("Logging you in")
        dispatch({ type: "LOGIN_SUCCESS", payload: { token } });
      }
    },
  });
};
