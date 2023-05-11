import { useEffect, useState } from "react";
import Axios from "axios";
import { server_url } from "../config/url";
import { Link } from "react-router-dom";

function Initial() {
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get(`${server_url}/api/login`).then((response) => {
      if (response.data.loggedIn === true) {
        if (response.data.user.user_type === "mentor") {
          document.location.href = `/mentor/${response.data.user.user_id}`;
        }
        document.location.href = `/${response.data.user.user_id}/QA`;
      }
    });
  }, []);

  return (
    <div
      className="initial-page">
      <div className="initial-description">
        <p className="initial-greeting">
          Welcome to exec
        </p>
        <p className="initial-instruction">
          Log in with your EXEC account to continue
        </p>
      </div>
      <div className="initial-button">
        <Link to="/login">
          <button>로그인</button>
        </Link>
        <Link to="/register">
          <button>회원가입</button>
        </Link>
      </div>
    </div>
  );
}

export default Initial;
