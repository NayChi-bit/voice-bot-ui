import React, { useState, useEffect } from "react";
import Table from "../../../components/table";
import { useRouter } from "next/router";
import userList from "../../api/user";


export default function UserList(){

    // router
    const router = useRouter();
    const [data, setData] = useState([{"userId" : null, "name" : null, "isPassReset" : null, "isLock" : null, 
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
    
    const showList = async () => {
        try {
            const response = await userList();
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
        data.map(row => {
            
            // レコードあるチャック
            const hasRecord = row.hasOwnProperty('id') && row.id !== null; 

            resultData.push({ ...row, hasRecord });
        });

        return resultData;
    }

    const userAdd = () => {
        router.push("../User/userRegister")
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
        <main>
            <div className="row mb-2">
                <div className="col-6">
                    <h1 className="h3 mb-3 fw-normal text-start"><i className="bi bi-person-lines-fill"></i>&nbsp;ユーザー一覧</h1>
                </div>
                <div className="col-6 text-end">
                    <a href="">
                        <button type="button" className="btn btn-primary" style={{ padding: "10px 40px" }}>新規登録</button>
                    </a>
                </div>
            </div>
            <Table columns={columns} data={data} />
        </main>
    );
}