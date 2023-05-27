import {React, useState} from 'react'
import { useInterval } from 'react-use';
import { elapsedTime } from './realDate';
import { Link } from "react-router-dom";

const BQList = ({Input_time,Title,userId,UserName}) => {
  const [realTime, setRealTime] = useState(Date.now());

  useInterval(() => {
    setRealTime(Date.now());
  }, 1000);

  return (
    <Link to={`/${userId}/DetailQ/${Input_time}`} className="BusinessQuestion">
          <div className='BusinessQuestion-Title'>{Title}</div>
          <div className='BusinessQuestion-UserName'>{UserName}</div>
          <div className='BusinessQuestion-Time'>{ elapsedTime(Input_time, realTime) }</div>
    </Link>
    
  )
}

export default BQList