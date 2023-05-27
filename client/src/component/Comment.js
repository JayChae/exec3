import {React, useState} from 'react'
import parse from "html-react-parser";
import { useInterval } from 'react-use';
import { elapsedFullTime } from './realDate';

const Comment = ({reply,userId}) => {
  const [realTime, setRealTime] = useState(Date.now());

  useInterval(() => {
    setRealTime(Date.now());
  }, 1000);

  return (
    <div className={reply.commenterId===userId ? "detailQ-question":"detailQ-comment"}>
      <div className="detailQ-userinfo">
        <div className="detailQ-username">{reply.commenterName}</div>
        <div className="detailQ-inputime">{ elapsedFullTime(reply.Input_time, realTime) }</div>
        <div className="detailQ-edit">수정</div>
        <div className="detailQ-delete">삭제</div>
      </div>
      <div className="detailQ-content">{parse(reply.Content)}</div>
    </div>
  )
}

export default Comment