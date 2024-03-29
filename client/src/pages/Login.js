import React from "react";
import { useState } from "react";
import {Link,} from 'react-router-dom';
import { server_url } from '../config/url';
import background from '../icon/exec-bg.png'
import Axios from 'axios'
import '../CSS/login.css'

const Login = () => {

  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [errMessage, setErrMessage] = useState("");
  Axios.defaults.withCredentials = true;

  const login = (event) => {
    event.preventDefault();
    Axios.post(`${server_url}/api/login`, {
      inputId: inputId,
      inputPw: inputPw,
    }).then((response) => {
      console.log(response);
      if (response.data.errMessage) {
        setErrMessage(response.data.errMessage);
      } 
      else {
        if(response.data[0].user_type==="mentee"){
          document.location.href = `/${response.data[0].user_id}/QA`;
        }else{document.location.href = `/mentor/${response.data[0].user_id}/QA`;}
      }
    });
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${background})`}}>
      <div className="login-section">
        <div className="login-title">로그인</div>
        <form onSubmit={login}>
          <input
            type="text"
            className="login-form"
            onChange={(e) => {
              setInputId(e.target.value);
            }}
            required
            placeholder="이메일"
          />
          <input
            type="password"
            className="login-form"
            onChange={(e) => {
              setInputPw(e.target.value);
            }}
            required
            placeholder="비밀번호"
          />
          <p>{errMessage}</p>
            <button
              type="submit"
              className="login-btn"
            >
              로그인
            </button>
          <div className="register-link">
            <Link to="/register">회원가입</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
