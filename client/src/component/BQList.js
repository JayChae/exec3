import {React,useState} from 'react'
import { Link } from "react-router-dom";

const BQList = ({Input_time,Title,userId,UserName}) => {
  return (
    <div className="BusinessQuestion">
        <Link to={`/${userId}/DetailQ/${Input_time}`} >
            <div className='BusinessQuestion-Title'>{Title}</div>
        </Link>
       <div className='BusinessQuestion-UserName'>{UserName}</div>
       <div className='BusinessQuestion-Time'>{Input_time}</div>
    </div>
  )
}

export default BQList