import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import RootLayout from "../../../components/main";


export default function Menu() {
  // router
  const router = useRouter();

  const title = "部署・担当者管理システム";
  const [userName, setUserName] = useState("");
  const [isPassChangeDialog, setShowPassChangeDialog] = useState(false);
  const [isUserListDialog, setShowUserListDialog] = useState(false);
  const [isManagerListDialog, setShowManagerListDialog] = useState(false);
  const [isOrganizationListDialog, setShowOrganizationListDialog] = useState(false);
  const [isLogDialog, setShowLogDialog] = useState(false);
  const [isEntityUpdateDialog, setEntityUpdateDialog] = useState(false);

  useEffect(() => {
    setUserName(sessionStorage.getItem("userName"));
  })

  //パスワード変更ボタン押す時
  const showPassChangeDialog = (e) => {
    setShowPassChangeDialog(true);
    setShowUserListDialog(false);
    setShowManagerListDialog(false);
    setShowOrganizationListDialog(false);
    setShowLogDialog(false);
    setEntityUpdateDialog(false);

    //useRouter.push
  };

  //ユーザー管理ボタン押す時
  const showUserListDialog = (e) => {
    setShowUserListDialog(true);
    setShowPassChangeDialog(false);
    setShowManagerListDialog(false);
    setShowOrganizationListDialog(false);
    setShowLogDialog(false);
    setEntityUpdateDialog(false);
  };

   //担当者ー管理ボタン押す時
   const showManagerListDialog = (e) => {
    setShowManagerListDialog(true);
    setShowUserListDialog(false);
    setShowPassChangeDialog(false);
    setShowOrganizationListDialog(false);
    setShowLogDialog(false);
    setEntityUpdateDialog(false);
  };

  //部署ー管理ボタン押す時
  const showOrganizationListDialog = (e) => {
    setShowOrganizationListDialog(true);
    setShowManagerListDialog(false);
    setShowUserListDialog(false);
    setShowPassChangeDialog(false);
    setShowLogDialog(false);
    setEntityUpdateDialog(false);
  };

  const showLogDialog = (e) => {
    setShowLogDialog(true);
    setShowOrganizationListDialog(false);
    setShowManagerListDialog(false);
    setShowUserListDialog(false);
    setShowPassChangeDialog(false);
    setEntityUpdateDialog(false);
  };

  //エンティティ更新ボタン押す時
  const showEntityUpdateDialog = (e) => {
    setEntityUpdateDialog(true);
    setShowOrganizationListDialog(false);
    setShowManagerListDialog(false);
    setShowUserListDialog(false);
    setShowPassChangeDialog(false);
    setShowLogDialog(false);
  };

  return (
    <RootLayout>
      
    </RootLayout>
  );
}
