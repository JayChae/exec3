const string_to_date = (Input_time) => {
  const time = new Date(Input_time)
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();

  return year + "." + month + "." + day;
}

const string_to_fulldate = (Input_time) => {
  const time = new Date(Input_time)
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();

  const hour = time.getHours();
  const minutes = time.getMinutes();

  return year + "." + month + "." + day + " " + hour + ":" + minutes;
}

export const elapsedTime = (date, realTime) => {
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


export const elapsedFullTime = (date, realTime) => {
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
        return string_to_fulldate(date);
      }
    }
  }
  
  // 모든 단위가 맞지 않을 시
  return "방금 전";
}