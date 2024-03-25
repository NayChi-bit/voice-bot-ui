import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import RootLayout from "../../../components/main";


export default function Menu() {
  // router
  const router = useRouter();

  const title = "部署・担当者管理システム";
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(sessionStorage.getItem("userName"));
  })

  return (
    <RootLayout>
      
    </RootLayout>
  );
}
