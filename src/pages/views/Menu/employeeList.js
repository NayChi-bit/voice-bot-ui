import React, { useState, useEffect } from "react";
import Table from "../../../components/table";
import { useRouter } from "next/router";

export default function ManagerList(){

    // router
    const router = useRouter();
    const [data, setData] = useState([{"name" : null, "readName" : null, "otherName" : null, "department" : null,
     "phone" : null, "remarks" : null, "operation" : null, hasRecord : false}]);

    const userAdd = () => {
        router.push("User/userRegister")
    }

    const columns = React.useMemo(
        () => [
            {
                Header: '担当者ID',
                accessor: 'employeeId',
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
                accessor: 'otherName',
            },
            {
                Header: '所属部署',
                accessor: 'department',
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

    // const data = [
    //     {
    //         "userId": "user1",
    //         "userName": "nay1",
    //         "reset": "false",
    //         "lock": "false",
    //         "subRows": [
    //             {
    //                 "userId": "user2",
    //                 "userName": "nay2",
    //                 "reset": "false",
    //                 "lock": "false",
    //                 "delete": "icon",
    //                 "detail": "icon",
    //                 "subRows": [
    //                     {
    //                         "userId": "user3",
    //                         "userName": "nay3",
    //                         "reset": "false",
    //                         "lock": "false",
    //                         "delete": "icon",
    //                         "detail": "icon",
    //                     }
    //                 ]
    //             },
    //             {
    //                 "userId": "user4",
    //                 "userName": "nay4",
    //                 "reset": "false",
    //                 "lock": "false",
    //                 "subRows": [
    //                     {
    //                         "userId": "user5",
    //                         "userName": "nay5",
    //                         "reset": "false",
    //                         "lock": "false",
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userId": "user1",
    //         "userName": "nay1",
    //         "reset": "false",
    //         "lock": "false",
    //         "subRows": [
    //             {
    //                 "userId": "user2",
    //                 "userName": "nay2",
    //                 "reset": "false",
    //                 "lock": "false",
    //                 "subRows": [
    //                     {
    //                         "userId": "user3",
    //                         "userName": "nay3",
    //                         "reset": "false",
    //                         "lock": "false",
    //                     }
    //                 ]
    //             },
    //             {
    //                 "userId": "user4",
    //                 "userName": "nay4",
    //                 "reset": "false",
    //                 "lock": "false",
    //                 "subRows": [
    //                     {
    //                         "userId": "user5",
    //                         "userName": "nay5",
    //                         "reset": "false",
    //                         "lock": "false",
    //                     }
    //                 ]
    //             }
    //         ]
    //     }

    // ]

    return(
        // <div className="call-log-viewer-container">
        //     <h2 className="font-weight-bold">担当者一覧</h2>
        //     <div className="inner-container">
        //     <button
        //           className="btn  btn-outline-dark btn-sm"
        //           onClick={userAdd}
        //           style={{ minWidth: "60px" }}
        //         >追加</button>
        //     <button
        //           className="btn  btn-outline-dark btn-sm"
        //           onClick={userAdd}
        //           style={{ minWidth: "60px" }}
        //         >一括管理</button>
        //     <button
        //           className="btn  btn-outline-dark btn-sm"
        //           onClick={userAdd}
        //           style={{ minWidth: "60px", marginLeft: "auto" }}
        //         >絞込み</button>
        //     </div>
        //     <Table columns={columns} data={data} />
        // </div>
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
    );
}