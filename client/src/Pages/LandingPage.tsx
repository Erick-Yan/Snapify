import React, {useEffect} from "react";
import { CheckAuthMutation } from "../API Modules/checkAuth";

function LandingPage() {
  const LOGIN_URI = "/auth/login";
  const LOGOUT_URI = "/auth/logout";

  const { mutate: checkAuth, isLoading, isError, error } = CheckAuthMutation();

  const handleCheckAuth = () => {
    checkAuth()
  }

  return (
    <div>
      <h1>Snapify</h1>
      <a href={LOGIN_URI}>LOGIN</a>
      <a onClick={handleCheckAuth}>LOGOUT</a>
    </div>
  );
}

export default LandingPage;
