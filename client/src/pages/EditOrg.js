import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BsSave2 } from "react-icons/bs";
import InteractiveOrgChart from "../component/InteractiveChart";
import Axios from "axios";
import { server_url } from "../config/url";

const EditOrg = () => {
  const { userId, currentDate } = useParams("");
  const [treeTitle, setTreeTitle] = useState("");
  const [treeData, setTreeData] = useState({});

  useEffect(() => {
    Axios.post(`${server_url}/org_chart_date_change`, {
      date: currentDate,
      userId: userId,
    }).then((result) => {
      if (result.data.length > 0) {
        setTreeData(JSON.parse(result.data[0].TreeData));
        setTreeTitle(result.data[0].Title);
      }
    });
  }, []);

  const orgChart_edit = () => {
    Axios.post(`${server_url}/edit_orgChart`, {
      treeData: JSON.stringify(treeData),
      Date: currentDate,
      userId: userId,
      Title: treeTitle,
    }).then((response) => {
      if (response.data.errMessage) {
        alert(response.data.errMessage);
        console.log(response.data.err);
      } else {
        alert(response.data);
        window.close();
      }
    });
  };

  return (
    <>
      <div className="orgChart-datePick">
        <input
          className="treeTitle-input"
          onChange={(e) => setTreeTitle(e.target.value)}
          placeholder="제목 입력"
          defaultValue={treeTitle}
        ></input>
        <div className="orgChart-btn-div">
          <button className="orgChart-save-button" title="저장" onClick={orgChart_edit}>
            <BsSave2 size={25}/><text>저장</text>
          </button>
        </div>
      </div>
      <InteractiveOrgChart
        treeData={treeData}
        setTreeData={setTreeData}
        editState={true}
      />
    </>
  );
};

export default EditOrg;
