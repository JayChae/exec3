import Axios from "axios";
import { server_url } from "../config/url";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TextEditor from "./TextEditor";

function NewBusinessQ() {
  Axios.defaults.withCredentials = true;
  const { userId } = useParams("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    Axios.get(`${server_url}/api/login`).then((response) => {
      console.log("벡엔드 연결했다");
      if (response.data.loggedIn === true)
      {
        setUserName(response.data.user.user_name)
      }
      else
      {
        document.location.href = "/login";
      }
    });
  }, []);



  const mission_save = () => {
    Axios.post(`${server_url}/new_BQ`, {
      title: title,
      content: content,
      input_time: new Date(),
      userId: userId,
      userName: userName
    }).then((response) => {
      if (response.data.errMessage) {
        alert(response.data.errMessage);
        console.log(response.data.err);
      } else {
        alert(response.data);
        document.location.href = `/${userId}/QA`;
      }
    });
  };

  return (
    <div className="newBusinessQ-container">
      <div className="newBusinessQ-header">
        <h1 className="write-header">질문 등록</h1>
        {content ? <button className="submit-button" onClick={mission_save}>등록</button> : <button className="unable-button">등록</button>}
      </div>
      <div className="write-title">
        <input
          type="text"
          placeholder="TITLE를 입력해 주세요"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      <div className="editor">
        <TextEditor setContent={setContent} />
      </div>
    </div>
  );
}

export default NewBusinessQ;
