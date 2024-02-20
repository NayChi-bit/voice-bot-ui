import React, { useState, useEffect } from "react";
import Table from "@/components/table";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleUp, faFileLines, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function ManagerList(){

    // router
    const router = useRouter();

    const userAdd = () => {
        router.push("User/userRegister")
    }

    const columns = React.useMemo(
        () => [
            {
                id: 'expander', // Make sure it has an ID
                Cell: ({ row }) =>
                    row.canExpand ? (
                        <span
                            {...row.getToggleRowExpandedProps({
                                style: {
                                    paddingLeft: `${row.depth * 2}rem`,
                                },
                            })}
                        >
                            {row.isExpanded ? (
                                <FontAwesomeIcon icon={faAngleUp} />
                                ) : (
                                <FontAwesomeIcon icon={faAngleRight} />
                            )}
                        </span>
                    ) : null,
            },
            {
                Header: 'ユーザID',
                accessor: 'userId',
            },
            {
                Header: 'ユーザ名',
                accessor: 'userName',
            },
            {
                Header: 'リセット',
                accessor: 'reset',
            },
            {
                Header: 'ロック',
                accessor: 'lock',
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
        ],
        []
    )

    const data = [
        {
            "userId": "user1",
            "userName": "nay1",
            "reset": "false",
            "lock": "false",
            "subRows": [
                {
                    "userId": "user2",
                    "userName": "nay2",
                    "reset": "false",
                    "lock": "false",
                    "delete": "icon",
                    "detail": "icon",
                    "subRows": [
                        {
                            "userId": "user3",
                            "userName": "nay3",
                            "reset": "false",
                            "lock": "false",
                            "delete": "icon",
                            "detail": "icon",
                        }
                    ]
                },
                {
                    "userId": "user4",
                    "userName": "nay4",
                    "reset": "false",
                    "lock": "false",
                    "subRows": [
                        {
                            "userId": "user5",
                            "userName": "nay5",
                            "reset": "false",
                            "lock": "false",
                        }
                    ]
                }
            ]
        },
        {
            "userId": "user1",
            "userName": "nay1",
            "reset": "false",
            "lock": "false",
            "subRows": [
                {
                    "userId": "user2",
                    "userName": "nay2",
                    "reset": "false",
                    "lock": "false",
                    "subRows": [
                        {
                            "userId": "user3",
                            "userName": "nay3",
                            "reset": "false",
                            "lock": "false",
                        }
                    ]
                },
                {
                    "userId": "user4",
                    "userName": "nay4",
                    "reset": "false",
                    "lock": "false",
                    "subRows": [
                        {
                            "userId": "user5",
                            "userName": "nay5",
                            "reset": "false",
                            "lock": "false",
                        }
                    ]
                }
            ]
        }

    ]

    return(
        <div className="call-log-viewer-container">
            <h2 className="font-weight-bold">担当者一覧</h2>
            <div className="inner-container">
            <button
                  className="btn  btn-outline-dark btn-sm"
                  onClick={userAdd}
                  style={{ minWidth: "60px" }}
                >追加</button>
            <button
                  className="btn  btn-outline-dark btn-sm"
                  onClick={userAdd}
                  style={{ minWidth: "60px" }}
                >一括管理</button>
            <button
                  className="btn  btn-outline-dark btn-sm"
                  onClick={userAdd}
                  style={{ minWidth: "60px", marginLeft: "auto" }}
                >絞込み</button>
            </div>
            <Table columns={columns} data={data} />
        </div>
    );
}