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
    const [QuestionTime, setQuestionTime] = useState("");
    const [solvedStatus, setSolvedStatus] = useState(false);
    const [reply, setReply] = useState("");
    const [replyList, setReplyList] = useState([]);

    const string_to_date = (Input_time) => {
      const time = new Date(Input_time)
      const year = time.getFullYear();
      const month = time.getMonth() + 1;
      const day = time.getDate();
  
      const hour = time.getHours();
      const minute = time.getMinutes();
      const second = time.getSeconds()
  
      return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }
  
    useEffect(() => {
      Axios.post(`${server_url}/get_BQ_detail`, {
        Input_time: Input_time,
        userId: menteeID,
      }).then((result) => {
        setQuestionContent(result.data[0].Content);
        setQuestionTitle(result.data[0].Title);
        setSolvedStatus(result.data[0].mentorCheck);
        setQuestionUserName(result.data[0].userName)
        setQuestionTime( string_to_date(Input_time));
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
          <div className="detailQ-solveBtn">
            {solvedStatus ? <h2>완료됨</h2>:<button className="submit-button" onClick={get_mentorCheck}>답변 완료하기</button>}
           
          </div>
        </div>
        <div className="detailQ-board">
          <div className="detailQ-question">
            <div className="detailQ-userinfo">
              <div className="detailQ-username">{QuestionUserName}</div>
              <div className="detailQ-inputime">{ QuestionTime }</div>
            </div>
            <div className="detailQ-content">{parse(QuestionContent)}</div>
          </div>
          {replyList.map((reply)=>(<Comment key={reply.Input_time} reply={reply} userId={menteeID} />))}
        </div>
        <div className="reply-section">
          <TextEditor setContent={setReply} />
          <button className="submit-button" onClick={save_reply}>댓글 등록하기</button>
        </div>
      </div>
    );
  };
  

export default MentorDetailQ