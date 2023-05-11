import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InteractiveOrgChart from "../component/InteractiveChart";
import Axios from "axios";
import { server_url } from "../config/url";
import { RiFileAddLine, RiEdit2Line, RiDeleteBin5Line } from "react-icons/ri";

const OrgChart = () => {
  const { userId } = useParams("");
  const [chartList, setChartList] = useState([]);
  const [firstTime, setFirstTime] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [treeData, setTreeData] = useState({});

  useEffect(() => {
    Axios.get(`${server_url}/org_chart`, { params: { userId } }).then(
      (result) => {
        if (result.data.length > 0) {
          setTreeData(JSON.parse(result.data[0].TreeData));
          setCurrentDate(result.data[0].Date);
          setChartList(result.data);
        } else {
          setFirstTime(true);
        }
      }
    );
  }, []);

  const new_chart = () => {
    const editMode = window.open(
      `/${userId}/new_org`,
      "window_name",
      "width=1500,height=900,location=no,status=no,scrollbars=yes"
    );

    // Add an event listener to the editMode window
    editMode.onbeforeunload = () => {
      // Refresh the current window
      window.location.reload();
      
    };
  };

  const orgChart_edit = () => {
    const editMode = window.open(
      `/${userId}/${currentDate}/edit_org`,
      "window_name",
      "width=1500,height=900,location=no,status=no,scrollbars=yes"
    );

    // Add an event listener to the editMode window
    editMode.onbeforeunload = () => {
      // Refresh the current window
      window.location.reload();
    };
  };

  const orgChart_delete = () => {
    Axios.post(`${server_url}/delete_orgChart`, {
      Date: currentDate,
      userId: userId,
    }).then((response) => {
      if (response.data.errMessage) {
        alert(response.data.errMessage);
        console.log(response.data.err);
      } else {
        alert(response.data);
        document.location.href = `/${userId}`;
      }
    });
  };

  const select_change = (e) => {
    setCurrentDate(e.target.value);
    function findTree(element) {
      console.log("element.Date", element.Date);
      if (element.Date === e.target.value) {
        return true;
      }
    }
    const tree = chartList.find(findTree);
    setTreeData(JSON.parse(tree.TreeData));
  };

  return (
    <div className="orgChart-container">
      {firstTime ? (
        <div className="add-orgChart-please">
          <h2>조직도를 추가해주세요</h2>
          <button className="orgChart-button-first-add" onClick={new_chart}>
            <RiFileAddLine />
          </button>
        </div>
      ) : (
        <>
          <div className="orgChart-datePick">
            <select className="select-org" onChange={select_change}>
              {chartList.map((chart) => (
                <option key={chart.Date} value={chart.Date}>
                  {chart.Title}
                </option>
              ))}
            </select>
            <div className="orgChart-btn-div">
              <button
                className="orgChart-button"
                title="새로운 조직도"
                onClick={new_chart}
              >
                <RiFileAddLine size={25} />
                <text>새로운 조직도</text>
              </button>
              <button
                className="orgChart-button"
                title="편집"
                onClick={orgChart_edit}
              >
                <RiEdit2Line size={25} />
                <text>수정</text>
              </button>
              <button
                className="orgChart-button"
                title="삭제"
                onClick={orgChart_delete}
              >
                <RiDeleteBin5Line size={25} />
                <text>삭제</text>
              </button>
            </div>
          </div>
          <InteractiveOrgChart
            treeData={treeData}
            setTreeData={setTreeData}
            editState={false}
          />
        </>
      )}
    </div>
  );
};

export default OrgChart;
