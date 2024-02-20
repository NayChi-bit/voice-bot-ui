import React, { useState, useEffect } from "react";
import Table from "@/components/table";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight, faFileLines, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import user from "@/pages/api/user";


export default function UserList(){

    // router
    const router = useRouter();
    const [data, setData] = useState([{"userId" : null, "name" : null, "isPassReset" : null, "isLock" : null}]);
    const [error, setErrors] = useState("");
    useEffect(() => {
        showList();
    });
    const showList = async () => {
        try {
            const response = await user();
            // APIの結果が正常だった場合
            // 0:登録成功
            // 1:現在のパスワード不一致
            // 2:該当ユーザーなし or その他エラー
            if (response.status == 200 && response !== null) {
                const res = await response.json();
                setData(res);
  
            } else if (response.status == 401) {
              setErrors("認証の有効期限が切れました");
            }
        } catch (errors) {
            // APIの結果が異常
            console.debug(errors.status);
            console.error("エラーerror:", errors);
            setErrors("エラーが発生しました");
            return false;
        }  
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
            Header: ' ',
            accessor: 'delete',
            Cell: (props) => (
                <FontAwesomeIcon icon={faTrashCan} />
                ),
        },
        {
            Header: ' ',
            accessor: 'detail',
            Cell: (props) => (
                <FontAwesomeIcon icon={faFileLines} />
                ),
        },
    ];

    return(
        <div className="call-log-viewer-container">
            <div className="inner-container">
                <h2 className="font-weight-bold">ユーザ一覧</h2>
                <button
                className="btn  btn-outline-dark btn-sm"
                onClick={userAdd}
                style={{ minWidth: "60px", marginLeft: "auto" }}
                >新規登録</button>
            </div>
            {/* <Table /> */}
            <Table columns={columns} data={data} />
        </div>
    );
}