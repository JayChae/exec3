import { useEffect, useState } from "react";
import Axios from "axios";
import { server_url } from "../config/url";
import parse from "html-react-parser";
import TextEditor from "../component/TextEditor"
import Comment from "../component/Comment"
const MentorDetailQ = ({ Input_time, menteeID,userId }) => {
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
        userId: menteeID,
      }).then((result) => {
        setQuestionContent(result.data[0].Content);
        setQuestionTitle(result.data[0].Title);
        setSolvedStatus(result.data[0].mentorCheck);
        setQuestionUserName(result.data[0].userName)
        Axios.post(`${server_url}/get_BA_list`, {
          BQ: Input_time,
          userId: menteeID,
        }).then((result) => {
          console.log("result", result.data);
          setReplyList(result.data);
        });
      });
    }, []);
  
    const save_reply=()=>{
      Axios.post(`${server_url}/BQ_reply_mentor`, {
        BQ:Input_time,
        content: reply,
        input_time: new Date(),
        userId: menteeID,
      }).then((response) => {
        if (response.data.errMessage) {
          alert(response.data.errMessage);
          console.log(response.data.err);
        } else {
          alert(response.data);
          document.location.href = `/mentor/${userId}/${menteeID}/DetailQ/${Input_time}`;
        }
      });
  
    }
  
    const get_mentorCheck=()=>{
      Axios.post(`${server_url}/BQ_get_mentorCheck`, {
        BQ: Input_time,
        userId: menteeID,
      }).then((response) => {
        if (response.data.errMessage) {
          alert(response.data.errMessage);
          console.log(response.data.err);
        } else {
          alert(response.data);
          document.location.href = `/mentor/${userId}/${menteeID}/DetailQ/${Input_time}`;
        }
      });
  
    }
  
    return (
      <div className="detailQ-container">
        <div className="detailQ-header">
          <h1>{QuestionTitle}</h1>
          <p>{QuestionUserName}</p>
          <div className="detailQ-solveBtn">
            {solvedStatus ? <h2>완료됨</h2>:<button onClick={get_mentorCheck}>답변 완료하기</button>}
           
          </div>
        </div>
        <div className="detailQ-board">
          <div className="detailQ-question">
            {parse(QuestionContent)}</div>
          {replyList.map((reply)=>(<Comment key={reply.Input_time} reply={reply} userId={menteeID} />))}
        </div>
        <div className="reply-section">
          <TextEditor setContent={setReply} />
          <button onClick={save_reply}>댓글 등록하기</button>
        </div>
      </div>
    );
  };
  

export default MentorDetailQ