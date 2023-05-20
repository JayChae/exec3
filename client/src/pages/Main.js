import { useEffect, useState } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import SideBar from "../component/SideBar";
import BusinessQA from "../component/BusinessQA";
import OrgChart from "./OrgChart";
import NewBusinessQ from "../component/NewBusinessQ";
import DetailQ from "../component/DetailQ";
import { useParams } from "react-router-dom";


const Main = () => {

  const {userId,selectMenu,Input_time } = useParams("");

  return (
    <div className="main-page">
      <div className="main">
      <ProSidebarProvider>
        <SideBar/>
      </ProSidebarProvider>
        {(() => {
          switch(selectMenu){
            case 'QA': return <BusinessQA/>;
            case 'OrgChart': return <OrgChart />;
            case 'newBusinessQ': return <NewBusinessQ/>;
            case 'DetailQ': return <DetailQ Input_time={Input_time} userId={userId}/>;
            default: return null;
          }
        })()}
      </div>
    </div>
  );
};

export default Main;

