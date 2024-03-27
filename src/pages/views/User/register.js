import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import ConfirmModal from "../../../components/confirmModal";
import { useRouter } from "next/router";
import { systemUser } from "../../api/user";
import LoginPolicy from "../../../environments/config.json";

export default function UserRegister(){
    // router
    const router = useRouter();

    // error
    const [error, setErrors] = useState("");

    const [formData, setFormData] = useState({});
    const userIdMin = LoginPolicy.system.policy.userIdMin;
    const userIdMax = LoginPolicy.system.policy.userIdMax;
    const passwordMin = LoginPolicy.system.policy.passwordMin;
    const passwordMax = LoginPolicy.system.policy.passwordMax;
    const minCharTypes = LoginPolicy.system.policy.minPasswordCharType;

    const [haveError, setHaveError] = useState(false);
    var confirm = "user";

    useEffect(() => {
        //showList();
    });

    // 値変更時のformData設定
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));

        if (!haveError) {
            const confirmButton = document.getElementById("confirmBtn");
            confirmButton.removeAttribute("data-bs-toggle", "modal");
        }
    };

    //登録ボタン押す
    const handleSubmit = async (e) => {
    
        e.preventDefault();
        // エラー出力箇所
        var errorMessage = document.getElementById("error-message");
    
        if (validateForm()) {
            console.debug("Form Data:", formData);
            errorMessage.innerHTML = "";
            
            // registUser(formData);
            setHaveError(false);
        } else {
            setHaveError(true);
          console.log("Error Data:", error)
        }
    };
    
    // validation
    const validateForm = () => {
        // ユーザIDの検証
        const userIdRegex = /[^a-zA-Z0-9@_-]/;
        if (!formData.userId || !formData.userId.trim()) {
            setErrors("ユーザーIDを入力してください");
            return false;
        } else if (userIdRegex.test(formData.userId)) {
            setErrors(
                "ユーザIDが正しくありません。使用できない文字が含まれています。"
            );
            return false;
        } else if (formData.userId.length < userIdMin || userIdMax < formData.userId.length) {
            setErrors("ユーザIDは" + userIdMin + "文字以上、" + userIdMax + "以下で設定してください。");
            return false;
        }

        // ユーザー名チャック
        if (!formData.name || !formData.name.trim()) {
            setErrors("ユーザー名を入力してください");
            return false;
        }
        // パスワードフィールドの値を取得
        // パスワードの強度を計算
        if(!formData.password || !formData.password.trim()){
            setErrors("パスワードを入力してください。");
            return false;
        }
        if(!formData.passwordConfirm || !formData.passwordConfirm.trim()){
            setErrors("パスワード（確認）を入力してください。");
            return false;
        }
        else if(formData.password !== formData.passwordConfirm){
            setErrors("パスワードが相違しています。");
            return false;
        }
        else if (!isValidPasswordCharType(formData.password)) {
            setErrors(
            "パスワードに使用できない文字が含まれています。使用できる記号は<>+!?#$%&()/~*です。"
            );
            return false;
        } else if (formData.password.length < passwordMin || !isCharacterTypesEnough(formData.password)) {
            setErrors("パスワードを複雑にしてください。");
            return false;
        } else if (formData.password.length > passwordMax) {
            setErrors(`パスワードは${passwordMax}文字以下にしてください。`);
            return false;
        }

        return true;
    };

    const registUser = async () => {
        try {
          const response = await systemUser.userCreate(formData);
          console.debug(response);
  
          if (response.status == 409) {
            alert("既に同じログインIDが存在していま");
          } 
          else if (response.status == 401) {
            router.push("/");
          } else if (response.status == 200) {
            alert("ユーザの登録は完了しました。");
            router.push("./list");
          } else {
            alert("登録に失敗しました");
            return false;
          }
        } catch (error) {
          // APIの結果が異常
          console.log("エラーerror:", error);
          alert("登録に失敗しました");
          return false;
        }
    };
      
    function isValidPasswordCharType(password) {
        // 英語小文字・英語大文字・記号以外の文字があるかどうかをチェック。
        // 禁止文字が含まれていなかった場合にtrue
        return /^[a-zA-Z0-9<>+!?#$%&()\/~*]+$/.test(password);
    }

    function isCharacterTypesEnough(password) {
        return countCharacterTypes(password) >= minCharTypes;
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

    // 戻るボタン押す
    const handleBack = (e) => {
        e.preventDefault();
        router.push("./list");
    }

    return(
        <RootLayout top={true} isSidebarInclude={true}>
            <div className="body-wrapper01">
                <div className="container-fluid">
                    <form method="post" onSubmit={handleSubmit}>
                        <main className="form-signin">
                            <i className="bi bi-person-vcard-fill" style={{fontSize: "4rem"}}></i>
                            <h1 className="h3 mb-3 fw-normal">新規登録</h1>
                            <div className="error-message" id="error-message">{error}</div>
                            <div className="form-floating mb-3">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light">ログインID</td>
                                            <td className="col-6 text-center align-middle"><input type="text" className="custom-input" name="userId" value={formData.userId} onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light">ユーザ名</td>
                                            <td className="col-6 text-center align-middle"><input type="text" className="custom-input" name="name" value={formData.name} onChange={handleChange}/></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light">新しいパスワード</td>
                                            <td className="col-6 text-center align-middle"><input type="password" className="custom-input" name="password" value={formData.password} onChange={handleChange}/><br/>
                                        （半角の英字と数字を含む、6文字以上の文字列）</td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light">新しいパスワード（確認）</td>
                                            <td className="col-6 text-center align-middle"><input type="password" className="custom-input" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange}/></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="my-5">
                                    <button className="btn btn-lg btn-primary" id="confirmBtn" type="submit" data-bs-toggle={!haveError ? "modal" : ""} data-bs-target="#ConfirmModal" style={{padding :"10px 60px"}}>登&nbsp;録</button>&nbsp;&nbsp;
                                    <button className="btn btn-lg btn-secondary" type="reset"  style={{padding :"10px 32px"}} onClick={handleBack}>キャンセル</button>
                                </div>
                            </div>
                        </main>
                    </form>
                    {!haveError && (<ConfirmModal formData={formData} actionForm={registUser} confirm={confirm}/>)}
                </div>
            </div>
        </RootLayout>
    );
}