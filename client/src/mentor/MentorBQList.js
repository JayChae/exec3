import {React, useState} from 'react'
import { useInterval } from 'react-use';
import { Link } from "react-router-dom";

const MentorBQList = ({Input_time,Title,menteeID,userName,userID}) => {

  const [realTime, setRealTime] = useState(Date.now());

  useInterval(() => {
    setRealTime(Date.now());
  }, 1000);

  const string_to_date = (Input_time) => {
    const time = new Date(Input_time)
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();

    return year + "." + month + "." + day;
  }


  const elapsedTime = (date) => {
    const start = new Date(date);
    const end = realTime // 현재 날짜
    
    const diff = (end - start) / 1000; // 경과 시간
   
    const times = [
      { name: '년', milliSeconds: 60 * 60 * 24 * 365 },
      { name: '개월', milliSeconds: 60 * 60 * 24 * 30 },
      { name: '일', milliSeconds: 60 * 60 * 24 },
      { name: '시간', milliSeconds: 60 * 60 },
      { name: '분', milliSeconds: 60 },
    ];
    
    // 년 단위부터 알맞는 단위 찾기
    for (const value of times) {
      const betweenTime = Math.floor(diff / value.milliSeconds);
      
      // 큰 단위는 0보다 작은 소수 단위 나옴
      if (betweenTime > 0) {
        if (value.name === '시간' || value.name === '분') {
          return `${betweenTime}${value.name} 전`;
        }
        else{
          return string_to_date(date);
        }
      }
    }
    
    // 모든 단위가 맞지 않을 시
    return "방금 전";
  }

    return (
      <Link to={`/mentor/${userID}/${menteeID}/DetailQ/${Input_time}`} className="BusinessQuestion">
                <div className='BusinessQuestion-Title'>{Title}</div>
                <div className='BusinessQuestion-UserName'>{userName}</div>
                <div className='BusinessQuestion-Time'>{ elapsedTime(Input_time) }</div>
      </Link>
    )
  }

export default MentorBQList