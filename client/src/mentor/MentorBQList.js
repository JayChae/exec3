import React from 'react'
import { Link } from "react-router-dom";

const MentorBQList = ({Input_time,Title,menteeID,userName,userID}) => {
    return (
      <div className="BusinessQuestion">
          <Link to={`/mentor/${userID}/${menteeID}/DetailQ/${Input_time}`} >
              <div className='BusinessQuestion-Title'>{Title}</div>
          </Link>
         <div className='BusinessQuestion-UserName'>{userName}</div>
         <div className='BusinessQuestion-Time'>{Input_time}</div>
      </div>
    )
  }

export default MentorBQList