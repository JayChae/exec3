import React,{useState,useEffect} from 'react'
import {useParams} from 'react-router-dom';
import Axios from 'axios'
import { server_url } from "../config/url";
const Auth = () => {

    const [inputCode, setInputCode] = useState('');
    const [authCode, setAuthCode] = useState('');
    const {inputId} = useParams();


  
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log("authCode",authCode)
      if(inputCode===authCode){
        alert("인증이 완료되었습니다.")
        window.opener.email_verified();
        window.close();
      }
      else{
        alert("코드가 일치하지 않습니다.")
      }
     
    }
    const getAuthCode = (event) => {
        Axios.post(`${server_url}/api/register/nodemailer`, {
            inputId: inputId,
          }).then((response) => {
            alert("인증번호 메일을 전송했습니다. 확인해주세요");
            if(response.data.sendMail){
                setAuthCode(response.data.authCode)
            }
          })
     
    }

  return (
    <div className='auth-page'>
        <div className='auth-container'>
            <form onSubmit={handleSubmit}>
                <label>
                    인증번호:
                    <input type="text" value={inputCode} onChange={(event)=>{setInputCode(event.target.value);}} />
                </label>
                <button type="submit">인증하기</button>
            </form>
        </div>
        <div className='get-auhCode-container'>
            <a className='get-authCode'  onClick={getAuthCode}>이메일 인증번호 받기</a>
        </div>
    </div>
  )
}

export default Auth