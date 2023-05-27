import {React, useState} from 'react'
import parse from "html-react-parser";
import { useInterval } from 'react-use';
import { elapsedFullTime } from './realDate';
import Axios from "axios";
import { server_url } from "../config/url";
const Comment = ({reply,mentee,userId}) => {
  const [realTime, setRealTime] = useState(Date.now());

  useInterval(() => {
    setRealTime(Date.now());
  }, 1000);

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
    <div className={reply.commenterId===mentee ? "detailQ-question":"detailQ-comment"}>
      <div className="detailQ-userinfo">
        <div className="detailQ-username">{reply.commenterName}</div>
        <div className="detailQ-inputime">{ elapsedFullTime(reply.Input_time, realTime) }</div>
        {reply.commenterId===userId ?(<div className="detailQ-delete" onClick={delete_reply}>삭제</div>):(<></>)}
      </div>
      <div className="detailQ-content">{parse(reply.Content)}</div>
    </div>
  )
}

export default Comment