import {useState } from "react";
import {Link} from 'react-router-dom';
import Axios from 'axios'
import { server_url } from "../config/url";
import {isEmail, isLength,isAscii} from 'validator';
import background from '../icon/exec-bg.png'


function Register(){
    const [inputName, setInputName] = useState("");
    const [inputId, setInputId] = useState("");
    const [inputPw, setInputPw] = useState("");
   

    const [checkPwMessage, setCheckPwMessage] = useState("");
    const [checkPwStatus,setCheckPwStatus] = useState(false);

    const [validateIdStatus,setValidateIdStatus] = useState(false);
    const [validateIdSMessage,setValidateIdMessage] = useState("");


    const [validateDuplicationStatus,setValidateDuplicationStatus] = useState(false);
    const [validateDuplicationMessage,setValidateDuplicationMessage] = useState("");

    const [validatePwStatus,setValidatePwStatus] = useState(false);
    const [validatePwSMessage,setValidatePwMessage] = useState("");

    const [validateEmailStatus,setValidateEmailStatus] = useState(false);
    



    Axios.defaults.withCredentials = true;

    const register = ()=>{
        if(checkPwStatus&&validateIdStatus&&validateDuplicationStatus&&validatePwStatus&&validateEmailStatus)
        {
            Axios.post(`${server_url}/api/register`,{
                inputName:inputName,
                inputId:inputId,
                inputPw:inputPw,
            }).then((response)=>{
                if(response.data.err_message)
                {
                  alert("회원가입이 불가합니다");
                }
                else{
                    alert("회원가입이 완료되었습니다.")
                    document.location.href = "/login";
                }
            });
        }
        else
        {
           alert("입력이 완성되지 않았습니다");
        }
        

    };

    const duplication_check = () => {
      Axios.post(`${server_url}/api/register/duplication_check`, {
        inputId: inputId,
      }).then((response) => {
        if (response.data.length>0) {
          setValidateDuplicationMessage("사용 중인 아이디");
          setValidateDuplicationStatus(false);
        } else {
          setValidateDuplicationMessage("사용 가능한 아이디");
          setValidateDuplicationStatus(true);
          const childWindow = window.open(`/auth/${inputId}`, 'window_name', 'width=430,height=300,location=no,status=no,scrollbars=yes');
        }
      });
    };

  
    window.email_verified = ()=> {
      console.log("verified");
      setValidateEmailStatus(true);
      setValidateDuplicationMessage("인증이 완료되었습니다");
    }

    return (
        <div className="register-page" style={{ backgroundImage: `url(${background})`}}>
            <div className="register-section">
              <h1>계정 생성</h1>
                <input
                  type="text"
                  className="register-form"
                  onChange={(e) => {
                    setInputName(e.target.value);
                  }}
                  placeholder="성함"
                />
                <input
                  type="text"
                  className="register-form"
                  onChange={(e) => {
                    if(isEmail(e.target.value)){
                      setValidateIdMessage('')
                      setInputId(e.target.value);
                      setValidateIdStatus(true);
                    }
                    else{
                      setValidateIdStatus(false);
                      setValidateIdMessage("올바른 이메일 형식이 아닙니다")
                    }
                  }}
                  placeholder="이메일"
                />
                {validateIdSMessage ? <p>{validateIdSMessage}</p> : null}
                  <button
                  onClick={duplication_check}
                  className="id-duplication-check-button">이메일 중복 확인하기
                  </button>
                  {validateDuplicationMessage ? <p>{validateDuplicationMessage}</p> : null}
                <input
                  type="text"
                  className="register-form"
                  onChange={(e) => {
                    if(isAscii(e.target.value)&&isLength(e.target.value,{min:3, max: 15})){
                      setValidatePwMessage('')
                      setInputPw(e.target.value);
                      setValidatePwStatus(true);
                    }
                    else{
                      setValidatePwStatus(false);
                      setValidatePwMessage("3~15 글자의 알파벳,숫자,특수문자")
                      
                    }
                  }}
                  placeholder="비밀번호"
                />
                {validatePwSMessage ? <p>{validatePwSMessage}</p> : null}
                <input
                  type="text"
                  className="register-form"
                  onChange={(e) => {
                    if(e.target.value===inputPw){
                      setCheckPwMessage('비밀번호가 일치합니다')
                      setCheckPwStatus(true);
                    }
                    else{
                      setCheckPwMessage('비밀번호가 일치하지 않습니다')
                      setCheckPwStatus(false);
                    }
                  }}
                  placeholder="비밀번호 확인"
                />
                {checkPwMessage ? <p>{checkPwMessage}</p> : null}
              <div className="register_in">
                <button onClick={register} className="register-btn">가입하기</button>
              </div>
              <div className="reg-go-login">
                <Link to="/login">로그인하러 가기</Link>
              </div>
            </div>

        </div>

    );
}
export default Register;