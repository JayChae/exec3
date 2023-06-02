import { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import Comment from "./Comment";
import Axios from "axios";
import { server_url } from "../config/url";
import parse from "html-react-parser";
import { elapsedFullTime } from "./realDate";
import { useInterval } from 'react-use';

const DetailQ = ({ Input_time, userId }) => {
  Axios.defaults.withCredentials = true;
  const [QuestionContent, setQuestionContent] = useState("");
  const [QuestionTitle, setQuestionTitle] = useState("");
  const [QuestionUserName, setQuestionUserName] = useState("");
  const [QuestionTime, setQuestionTime] = useState("");
  const [solvedStatus, setSolvedStatus] = useState(false);
  const [reply, setReply] = useState("");
  const [replyList, setReplyList] = useState([]);

  const [realTime, setRealTime] = useState(Date.now());

  useInterval(() => {
    setRealTime(Date.now());
  }, 1000);


  useEffect(() => {
    Axios.post(`${server_url}/get_BQ_detail`, {
      Input_time: Input_time,
      userId: userId,
    }).then((result) => {
      setQuestionContent(result.data[0].Content);
      setQuestionTitle(result.data[0].Title);
      setSolvedStatus(result.data[0].solved);
      setQuestionUserName(result.data[0].userName);
      setQuestionTime( Input_time);
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

  const delete_BQ=()=>{
    if (window.confirm("삭제하시겠습니까?")) {
      Axios.post(`${server_url}/BQ_delete`, {
        BQ: Input_time,
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
    }
    else{
      console.log("No delete");
    }
  }

  const delete_reply = ()=>{
    if (window.confirm("삭제하시겠습니까?")) {
      Axios.post(`${server_url}/delete_reply`, {
        BQ: reply.BQ,
        Input_time: reply.Input_time,
        userId: reply.userId,
      }).then((response) => {
        if (response.data.errMessage) {
          alert(response.data.errMessage);
          console.log(response.data.err);
        } else {
          alert(response.data);
          window.location.reload();
        }
      });
    }
    else{
      console.log("No delete");
    }
  }

  return (
    <div className="detailQ-container">
      <div className="detailQ-upload">
        <div className="detailQ-header">
          <h1>{"Q. " + QuestionTitle}</h1>
          {solvedStatus ? <h2>해결</h2>:<button className="complete-button" onClick={get_solved}>완료하기</button>}
        </div>
        <div className="detailQ-userinfo">
          <div className="detailQ-username-temp">{QuestionUserName}</div>
          <div className="detailQ-inputime-temp">{ elapsedFullTime(QuestionTime, realTime) }</div>
          <div className="detailQ-delete" onClick={delete_BQ}>질문 삭제</div>
        </div>
        
        <div className="detailQ-content">{parse(QuestionContent)}</div>
      </div>

      <div className="detailQ-board">
        {replyList.map((reply)=>(<Comment key={reply.Input_time} reply={reply} mentee={userId} userId={userId} />))}
      </div>
      <div className="reply-section">
        <TextEditor setContent={setReply} />
        {reply ? <button className="submit-button" onClick={save_reply}>댓글 등록</button> : <button className="unable-button">댓글 등록</button>}
      </div>
    </div>
  );
};

export default DetailQ;
