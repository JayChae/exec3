import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { server_url } from "../config/url";
import BQList from "./BQList";
import { Link } from "react-router-dom";
const BusinessQA = () => {
  const [solved, setSolved] = useState(false);
  const { userId } = useParams("");
  const [BQ_unsolved, setBQ_unsolved] = useState([]);
  const [BQ_solved, setBQ_solved] = useState([]);

  
  useEffect(() => {
    Axios.get(`${server_url}/get_unsolved_BQ_list`, { params: { userId } }).then((result) => {
      console.log("result", result.data);
      setBQ_unsolved(result.data);
    });
    Axios.get(`${server_url}/get_solved_BQ_list`, { params: { userId } }).then((result) => {
      console.log("result", result.data);
      setBQ_solved(result.data);
    });
  }, []);

  return (
    <div className="BusinessQA-container">
      <div className="BusinessQA-header">
        <h2>업무 현황</h2>
      </div>
      <div className="BusinessQA-addBtn">
        <Link to={`/${userId}/newBusinessQ`}>
          <button>업무 등록하기</button>
        </Link>
      </div>
      <div className="BusinessQA-board">
        <div className="BusinessQA-board-statusBtn">
          <button
            className={solved ? "" : "chosen"}
            onClick={() => {
              setSolved(false);
            }}
          >
            미해결
          </button>
          <button
            className={solved ? "chosen" : ""}
            onClick={() => {
              setSolved(true);
            }}
          >
            해결
          </button>
        </div>
        <div className="BusinessQA-board-list">
          {solved? BQ_solved.map((question) => (
            <BQList
              key={question.Input_time}
              Input_time={question.Input_time}
              Title={question.Title}
              userId={userId}
            />
          )):BQ_unsolved.map((question) => (
            <BQList
              key={question.Input_time}
              Input_time={question.Input_time}
              Title={question.Title}
              userId={userId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessQA;
