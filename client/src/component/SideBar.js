import { useEffect, useState } from "react";
import settings_icon from "../icon/settings.png";
import exec_logo from "../icon/exec2.png";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Axios from "axios";
import { server_url } from "../config/url";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";

const SideBar = () => {
  Axios.defaults.withCredentials = true;

  const { userId } = useParams("");

  const logout = () => {
    Axios.post(`${server_url}/logout`);
    document.location.href = "/login";
  };

  const [showLogout, setShowLogout] = useState(false);
  const toggleLogout = () => {
    setShowLogout((prevState) => !prevState);
  };

  return (
    <Sidebar className="sidebar-container">
      <div className="logo-section">
        <a href={`/${userId}`}>
          <img src={exec_logo} className="logo" />
        </a>
      </div>

      <Menu>
        <MenuItem icon={<></>} component={<Link to={`/${userId}/QA`} />}> 업무 등록하기 </MenuItem>
        <SubMenu icon={<></>} label="팀">
          <MenuItem icon={<></>} component={<Link to={`/${userId}/OrgChart`} />}> 조직도 </MenuItem>
          <MenuItem icon={<></>}> 팀원 정보 </MenuItem>
        </SubMenu>
        <MenuItem icon={<></>}> 액셀코칭 </MenuItem>
        <MenuItem icon={<></>}> 경영지원 </MenuItem>
        <MenuItem icon={<></>}> 비즈니스 </MenuItem>
        <MenuItem icon={<></>}> 결제 </MenuItem>
      </Menu>
      <div className="settings-container">
        <div className="settings" onClick={toggleLogout}>
          <img src={settings_icon} className="setting_icon" />
        </div>
        {showLogout && (
          <div className="logout-container">
            <p onClick={logout}>Log Out</p>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default SideBar;