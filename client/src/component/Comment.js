import React from 'react'
import parse from "html-react-parser";

const Comment = ({reply,userId}) => {
  return (
    <div className={reply.userId===userId ? "detailQ-question":"detailQ-comment"}>{reply.user}{parse(reply.Content)}</div>
  )
}

export default Comment