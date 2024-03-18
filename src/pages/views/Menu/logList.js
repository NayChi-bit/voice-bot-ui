import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import callLogList from "../../api/callLog";

export default function Home() {
    // router
    const router = useRouter();
    const [error, setErrors] = useState("");
    // テーブルデータ
    const [data, setData] = useState([{"callTime" : null, "deptName" : null, "userName" : null, "download" : null, hasRecord : false }]);

    // 初期表示時
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
            const response = await callLogList();
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

    const columns =  [
        {
            Header: '通話時刻',
            accessor: 'callTime',
        },
        {
            Header: '部 署',
            accessor: 'deptName',
        },
        {
            Header: '担当者',
            accessor: 'userName',
        },
        {
            Header: '',
            accessor: 'download',
        },
    ];

    return (
        <RootLayout top={true} isSidebarInclude={true}>
        <div className="body-wrapper02">
            <div className="container-fluid">
                <main>
                    <div className="row mb-4">
                        <div className="col text-start">
                            <h1 className="h3 mb-3 fw-normal"><i className="bi bi-clipboard-check-fill"></i>&nbsp;ログ管理</h1>
                        </div>
                        <div className="col text-end">
                            <button type="button" className="btn btn-primary" style={{padding: "10px 40px"}}>一括ダウンロード</button>
                        </div>
                    </div>
                    <form>
                        <div className="row mb-3">
                            <div className="col text-start">
                                <label htmlFor="period">期間</label>
                                <input type="text" className="form-control" id="period" style={{height: "46px"}} />
                            </div>
                            <div className="col text-start">
                                <label htmlFor="department">部署名</label>
                                <input type="text" className="form-control" id="department" style={{height: "46px"}} />
                            </div>
                            <div className="col text-start">
                                <label htmlFor="contactPerson">担当者名</label>
                                <input type="text" className="form-control" id="contactPerson" style={{height: "46px"}} />
                            </div>
                            <div className="col d-flex align-items-end">
                                <button type="button" className="btn btn-dark" style={{padding: "10px 40px"}}>検&nbsp;索</button>
                            </div>
                        </div>
                    </form>
                    <Table columns={columns} data={data} paginationEnabled={true} />
                </main>
            </div>
            </div>
        </RootLayout>
    );
}
