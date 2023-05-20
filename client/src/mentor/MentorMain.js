import { useEffect, useState } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import MentorSideBar from "./MentorSideBar";
import { useParams } from "react-router-dom";
import MentorBusinessQA from "./MentorBusinessQA";
import MentorDetailQ from "./MentorDetailQ";


const MentorMain = () => {

  const {userId,selectMenu,Input_time,menteeID } = useParams("");

  return (
    <div className="main-page">
      <div className="main">
        <ProSidebarProvider>
          <MentorSideBar/>
        </ProSidebarProvider> 
        {(() => {
          switch(selectMenu){
            case 'QA': return <MentorBusinessQA/>;
            case 'DetailQ': return <MentorDetailQ Input_time={Input_time} menteeID={menteeID} userId={userId}/>;
            default: return null;
          }
        })()}
      </div>
    </div>
  );
};

export default MentorMain;

