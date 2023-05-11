import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InteractiveOrgChart from "../component/InteractiveChart";
import Axios from "axios";
import { server_url } from "../config/url";
import { BsSave2 } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";

const NewOrg = () => {
  const { userId } = useParams("");
  const [treeTitle, setTreeTitle] = useState("");
  const [treeData, setTreeData] = useState({
    id: "rootNode",
    name: "대표 이름",
    state: "CEO",
    description: "직무",
    department: "회사 이름",
    type: "department",
    children: [
      {
        id: uuidv4(),
        name: "직원 이름",
        state: "직위/직급",
        description: "직무",
        department: "부서",
        type: "employee",
        children: [],
      },
          {
            id: uuidv4(),
            name: "리더 이름",
            state: "직위/직급",
            description: "직무",
            department: "부서",
            type: "leader",
            children: [],
          },
    ],
  });

  useEffect(() => {
    Axios.get(`${server_url}/recent_org_chart`, { params: { userId } }).then(
      (result) => {
        if (result.data.length > 0) {
          setTreeData(JSON.parse(result.data[0].TreeData));
        }
      }
    );
  }, []);

  const orgChart_save = () => {
    const TIME_ZONE = 9 * 60 * 60 * 1000;
    const day = new Date(Date() + TIME_ZONE).toISOString().split("T")[0];
    const time = new Date().toTimeString().split(" ")[0];
    const fullDate = day + " " + time;
    const Title = treeTitle === "" ? fullDate : treeTitle;

    console.log("test" + Title)

    Axios.post(`${server_url}/new_orgChart`, {
      treeData: JSON.stringify(treeData),
      Date: fullDate,
      userId: userId,
      Title: Title,
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
          onChange={(e) => {
            console.log(e.target.value);
            setTreeTitle(e.target.value)}}
          placeholder="제목 입력"
        ></input>
        <div className="orgChart-btn-div">
          <button className="orgChart-save-button" title="저장" onClick={orgChart_save}>
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

export default NewOrg;
