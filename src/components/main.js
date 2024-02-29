import { useEffect, useState } from "react";
import "../pages/styles/globals.css";

import Head from "next/head";

export default function Layout({ top, children }) {
  const title = "部署・担当者管理システム";
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(sessionStorage.getItem("userName"));
  })
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
      </Head>
      <div className="jumbotron">
        <h1 className="display-4">部署・担当者管理システム</h1>
        <h1 className="dispaly-4" style={{marginLeft: "auto", marginRight:"unset"}}>{ userName }</h1>
      </div>
      {children}
    </div>
  );
}

