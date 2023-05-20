import React from 'react'
import parse from "html-react-parser";

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

const Comment = ({reply,userId}) => {
  const date = string_to_date(reply.Input_time);

  return (
    <div className={reply.commenterId===userId ? "detailQ-question":"detailQ-comment"}>
      <div className="detailQ-userinfo">
        <div className="detailQ-username">{reply.commenterName}</div>
        <div className="detailQ-inputime">{ date }</div>
      </div>
      <div className="detailQ-content">{parse(reply.Content)}</div>
    </div>
  )
}

export default Comment