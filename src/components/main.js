import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import 'bootstrap-icons/font/bootstrap-icons.css'
import "../pages/styles/globals.css";
import "../pages/styles/style.css";
// @ts-ignore
import 'jquery/dist/jquery.min.js'; 
// @ts-ignore
import 'popper.js/dist/umd/popper.min.js';
//// @ts-ignore
//import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Layout({ top, children,  isSidebarInclude=true}) {
  // router
  const router = useRouter();
  const [userName, setUsername] = useState('');

  useEffect(() => {
    const storeUserName = sessionStorage.getItem('userName');
    setUsername(storeUserName);
  })

  useEffect(() => {
    typeof document !== undefined
      ? require('bootstrap/dist/js/bootstrap.bundle.min.js')
      : null;
  },[]);

  //パスワード変更ボタン押す時
  const showPassChangeDialog = (e) => {
    e.preventDefault();
    router.push("../Menu/changePassword");

  };

  //ユーザー管理ボタン押す時
  const showUserListDialog = (e) => {
    e.preventDefault();
    router.push("../User/list");
  };

   //担当者ー管理ボタン押す時
   const showManagerListDialog = (e) => {
    e.preventDefault();
    router.push("../Employee/list");
  };

  //部署ー管理ボタン押す時
  const showOrganizationListDialog = (e) => {
    e.preventDefault();
    router.push("../Organization/list");
  };

  const showLogDialog = (e) => {
    e.preventDefault();
    router.push("../Menu/logList");
  };

  //エンティティ更新ボタン押す時
  const showEntityUpdateDialog = (e) => {
    e.preventDefault();
    router.push("../Menu/entityUpdate");
  };


  return (
    <div>
      <header>
        {/* Gooogle Fonts CSS  */}
        <link rel="preconnect" href="https://fonts.googleapis.com"　/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet" />
        <div className="header-container">
          <div className="left">
              <h1 className="title"><i className="bi bi-person-square"></i>部署・担当者管理システム</h1>
          </div>
          <div>
              {userName}
          </div>
        </div>
      </header>
      {isSidebarInclude && (
        <div className="sidebar">
          <h1><i className="bi bi-list"></i>&nbsp;メニュー</h1>
          <a href="#" onClick={showOrganizationListDialog}><i className="bi bi-building-fill"></i>&nbsp;組織管理</a>
          <a href="#" onClick={showManagerListDialog}><i className="bi bi-person-workspace"></i>&nbsp;担当者管理</a>
          <a href="#" onClick={showLogDialog}><i className="bi bi-mic-fill"></i>&nbsp;通話ログ管理</a>
          <a href="#" onClick={showUserListDialog}><i className="bi bi-person-fill"></i>&nbsp;ユーザー管理</a>
          <a href="#" onClick={showPassChangeDialog}><i className="bi bi-unlock-fill"></i>&nbsp;パスワード変更</a>
          <a href="#" onClick={showEntityUpdateDialog}><i className="bi bi-diamond-fill"></i>&nbsp;エンティティ更新</a>
        </div>
      )}
      {children}
    </div>
  );
}

