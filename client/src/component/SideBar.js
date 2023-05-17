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
import { BiChat, BiGroup, BiCreditCard, BiBriefcase, BiBulb, BiStoreAlt, BiSitemap, BiUser } from "react-icons/bi";

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
        <a href={`/`}>
          <img src={exec_logo} className="logo" />
        </a>
      </div>

      <Menu>
        <MenuItem icon={<BiChat/>} component={<Link to={`/${userId}/QA`} />}> 업무 등록하기 </MenuItem>
        <SubMenu icon={<BiGroup/>} label="팀">
          <MenuItem icon={<BiSitemap/>} component={<Link to={`/${userId}/OrgChart`} />}> 조직도 </MenuItem>
          <MenuItem icon={<BiUser/>}> 팀원 정보 </MenuItem>
        </SubMenu>
        <MenuItem icon={<BiBulb/>}> 액셀코칭 </MenuItem>
        <MenuItem icon={<BiStoreAlt/>}> 경영지원 </MenuItem>
        <MenuItem icon={<BiBriefcase/>}> 비즈니스 </MenuItem>
        <MenuItem icon={<BiCreditCard/>}> 결제 </MenuItem>
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
