import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { server_url } from "../config/url";
import MentorBQList from "./MentorBQList";
import { Link } from "react-router-dom";

const MentorBusinessQA = () => {
  const { userId } = useParams("");
  const [BQ_unsolved, setBQ_unsolved] = useState([]);
  const [BQ_solved, setBQ_solved] = useState([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    Axios.get(`${server_url}/get_unsolved_BQ_list_mentor`, {
      params: { userId },
    }).then((result) => {
      console.log("result un", result.data);
      setBQ_unsolved(result.data);
    });
    Axios.get(`${server_url}/get_solved_BQ_list_mentor`, {
      params: { userId },
    }).then((result) => {
      console.log("result", result.data);
      setBQ_solved(result.data);
    });
  }, []);

  return (
    <div className="BusinessQA-container">
      <div className="BusinessQA-header">
        <h1>질답 현황</h1>
      </div>
      <div className="BusinessQA-board">
        <div className="BusinessQA-board-statusBtn">
          <button
            className={solved ? "status" : "status-chosen"}
            onClick={() => {
              setSolved(false);
            }}
          >
            미답변
          </button>
          <button
            className={solved ? "status-chosen" : "status"}
            onClick={() => {
              setSolved(true);
            }}
          >
            답변
          </button>
        </div>
        <div className="BusinessQA-board-list">
          {solved
            ? BQ_solved.map((question) => (
                <MentorBQList
                  key={question.Input_time}
                  Input_time={question.Input_time}
                  Title={question.Title}
                  menteeID={question.userId}
                  userName={question.userName}
                  userID={userId}
                />
              ))
            : BQ_unsolved.map((question) => (
                <MentorBQList
                  key={question.Input_time}
                  Input_time={question.Input_time}
                  Title={question.Title}
                  menteeID={question.userId}
                  userName={question.userName}
                  userID={userId}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default MentorBusinessQA;
