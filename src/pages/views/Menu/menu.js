import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoginPolicy from "../../../environments/config.json";

import RootLayout from "../../../components/main";
import PasswordChange from "./passwordChange";
import UserList from "./userList";
import ManagerList from "./employeeList";
import OrganizationList from "./organizationList";
import LogList from "./logList";
import EntityUpdate from "./entityUpdate";

export default function Menu() {
  // environmentsから取得
  const isLoginEnabled = LoginPolicy.system.policy.login;
  
  const [isPassChangeDialog, setShowPassChangeDialog] = useState(false);
  const [isUserListDialog, setShowUserListDialog] = useState(false);
  const [isManagerListDialog, setShowManagerListDialog] = useState(false);
  const [isOrganizationListDialog, setShowOrganizationListDialog] = useState(false);
  const [isLogDialog, setShowLogDialog] = useState(false);
  const [isEntityUpdateDialog, setEntityUpdateDialog] = useState(false);
  // router
  const router = useRouter();

  //パスワード変更ボタン押す時
  const showPassChangeDialog = (e) => {
    setShowPassChangeDialog(true);
    setShowUserListDialog(false);
    setShowManagerListDialog(false);
    setShowOrganizationListDialog(false);
    setShowLogDialog(false);
  };

  //ユーザー管理ボタン押す時
  const showUserListDialog = (e) => {
    setShowUserListDialog(true);
    setShowPassChangeDialog(false);
    setShowManagerListDialog(false);
    setShowOrganizationListDialog(false);
    setShowLogDialog(false);
  };

   //担当者ー管理ボタン押す時
   const showManagerListDialog = (e) => {
    setShowManagerListDialog(true);
    setShowUserListDialog(false);
    setShowPassChangeDialog(false);
    setShowOrganizationListDialog(false);
    setShowLogDialog(false);
  };

  //部署ー管理ボタン押す時
  const showOrganizationListDialog = (e) => {
    setShowOrganizationListDialog(true);
    setShowManagerListDialog(false);
    setShowUserListDialog(false);
    setShowPassChangeDialog(false);
    setShowLogDialog(false);
  };

  const showLogDialog = (e) => {
    setShowLogDialog(true);
    setShowOrganizationListDialog(false);
    setShowManagerListDialog(false);
    setShowUserListDialog(false);
    setShowPassChangeDialog(false);
  };

  //エンティティ更新ボタン押す時
  const showEntityUpdateDialog = (e) => {
    setEntityUpdateDialog(true);
    setshowOrganizationListDialog(false);
    setShowManagerListDialog(false);
    setShowUserListDialog(false);
    setShowPassChangeDialog(false);
  };

  return (
    <RootLayout top={!isLoginEnabled}>
      <div className="sidebar">
        <h1><i className="bi bi-list"></i>&nbsp;メニュー</h1>
        <a href="#" onClick={showOrganizationListDialog}><i className="bi bi-building-fill"></i>&nbsp;組織管理</a>
        <a href="#" onClick={showManagerListDialog}><i className="bi bi-person-workspace"></i>&nbsp;担当者管理</a>
        <a href="#" onClick={showLogDialog}><i className="bi bi-mic-fill"></i>&nbsp;通話ログ管理</a>
        <a href="#" onClick={showUserListDialog}><i className="bi bi-person-fill"></i>&nbsp;ユーザー管理</a>
        <a href="#" onClick={showPassChangeDialog}><i className="bi bi-unlock-fill"></i>&nbsp;パスワード変更</a>
      </div>
      {(!isPassChangeDialog && !isUserListDialog && !isManagerListDialog 
        && !isOrganizationListDialog && !isLogDialog && !isEntityUpdateDialog) && (
          <div className="body-wrapper01">
              <div className="container-fluid">
              {/* <p className="fs-5">メニューより操作してください。</p> */}
            </div>
          </div>
      )}
        {
          isPassChangeDialog && (
            <PasswordChange></PasswordChange>
          )
        }
        {
          isUserListDialog && (
            <div className="body-wrapper02">
              <div className="container-fluid">
                <UserList></UserList>
              </div>
            </div>
          )
        }
        {
          isManagerListDialog && (
            <div className="body-wrapper02">
              <div className="container-fluid">
              <ManagerList></ManagerList>
              </div>
            </div>
          )
        }
        {
          isOrganizationListDialog && (
            <div className="body-wrapper02">
              <div className="container-fluid">
                <OrganizationList></OrganizationList>
              </div>
            </div>
          )
        }
        {
          isLogDialog && (
            <LogList></LogList>
          )
        }
        {
          isEntityUpdateDialog && (
            <div className="body-wrapper02">
              <div className="container-fluid">
                <EntityUpdate></EntityUpdate>
              </div>
            </div>
          )
        }
    </RootLayout>
  );
}
