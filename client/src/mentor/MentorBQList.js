import React from 'react'
import { Link } from "react-router-dom";

const MentorBQList = ({Input_time,Title,menteeID,userName,userID}) => {
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

    return (
      <Link to={`/mentor/${userID}/${menteeID}/DetailQ/${Input_time}`} className="BusinessQuestion">
                <div className='BusinessQuestion-Title'>{Title}</div>
                <div className='BusinessQuestion-UserName'>{userName}</div>
                <div className='BusinessQuestion-Time'>{ string_to_date(Input_time) }</div>
      </Link>
    )
  }

export default MentorBQList