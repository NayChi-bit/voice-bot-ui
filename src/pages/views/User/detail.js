import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import { Router, useRouter } from "next/router";
import { systemUser } from "../../api/user";
import LoginPolicy from "../../../environments/config.json";

export default function organizationDetail(){

    // router
    const router = useRouter();

    const [data, setData] = useState([{"userId" : null, "name" : null, "isPassReset" : null, "isLock" : null, 
    "userDelete" : null, "userDetail" : null, hasRecord : false }]);

    const [error, setErrors] = useState("");

    const [formData, setFormData] = useState({});
    const userIdMin = LoginPolicy.system.policy.userIdMin;
    const userIdMax = LoginPolicy.system.policy.userIdMax;

    useEffect(() => {
        const id = sessionStorage.getItem('userId');
        const fetchData = async () => {
            try {
                const response = await showDetail(id);
                setData(response);
                setFormData(response[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // 値変更時のformData設定
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    // 編集ボタン押す
    const handleSubmit = async (e) => {

        e.preventDefault();
        // エラー出力箇所
        var errorMessage = document.getElementById("error-message");
    
        if (validateForm()) {
            console.debug("Form Data:", formData);
            errorMessage.innerHTML = "";
            
            editUser(formData);
        } else {
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

        var confirmed = showConfirmation(formData);
        if (!confirmed) {
            return false;
        }

        return true;
    };

    const editUser = async () => {
        try {
            const response = await systemUser.userEdit(formData);
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

    function showConfirmation(formData) {
        var confirmationMessage = `
          ユーザID: ${formData.userId}
          表示名: ${formData.name}
        `;
    
        return confirm("以下の情報で登録してよろしいですか。？\n" + confirmationMessage);
    }

    // 戻るボタン押す
    const handleBack = (e) => {
        e.preventDefault();
        router.push("./list");
    }

    const showDetail = async (id) => {
        try {
            const response = await systemUser.userDetail(id);
            // APIの結果が正常だった場合
            // 部署なし or その他エラー
            if (response.status == 200 && response !== null) {
                const res = await response.json();

                const result = processData(res);
                return result;
  
            } else if (response.status == 401) {
              setErrors("認証の有効期限が切れました");
              return false;
            }
        } catch (errors) {
            // APIの結果が異常
            console.debug(errors.status);
            console.error("エラーerror:", errors);
            setErrors("エラーが発生しました");
            return false;
        }  
    }

    const processData = (data) => {
        const resultData = [];
            
        // レコードあるチャック
        const hasRecord = data.hasOwnProperty('id') && data.id !== null; 

        resultData.push({ ...data, hasRecord });

        return resultData;
    }

    const setPasswordReset = async (e) => {
        try {
            router.push("../Menu/passwordChange");
        } catch (errors) {
            // APIの結果が異常
            console.debug(errors.status);
            console.error("エラーerror:", errors);
            setErrors("エラーが発生しました");
            return false;
        }  
    }

    const setAccLock = async (event, isLock) => {
        try {
            setFormData((prevData) => {
                // Update isLock field
                const updatedData = {
                    ...prevData,
                    isLock: isLock ? "ON" : "OFF"
                };
    
                // Call API fetch after updating form data
                setAccLockApi(updatedData);
    
                // Return updated form data
                return updatedData;
            });
        } catch (errors) {
            // APIの結果が異常
            console.debug(errors.status);
            console.error("エラーerror:", errors);
            setErrors("エラーが発生しました");
            return false;
        }  
    }

    const setAccLockApi = async (formData) => {
        try {
            
            console.log(formData);
            const response = await systemUser.setAccLock(formData);
            // APIの結果が正常だった場合
            // 部署なし or その他エラー
            if (response.status == 200 && response !== null) {
                const response = await showDetail(formData.id);
                setData(response);
  
            } else if (response.status == 401) {
              setErrors("認証の有効期限が切れました");
              return false;
            }
        } catch (errors) {
            // APIの結果が異常
            console.debug(errors.status);
            console.error("エラーerror:", errors);
            setErrors("エラーが発生しました");
            return false;
        }  
    }
    
    const columns =  [
        {
            Header: 'ユーザID',
            accessor: 'userId',
        },
        {
            Header: 'ユーザ名',
            accessor: 'name',
        },
        {
            Header: 'リセット',
            accessor: 'isPassReset',
        },
        {
            Header: 'ロック',
            accessor: 'isLock',
        }
    ];

    return(
        <RootLayout>
            <div className="body-wrapper01">
                <div className="container-fluid">
                    <main className="form-signin">
                        <form>
                            <i className="bi bi-diagram-3-fill" style={{fontSize: "4rem"}}></i>
                            <h1 className="h3 mb-3 fw-normal">ユーザー詳細</h1>
                            <div className="form-floating mb-3">
                                <Table columns={columns} data={data} paginationEnabled={false} isVarticleTable={true}/>
                                <div className="my-5">
                                    <button type="button" className="btn btn-lg btn-primary" data-bs-toggle="modal" data-bs-target="#Modal01" style={{padding :"10px 60px"}}>編&nbsp;集</button>&nbsp;&nbsp;
                                    <button className="btn btn-lg btn-secondary" type="button" onClick={handleBack} style={{padding :"10px 60px"}}>戻&nbsp;る</button>&nbsp;&nbsp;
                                    {
                                        formData.isPassReset !== "ON" && (
                                        <button className="btn btn-lg btn-primary" type="button"  data-bs-toggle="modal" data-bs-target="#Modal02" style={{padding :"10px 60px"}}>パスワードリセット</button>
                                    )} 
                                    {
                                        formData.isLock == "ON" && (
                                            <button type="button" className="btn btn-lg btn-danger" data-bs-toggle="modal" data-bs-target="#Modal04	" style={{padding :"10px 60px"}}>アカウントロック削除</button>
                                        )
                                    }
                                    {
                                        formData.isLock == "OFF" && (
                                            <button type="button" className="btn btn-lg btn-danger" data-bs-toggle="modal" data-bs-target="#Modal03	" style={{padding :"10px 60px"}}>アカウントロック</button>
                                        )
                                    }
                                    
                                </div>
                            </div>
                        </form>
                        {
                            <div className="modal fade" id="Modal01" tabIndex="-1" aria-labelledby="ModalLabel01">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="ModalLabel01">担当者詳細&nbsp;集</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="error-message" id="error-message" style={{marginBottom :"15px"}}>{error}</div>
                                            <table className="table table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">ユーザID</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="userId" value={formData.userId} onChange={handleChange} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">ユーザ名</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="name" value={formData.name} onChange={handleChange} /></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{padding : "10px 45px"}} onClick={handleSubmit}>編&nbsp;集</button>
                                                <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal" style={{padding : "10px 37px"}}>キャンセル</button>
                                            </div>{/* /.modal-footer  */}
                                        </div>
                                    </div>{/* /.modal-content  */}
                                </div>{/* /.modal-dialog  */}
                            </div>
                        }
                        <div className="modal fade" id="Modal02" tabIndex="-1" aria-labelledby="ModalLabel02">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <p>バスワードをリセット</p>
                                    </div>
                                    <div className="modal-body">
                                        <p>バスワードをリセットしますか。</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{padding : "10px 45px"}} onClick={setPasswordReset}>OK</button>
                                        <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal" style={{padding : "10px 37px"}}>キャンセル</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="Modal03" tabIndex="-1" aria-labelledby="ModalLabel03">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <p>アカウントロック</p>
                                    </div>
                                    <div className="modal-body">
                                        <p>アカウントをロックしますか。</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{padding : "10px 45px"}} onClick={(event) => setAccLock(event, true)}>OK</button>
                                        <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal" style={{padding : "10px 37px"}}>キャンセル</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="Modal04" tabIndex="-1" aria-labelledby="ModalLabel04">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <p>アカウントロック</p>
                                    </div>
                                    <div className="modal-body">
                                        <p>アカウントロックを削除しますか。</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" style={{padding : "10px 45px"}} onClick={(event) => setAccLock(event, false)}>OK</button>
                                        <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal" style={{padding : "10px 37px"}}>キャンセル</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </RootLayout>
    );
}




