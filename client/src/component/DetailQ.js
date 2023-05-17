import { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import Comment from "./Comment";
import Axios from "axios";
import { server_url } from "../config/url";
import parse from "html-react-parser";

const DetailQ = ({ Input_time, userId }) => {
  Axios.defaults.withCredentials = true;
  const [QuestionContent, setQuestionContent] = useState("");
  const [QuestionTitle, setQuestionTitle] = useState("");
  const [QuestionUserName, setQuestionUserName] = useState("");
  const [solvedStatus, setSolvedStatus] = useState(false);
  const [reply, setReply] = useState("");
  const [replyList, setReplyList] = useState([]);

  useEffect(() => {
    Axios.post(`${server_url}/get_BQ_detail`, {
      Input_time: Input_time,
      userId: userId,
    }).then((result) => {
      setQuestionContent(result.data[0].Content);
      setQuestionTitle(result.data[0].Title);
      setSolvedStatus(result.data[0].solved);
      setQuestionUserName(result.data[0].userName)
      Axios.post(`${server_url}/get_BA_list`, {
        BQ: Input_time,
        userId: userId,
      }).then((result) => {
        console.log("result", result.data);
        setReplyList(result.data);
      });
    });
  }, []);

  const save_reply=()=>{
    Axios.post(`${server_url}/BQ_reply`, {
      BQ:Input_time,
      content: reply,
      input_time: new Date(),
      userId: userId,
    }).then((response) => {
      if (response.data.errMessage) {
        alert(response.data.errMessage);
        console.log(response.data.err);
      } else {
        alert(response.data);
        document.location.href = `/${userId}/DetailQ/${Input_time}`;
      }
    });

  }

  const get_solved=()=>{
    Axios.post(`${server_url}/BQ_get_solved`, {
      BQ: Input_time,
      userId: userId,
    }).then((response) => {
      if (response.data.errMessage) {
        alert(response.data.errMessage);
        console.log(response.data.err);
      } else {
        alert(response.data);
        document.location.href = `/${userId}/DetailQ/${Input_time}`;
      }
    });

  }

  return (
    <div className="detailQ-container">
      <div className="detailQ-header">
        <h1>{QuestionTitle}</h1>
        <p>{QuestionUserName}</p>
        {solvedStatus ? <h2>완료됨</h2>:<button className="submit-button" onClick={get_solved}>완료하기</button>}
      </div>
      <div className="detailQ-board">
        <div className="detailQ-question">
          {parse(QuestionContent)}</div>
        {replyList.map((reply)=>(<Comment key={reply.Input_time} reply={reply} userId={userId} />))}
      </div>
      <div className="reply-section">
        <TextEditor setContent={setReply} />
        <button className="submit-button" onClick={save_reply}>댓글 등록하기</button>
      </div>
    </div>
  );
};

export default DetailQ;
