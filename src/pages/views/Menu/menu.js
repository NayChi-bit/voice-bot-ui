import RootLayout from "../../../components/main";
import PasswordChange from "./passwordChange";
import UserList from "./userList";
import ManagerList from "./managerList";
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
      <div className="call-log-viewer-container menu-container">
        <div className="row">
          <div className="col-3 menu-side">
            <div className="input-group">
              <div className="col-12 col-md-12">
                <label htmlFor="menu" className="menu font-weight-bold">
                  メニュー
                </label>
              </div>
              <div className="col-12 col-md-12">
                <button
                  className="btn  btn-outline-dark btn-sm btn-block"
                  onClick={showOrganizationListDialog}
                  style={{ minWidth: "60px" }}
                >
                  組織管理

                </button>
              </div>
              <div className="col-12 col-md-12">
                <button
                  className="btn  btn-outline-dark btn-sm btn-block"
                  onClick={showManagerListDialog}
                  style={{ minWidth: "60px" }}
                >
                  担当者管理

                </button>
              </div>
              <div className="col-12 col-md-12">
                <button
                  className="btn  btn-outline-dark btn-sm btn-block"
                  // onClick={callLogManage}
                  style={{ minWidth: "60px" }}
                >
                  通話ログ管理
                  

                </button>
              </div>
              <div className="col-12 col-md-12">
                <button
                  className="btn  btn-outline-dark btn-sm btn-block"
                  onClick={showUserListDialog}
                  style={{ minWidth: "60px" }}
                >
                  ユーザー管理

                </button>
              </div>
              <div className="col-12 col-md-12">
                <button
                  className="btn  btn-outline-dark btn-sm btn-block"
                  onClick={showPassChangeDialog}
                  style={{ minWidth: "60px" }}
                >
                  パスワード変更

                </button>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="col-12 col-md-12">
              {(!isPassChangeDialog && !isUserListDialog && !isManagerListDialog && !isOrganizationListDialog) && (
              <label htmlFor="operation" className="oper-side">
                  operation
              </label>
              )}
              {
                isPassChangeDialog && (
                    
                  <PasswordChange></PasswordChange>
                )
              }
              {
                isUserListDialog && (
                    
                  <UserList></UserList>
                )
              }
              {
                isManagerListDialog && (
                    
                  <ManagerList></ManagerList>
                )
              }
              {
                isOrganizationListDialog && (
                    
                  <OrganizationList></OrganizationList>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
