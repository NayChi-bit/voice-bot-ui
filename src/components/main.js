import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css'
import "../pages/styles/globals.css";
import "../pages/styles/style.css";

import Head from "next/head";

export default function Layout({ top, children }) {
  const title = "部署・担当者管理システム";
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(sessionStorage.getItem("userName"));
  })
  return (
    <div className="">
      <header>
        {/* Gooogle Fonts CSS  */}
        <link rel="preconnect" href="https://fonts.googleapis.com"　/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet" />
        <h1 className="title"><i className="bi bi-person-square"></i>部署・担当者管理システム</h1>
      </header>
      {children}
    </div>
  );
}

