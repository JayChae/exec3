import Axios from "axios";
import { server_url } from "../config/url";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import TextEditor from "./TextEditor";

function NewBusinessQ() {
  const { userId } = useParams("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");



  const mission_save = () => {
    Axios.post(`${server_url}/new_BQ`, {
      title: title,
      content: content,
      input_time: new Date(),
      userId: userId,
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
        <h3 className="write-header">업무 등록하기 </h3>
        <div className="write-btn">
          <a className="write-reg" onClick={mission_save}>
            등록
          </a>
        </div>
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
