import React from "react";
import { useState } from "react";
import {Link,} from 'react-router-dom';
import { server_url } from '../config/url';
import Axios from 'axios'

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
    <div className="login-page">
      <div className="login-section">
        <div className="login-title">LOGIN</div>
        <form onSubmit={login}>
          <div className="login-form">
            <input
              type="text"
              onChange={(e) => {
                setInputId(e.target.value);
              }}
              required
              placeholder="아이디: 이메일을 입력해 주세요"
            />
          </div>
          <div className="login-form">
            <input
              type="password"
              onChange={(e) => {
                setInputPw(e.target.value);
              }}
              required
              placeholder="비밀번호"
            />
          </div>
          <p>{errMessage}</p>
          <div className="register-btn">
            <Link to="/register">회원가입</Link>
          </div>
          <div className="login-button">
            <button
              type="submit"
              className="login-btn"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
    
  );
};

export default Login;
