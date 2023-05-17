import React from 'react'
import parse from "html-react-parser";

const Comment = ({reply,userId}) => {
  return (
    <div className={reply.commenterId===userId ? "detailQ-question":"detailQ-comment"}>{reply.commenterName}{parse(reply.Content)}</div>
  )
}

export default Comment