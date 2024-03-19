import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import { useRouter } from "next/router";

import { systemUser } from "../../api/user";

let data;
let setData;
export default function UserList(){

    // router
    const router = useRouter();

    [data, setData] = useState([{"userId" : null, "name" : null, "isPassReset" : null, "isLock" : null, 
    "userDelete" : null, "userDetail" : null, hasRecord : false }]);
    const [error, setErrors] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await showList();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    //新規登録ボタン押す時
    const userAdd = (e) => {
        //router.push("/userRegister");
        e.preventDefault();
        router.push("./register");
    };
    
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
        },
        {
            Header: '',
            accessor: 'userDelete',
        },
        {
            Header: '',
            accessor: 'userDetail',
        },
    ];

    return(
        <RootLayout top={true} isSidebarInclude={true}>
            <div className="body-wrapper02">
                <div className="container-fluid">
                    <main>
                        <div className="row mb-2">
                            <div className="col-6">
                                <h1 className="h3 mb-3 fw-normal text-start"><i className="bi bi-person-lines-fill"></i>&nbsp;ユーザー一覧</h1>
                            </div>
                            <div className="col-6 text-end">
                                <a href="">
                                    <button type="button" onClick={userAdd} className="btn btn-primary" style={{ padding: "10px 40px" }}>新規登録</button>
                                </a>
                            </div>
                        </div>
                        <Table columns={columns} data={data} />
                    </main>
                </div>
            </div>
        </RootLayout>
    );
}

export const showList = async () => {
    try {
        const response = await systemUser.userList();
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

export const processData = (data) => {
    const resultData = [];
    data.map(row => {
        
        // レコードあるチャック
        const hasRecord = row.hasOwnProperty('id') && row.id !== null; 

        resultData.push({ ...row, hasRecord });
    });

    return resultData;
}

// ユーザー削除
export async function userDelete(id, router) {
    const confirmationMessage = `削除しますか？`;
    console.debug("message:", confirmationMessage);
    const result = window.confirm(confirmationMessage);

    if (result) {
        console.debug("User clicked OK");
        let result = await systemUser.userDelete(id);
        if (result.status == 401) {
            router.push("/");
        } else {
            const result = await showList();
            setData(result);
        }
    } else {
        console.debug("User clicked Cancel");
    }
};