import React, { useState, useEffect } from "react";
import LoginPolicy from "../../../environments/config.json";

export default function PasswordChange() {

    // error
  const [errors, setErrors] = useState("");

  // password change
  const isPasswordComplicate = LoginPolicy.system.policy.passwordComplicate;
  const passwordMin = LoginPolicy.system.policy.passwordMin;
  const passwordMax = LoginPolicy.system.policy.passwordMax;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassWord] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
  useState(true);
  // const [enteredCurrentPassword, setEnteredCurrentPassword] = useState(true);
  // const [enteredNewPassword, setEnteredNewPassword] = useState(true);
  // const [enteredConfirmPassword, setEnteredConfirmPassword] = useState(true);
  const [mode, setMode] = useState("");
  const minCharTypes = 3;

  // sessionから取得
  // const userId = (sessionStorage !== undefined) ? sessionStorage.getItem("userId") : "";
  // const userName = (sessionStorage !== undefined) ? sessionStorage.getItem("userName") : "";

   // パスワード変えるModeセットアップ
   useEffect(() => {
    // const mode = (sessionStorage !== undefined) ? sessionStorage.getItem("mode") : "";

    // setMode(mode);
  });

  // 戻るボタンクリック
  const handleBackSearchClick = (e) => {
    // if (mode === "reset") {
    //   router.push("/");
    // } else if (mode === "user_reset") {
    //   router.push("userDetail");
    // } else {
    //   // setEnteredCurrentPassword("");
    //   // setEnteredNewPassword("");
    //   // setEnteredConfirmPassword("");
    //   e.preventDefault();
    //   e.target.reset();
    // }
  };

  // パスワード変更ボタンクリック
  const changePasswordClick = (event) => {
    event.preventDefault();

    if (
      (mode === "user_reset" && newPassword === "") ||
      (mode === "reset" && newPassword === "") ||
      confirmPassword === ""
    ) {
      setErrors("すべてのフィールドを入力してください。");
      return false;
    } else if (
      (mode == null && currentPassword === "") ||
      newPassword === "" ||
      confirmPassword === ""
    ) {
      setErrors("すべてのフィールドを入力してください。");
      return false;
    } else if (
      mode !== "user_reset" &&
      mode !== "reset" &&
      newPassword === currentPassword
    ) {
      setErrors("現在のパスワードと同じパスワードは利用できません");
      return false;
    } else if (newPassword !== confirmPassword) {
      setErrors("新しいパスワードが一致しません。");
      return false;
    } else if (!isValidPasswordCharType(newPassword)) {
      setErrors(
        "パスワードに使用できない文字が含まれています。使用できる記号は<>+!?#$%&()/~*です。"
      );
      return false;
    } else if (newPassword.length < passwordMin || !isCharacterTypesEnough()) {
      setErrors("パスワードを複雑にしてください。");
      return false;
    } else if (newPassword.length > passwordMax) {
      setErrors(`パスワードは${passwordMax}文字以下にしてください。`);
      return false;
    }
    if (mode === "reset") {
      // バックエンド登録処理
      // var editUser = ((sessionStorage !== undefined) && sessionStorage.getItem("userName")) ? sessionStorage.getItem("userName") : "";
      // var resetToken = ((sessionStorage !== undefined) && sessionStorage.getItem("resetToken")) ? sessionStorage.getItem("resetToken") : "";
      var formData = {
        token: resetToken,
        newPassword: newPassword,
        username: editUser,
      };
      const handleChangePasswordReset = async (e) => {
        console.debug("ChangePassword handleChangePasswordReset");
        try {
          const response = await changePasswordReset(formData);
          const data = await response.json();
          // APIの結果が正常だった場合
          // 0:登録成功
          // 1:現在のパスワード不一致
          // 2:該当ユーザーなし or その他エラー
          if (response.status == 200) {
            // 登録が成功したら確認画面を表示

            // (sessionStorage !== undefined) && sessionStorage.removeItem("mode");
            // (sessionStorage !== undefined) && sessionStorage.removeItem("resetToken");
            // (sessionStorage !== undefined) && sessionStorage.removeItem("userName");

            // (sessionStorage !== undefined) && sessionStorage.setItem("authToken", data.token);
            // //sessionStorage.setItem("role", data.role);
            // (sessionStorage !== undefined) && sessionStorage.setItem("userName", data.username);
            showConfirmation();
          } else if (response.status == 401) {
            setErrors("認証の有効期限が切れました");
          } else if (response.status == 409) {
            setErrors("現在のパスワードと同じパスワードは利用できません");
          } else {
            setErrors("エラーが発生しました");
          }
        } catch (errors) {
          // APIの結果が異常
          console.debug(errors.status);
          console.error("エラーerror:", errors);
          setErrors("エラーが発生しました");
          return false;
        }
      };
      handleChangePasswordReset();
    } else if (mode === "user_reset") {
      console.debug("changePasswordClick user_reset");
      // バックエンド登録処理
      //var editUser = sessionStorage.getItem("editUser");
      var editUser = "temp";
      var formData = {
        newPassword: newPassword,
        username: editUser,
      };
      const handleChangePassword = async (e) => {
        try {
          const response = await SetPasswordReset(formData);
          if (response.status == 401) {
            router.push("userDetail");
          } else if (response.status == 409) {
            setErrors("現在のパスワードと同じパスワードは利用できません");
          } else {
            const data = await response.json();
            // APIの結果が正常だった場合
            // 0:登録成功
            //  その他エラー
            if (data.body == 0) {
              // 登録が成功したら確認画面を表示
              showConfirmation();
            } else {
              setErrors("エラーが発生しました");
            }
          }
        } catch (error) {
          // APIの結果が異常
          console.error("エラーerror:", error);
          setErrors("エラーが発生しました");
          return false;
        }
      };
      handleChangePassword();
    } else {
      // バックエンド登録処理
      //var editUser = sessionStorage.getItem("userName");
      editUser = "temp";
      var formData = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        username: editUser,
      };
      const handleChangePassword = async (e) => {
        try {
          const response = await ChangePasswordApi(formData);
          if (response.status == 401) {
            router.push("/");
          }
          const data = await response.json();
          // APIの結果が正常だった場合
          // 0:登録成功
          // 1:現在のパスワード不一致
          // 2:該当ユーザーなし or その他エラー
          if (data.body == 0) {
            // 登録が成功したら確認画面を表示
            showConfirmation();
          } else if (data.body == 1) {
            setErrors("現在のパスワードが正しくありません");
          } else {
            setErrors("エラーが発生しました");
          }
        } catch (error) {
          // APIの結果が異常
          console.error("エラーerror:", error);
          setErrors("エラーが発生しました");
          return false;
        }
      };
      handleChangePassword();
    }
    return;
  };

  // パスワードバリデーションチェック
  function isValidPasswordCharType(password) {
    // 英語小文字・英語大文字・記号以外の文字があるかどうかをチェック。
    // 禁止文字が含まれていなかった場合にtrue
    return /^[a-zA-Z0-9<>+!?#$%&()\/~*]+$/.test(password);
  }

  function isCharacterTypesEnough() {
    // パスワード文字種類チェックが有効でない場合はtrueを返す
    if (isPasswordComplicate) {
      return countCharacterTypes(newPassword) >= minCharTypes;
    } else {
      return true;
    }
  }

  // パスワード内に何種類の文字が含まれているかを確認する関数
  function countCharacterTypes(password) {
    var charTypes = 0;
    if (/[a-z]/.test(password)) charTypes++;
    if (/[A-Z]/.test(password)) charTypes++;
    if (/[0-9]/.test(password)) charTypes++;
    if (/[<>+!?#$%&()\/~*]/.test(password)) charTypes++; //登録可能な記号は<>+!?#$%&()/~*のみ
    return charTypes;
  }

  function showConfirmation() {
    var confirmed = window.alert("パスワードを変更しました。");
    if (mode === "admin_reset") {
      //router.push("userList"); //管理画面へ遷移
    } else {
      //router.push("search"); //管理画面へ遷移
    }
  }

  return (
    // <div className="call-log-viewer-container">
    //     <h2 className="font-weight-bold">パスワード変更</h2>
    //     <form id="passwordChangeForm">
    //     {isCurrentPasswordVisible && (
    //         <div className="form-group row">
    //         <label
    //             htmlFor="current-password"
    //             className="col-md-6 col-form-label text-md-left"
    //         >
    //             現在のパスワード
    //         </label>
    //         <div className="col-md-6">
    //             <input
    //             type="password"
    //             className="form-control string-input"
    //             id="current-password"
    //             name="current-password"
    //             placeholder="現在のパスワード"
    //             // value={enteredCurrentPassword}
    //             onChange={(event) => setCurrentPassword(event.target.value)}
    //             ></input>
    //         </div>
    //         </div>
    //     )}

    //     {/* 新しいパスワード入力欄 */}
    //     <div className="form-group row">
    //         <label
    //         htmlFor="new-password"
    //         className="col-md-6 col-form-label text-md-left"
    //         >
    //         新しいパスワード
    //         </label>
    //         <div className="col-md-6 input-group">
    //         <input
    //             type="password"
    //             className="form-control string-input"
    //             id="new-password"
    //             name="new-password"
    //             placeholder="新しいパスワード"
    //             // value={enteredNewPassword}
    //             onChange={(event) => setNewPassWord(event.target.value)}
    //         ></input>
    //         </div>
    //     </div>

    //     {/* 新しいパスワード（確認用）入力欄 */}
    //     <div className="form-group row">
    //         <label
    //         htmlFor="confirm-password"
    //         className="col-md-6 col-form-label text-md-left"
    //         >
    //         新しいパスワード（確認用）
    //         </label>
    //         <div className="col-md-6 input-group">
    //         <input
    //             type="password"
    //             className="form-control string-input"
    //             id="confirm-password"
    //             name="confirm-password"
    //             placeholder="新しいパスワード（確認用）"
    //             // value={enteredConfirmPassword}
    //             onChange={(event) => setConfirmPassword(event.target.value)}
    //         ></input>
    //         </div>
    //     </div>

    //     <div className="error-message" id="error-message">
    //         {errors}
    //     </div>
    //     </form>

    //     <div className="button-container">
    //     <button
    //         className="btn btn-secondary btn-small"
    //         onClick={changePasswordClick}
    //     >
    //         変更
    //     </button>
    //     <button
    //         type="submit"
    //         className="btn btn-secondary btn-small"
    //         form="passwordChangeForm"
    //         onClick={handleBackSearchClick}
    //     >
    //         キャンセル
    //     </button>
    //     </div>
    // </div>

    <div className="body-wrapper01">
      <div className="container-fluid">
        <main className="form-signin">
          <form>
            <i className="bi bi-unlock-fill" style={{fontSize: "4rem"}}></i>
            <h1 className="h3 mb-3 fw-normal">パスワードの変更</h1>
            <div className="form-floating mb-3">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td className="col-6 text-center align-middle bg-light">現在のパスワード</td>
                    <td className="col-6 text-center align-middle"><input type="password" className="custom-input" /></td>
                  </tr>
                  <tr>
                    <td className="col-6 text-center align-middle bg-light">新しいパスワード</td>
                    <td className="col-6 text-center align-middle"><input type="password" className="custom-input" /><br/>
                    （半角の英字と数字を含む、８文字以上の文字列）</td>
                  </tr>
                  <tr>
                    <td className="col-6 text-center align-middle bg-light">新しいパスワード（確認）</td>
                    <td className="col-6 text-center align-middle"><input type="password" className="custom-input" /></td>
                  </tr>
                </tbody>
              </table>
              <div className="error-message" id="error-message">
                {errors}
              </div>
              <div className="my-5">
                <button className="btn btn-lg btn-primary" 
                  type="button" onClick={changePasswordClick} style={{ padding: "10px 60px" }}>変&nbsp;更</button>&nbsp;&nbsp;
                <button className="btn btn-lg btn-secondary" 
                type="reset" onClick={handleBackSearchClick} style={{ padding: "10px 32px" }}>キャンセル</button>
              </div>
            </div>
          </form>
        </main>
      </div>
      </div>
  );
}