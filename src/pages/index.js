"use client";

import RootLayout from "../components/main";
import React, { useState, useEffect } from "react";
import LoginAuth from "../pages/api/login";
import { useRouter } from "next/navigation";
import LoginPolicy from "../environments/config.json";
import Cookies from "js-cookie";
export default function Home() {
  // environmentsから取得
  const isLoginEnabled = LoginPolicy.system.policy.login;
  // router
  const router = useRouter();

  // 初期表示時
  useEffect(() => {
    // localStrage削除
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
  });

  // formData
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    keepLogin : false,
  });
  const [isChecked, setIsChecked] = useState(false);
  // error
  const [errors, setErrors] = useState("");

  // 値変更時のformData設定
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsChecked(e.target.checked);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId.trim()) {
      newErrors.userId = "ユーザーIDを入力してください。";
    }
    if (!formData.password.trim()) {
      newErrors.password = "パスワードを入力してください。";
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
        LoginAuth(formData).then(result => {
          if(result.status == 400){
            errorMessage.innerHTML = "ユーザIDとパスワードが正しくありません。";
          }
          // APIの結果が正常だった場合
          if (result.status == 200) {
            const data = result.json();
            return data
          } else if(result.status == 423) { // アカウントはロックされた場合
              errorMessage.innerHTML =
              "アカウントがロックされています。";
              return false;
          }
        }).then(data => { // Jsonデータ帰り
          const now = new Date();
          if(isChecked){
            // Get the next one day
            const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            Cookies.set("expireTime", oneDayLater, { secure: true, sameSite: 'none' });
          }
          else{
            // Get the next one hour
            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
            Cookies.set("expireTime", oneHourLater, { secure: true, sameSite: 'none' });
          }
          Cookies.set("currentUser", data.userId, { secure: true, sameSite: 'none' });

          if (!data.isPassReset) {
            sessionStorage.setItem("userId", data.userId);
            sessionStorage.setItem("userName", data.userName);
            router.push("views/Menu/menu");
          } else {
            sessionStorage.setItem("userId", data.userId);
            sessionStorage.setItem("userName", data.userName);
            router.push("views/Menu/changePassword");
          }
        })
        
      } catch (error) {
          errorMessage.innerHTML = "ログイン処理にて異常が発生しました。システム担当者へ連絡してください。";
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
                  <input 
                    className="form-check-input" 
                    type="checkbox" value="" id="flexCheckIndeterminate" 
                    checked={isChecked} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="flexCheckIndeterminate">&nbsp;&nbsp;ログイン状態を保持する</label>
                </div>
              </div>
              <button 
                className="w-100 btn btn-lg btn-primary" 
                type="submit" 
                style={{padding: "12px 0px"}}>ログイン</button>
              {/* <p className="mt-3 forget"><a href="#">IDやパスワードをお忘れの場合</a></p> */}
            </form>
          </main>
        </div>
    </RootLayout>
  );
}
