import RootLayout from "../../../components/main";
import PasswordChange from "./passwordChange";
import UserList from "./userList";
import ManagerList from "./employeeList";
import OrganizationList from "./organizationList";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoginPolicy from "../../../environments/config.json";

export default function Menu() {
  // environmentsから取得
  const isLoginEnabled = LoginPolicy.system.policy.login;
  
  const [isPassChangeDialog, setShowPassChangeDialog] = useState(false);
  const [isUserListDialog, setShowUserListDialog] = useState(false);
  const [isManagerListDialog, setShowManagerListDialog] = useState(false);
  const [isOrganizationListDialog, setshowOrganizationListDialog] = useState(false);
  // router
  const router = useRouter();

  //パスワード変更ボタン押す時
  const showPassChangeDialog = (e) => {
    setShowPassChangeDialog(true);
    setShowUserListDialog(false);
    setShowManagerListDialog(false);
    setshowOrganizationListDialog(false);
  };

  //ユーザー管理ボタン押す時
  const showUserListDialog = (e) => {
    setShowUserListDialog(true);
    setShowPassChangeDialog(false);
    setShowManagerListDialog(false);
    setshowOrganizationListDialog(false);
  };

   //担当者ー管理ボタン押す時
   const showManagerListDialog = (e) => {
    setShowManagerListDialog(true);
    setShowUserListDialog(false);
    setShowPassChangeDialog(false);
    setshowOrganizationListDialog(false);
  };

  //部署ー管理ボタン押す時
  const showOrganizationListDialog = (e) => {
    setshowOrganizationListDialog(true);
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
        <a href="#"><i className="bi bi-mic-fill"></i>&nbsp;通話ログ管理</a>
        <a href="#" onClick={showUserListDialog}><i className="bi bi-person-fill"></i>&nbsp;ユーザー管理</a>
        <a href="#" onClick={showPassChangeDialog}><i className="bi bi-unlock-fill"></i>&nbsp;パスワード変更</a>
      </div>
      {(!isPassChangeDialog && !isUserListDialog && !isManagerListDialog && !isOrganizationListDialog) && (
          <div className="body-wrapper01">
              <div className="container-fluid">
              <p className="fs-5">メニューより操作してください。</p>
            </div>
          </div>
      )}
      
          
          {
            isPassChangeDialog && (
              <div className="body-wrapper02">
                <div className="container-fluid">
                  
                  <PasswordChange></PasswordChange>
                </div>
              </div>
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
    </RootLayout>
  );
}
