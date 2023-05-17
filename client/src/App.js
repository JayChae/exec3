import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Initial from "./pages/Initial";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import Main from "./pages/Main";
import NewOrg from "./pages/NewOrg";
import EditOrg from "./pages/EditOrg";
import MentorMain from "./mentor/MentorMain"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Initial />} />
        <Route exact path="/mentor/:userId/:selectMenu" element={<MentorMain />} />
        <Route exact path="/mentor/:userId/:selectMenu/:Input_time" element={<MentorMain />} />
        <Route exact path="/mentor/:userId/:menteeID/:selectMenu/:Input_time" element={<MentorMain />} />
        <Route exact path="/:userId" element={<Main />} />
        <Route exact path="/:userId/:selectMenu" element={<Main />} />
        <Route exact path="/:userId/:selectMenu/:Input_time" element={<Main />} />
        <Route exact path="/login" element= {<Login />} />
        <Route path="/register" element={<Register />} />
        <Route exact path="/auth/:inputId" element={<Auth />} />
        <Route exact path="/:userId/new_org" element={<NewOrg />} />
        <Route exact path="/:userId/:currentDate/edit_org" element={<EditOrg />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
