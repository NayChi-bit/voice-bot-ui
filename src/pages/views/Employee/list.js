import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import { useRouter } from "next/router";
import { employee } from "../../api/employee";

let data;
let setData;
export default function ManagerList(){

    // router
    const router = useRouter();

    [data, setData] = useState([{id : null, "name" : null, "readName" : null, "aliasName" : null, "departmentName" : null,
     "phone" : null, "remarks" : null, "operation" : null, hasRecord : false, isOrg: false }]);

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

    // const userAdd = () => {
    //     router.push("User/userRegister")
    // }

    const columns = React.useMemo(
        () => [
            {
                Header: '担当者ID',
                accessor: 'id',
            },
            {
                Header: '担当者名',
                accessor: 'name',
            },
            {
                Header: 'よみ',
                accessor: 'readName',
            },
            {
                Header: '担当者別名',
                accessor: 'aliasName',
            },
            {
                Header: '所属部署',
                accessor: 'departmentName',
            },
            {
                Header: '電話番号',
                accessor: 'phone',
            },
            {
                Header: '備考',
                accessor: 'remarks',
            },
            {
                id: 'operation',
                Header: '操作',
                accessor: 'operation',
            }
        ],
        []
    )

    return(
        <RootLayout top={true} isSidebarInclude={true}>
            <div className="body-wrapper02">
                <div className="container-fluid">
                    <main>
                        <h1 className="h3 mb-3 fw-normal text-start"><i className="bi bi-person-bounding-box"></i>&nbsp;担当者一覧</h1>
                        <div className="row mb-3">
                            <div className="col-6 text-start">
                                <button type="button" className="btn btn-danger" style={{ padding: "10px 40px" }}>追&nbsp;加</button>&nbsp;
                                <button type="button" className="btn btn-primary" style={{ padding: "10px 40px" }}>一括処理</button>
                            </div>
                            <div className="col-6 text-end">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#Modal01" style={{ padding: "10px 40px" }}>絞り込み表示</button>
                            </div>
                        </div>
                        <Table columns={columns} data={data} />
                    </main>
                </div>
            </div>
        </RootLayout>
    );
}

// 担当者削除
export async function employeeDelete(id, router) {
    const confirmationMessage = `削除しますか？`;
    console.debug("message:", confirmationMessage);
    const result = window.confirm(confirmationMessage);

    if (result) {
        console.debug("User clicked OK");
        let result = await employee.employeeDelete(id);
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

export const showList = async () => {
    try {
        const response = await employee.employeeList();
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
        return false;
    }  
}

export const processData = (data) => {
    const resultData = [];
    data.map(row => {
        const aliasNames = row.employeeAliasList.map(obj => obj.aliasName);
        const aliasName = aliasNames.join(', ');
        const isOrg = false;
        
        // レコードあるチャック
        const hasRecord = row.hasOwnProperty('id') && row.id !== null; 

        resultData.push({ ...row, hasRecord, aliasName, isOrg });
    });

    return resultData;
}