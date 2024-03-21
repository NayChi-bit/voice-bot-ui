import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import { Router, useRouter } from "next/router";
import { systemUser } from "../../api/user";

export default function organizationDetail(){

    // router
    const router = useRouter();

    const [data, setData] = useState([{"userId" : null, "name" : null, "isPassReset" : null, "isLock" : null, 
    "userDelete" : null, "userDetail" : null, hasRecord : false }]);

    const [error, setErrors] = useState("");

    useEffect(() => {
        const id = sessionStorage.getItem('userId');
        const fetchData = async () => {
            try {
                const response = await showDetail(id);
                setData(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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
                                    <button className="btn btn-lg btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#Modal02" style={{padding :"10px 60px"}}>パスワードリセット</button>&nbsp;&nbsp;
                                    <button type="button" className="btn btn-lg btn-danger" data-bs-toggle="modal" data-bs-target="#Modal03	" style={{padding :"10px 60px"}}>アカウントロック</button>
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </RootLayout>
    );
}




