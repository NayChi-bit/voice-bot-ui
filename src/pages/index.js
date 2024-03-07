"use client";

import RootLayout from "../components/main";
import React, { useState, useEffect } from "react";
import LoginAuth from "../pages/api/login";
import { useRouter } from "next/navigation";
import LoginPolicy from "../environments/config.json";

export default function Home() {
  // environmentsから取得
  const isLoginEnabled = LoginPolicy.system.policy.login;
  // router
  const router = useRouter();

  // 初期表示時
  useEffect(() => {
    // localStrage削除
    sessionStorage.removeItem("authToken");
    //sessionStorage.removeItem("role");
    sessionStorage.removeItem("mode");
    sessionStorage.removeItem("resetToken");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
  });

  // formData
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  // error
  const [errors, setErrors] = useState("");

  // 値変更時のformData設定
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId.trim()) {
      newErrors.userId = "User Id is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Loginボタン押下時
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    // エラー出力箇所
    var errorMessage = document.getElementById("error-message");

    if (validateForm()) {
      console.debug("Form Data:", formData);
      errorMessage.innerHTML = "";
      try {
        const result = await LoginAuth(formData);
        // APIの結果が正常だった場合
        if (result.status == 200) {
          const data = await result.json();
          if (!data.isPassReset) {
            sessionStorage.setItem("authToken", data.token);
            sessionStorage.setItem("userId", data.userId);
            sessionStorage.setItem("userName", data.userName);
            router.push("views/Menu/menu");
          } else {
            sessionStorage.setItem("mode", "reset");
            sessionStorage.setItem("resetToken", data.token);
            sessionStorage.setItem("userId", data.userId);
            sessionStorage.setItem("userName", data.userName);
            router.push("views/Menu/changePassword");
          }

          //router.push("views/Menu/menu");
        } else if (result.status == 423) {
          errorMessage.innerHTML =
            "ログインエラー: ユーザIDまたはパスワードが間違っています。";
        }
      } catch (error) {
        // APIの結果が異常
        console.error("error:", error);
        errorMessage.innerHTML =
          "ログインエラー: ユーザIDまたはパスワードが間違っています。";
      }
    } else {
      console.error("Error Data:", errors);
      
      if(errors.password != null){
        errorMessage.innerHTML = errors.password;
      }

      if(errors.userId != null){
        errorMessage.innerHTML = errors.userId;
      }
    }
  };
  return (
    <RootLayout top={true}>
      {isLoginEnabled && (
        <div className="container text-center signin">
          <main className="form-signin">
            <form method="post" onSubmit={handleSubmit}>
              <i className="bi bi-person-square"  style={{fontSize: "4rem"}}></i>
              <h1 className="h3 mb-3 fw-normal">システムへのログイン</h1>
              <div className="error-message" id="error-message"></div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control custom-input"
                  id="floatingInput"
                  name="userId"
                  placeholder="ユーザID"
                  value={formData.userId}
                  onChange={handleChange}
                />
              <label htmlFor="floatingInput">ユーザーID</label>
            
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control custom-input"
                  id="floatingPassword"
                  name="password"
                  placeholder="パスワード"
                  value={formData.password}
                  onChange={handleChange}
                />
                <label htmlFor="floatingPassword">パスワード</label>
              </div>
              <div className="checkbox mb-4 mt-4">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate" />
                  <label className="form-check-label" htmlFor="flexCheckIndeterminate">&nbsp;&nbsp;ログイン状態を保持する</label>
                </div>
              </div>
              <button className="w-100 btn btn-lg btn-primary" type="submit" style={{padding: "12px 0px"}}>ログイン</button>
              <p className="mt-3 forget"><a href="#">IDやパスワードをお忘れの場合</a></p>
            </form>
          </main>
        </div>
      )}
    </RootLayout>
  );
}
