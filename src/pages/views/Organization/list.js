import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import Modal from "../../../components/modal";
import { useRouter } from "next/router";
import { organization } from "../../api/organization";

let data;
let setData;
export default function OrganizationList(){

    // router
    const router = useRouter();
    [data, setData] = useState([{"name" : null, "readName" : null, "id" : null, "departmentId" : null, 
    "level" : null,  "parentDepartmentName" : null, "aliasName" : null, "phone" : null, "remarks" : null, "operation" : null, hasRecord : false, hasSubOrganization : false, isOrg : true }]);

    const [error, setErrors] = useState("");

    //モデル
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = (event) => {
        event.stopPropagation();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        alert("close modal");
        setIsModalOpen(false);
    };

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

    const add = () => {
        router.push("./register")
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
                                <i className="bi bi-arrow-down-square-fill fs-4" />
                                ) : (
                                <i className="bi bi-arrow-right-square-fill fs-4" />
                            )}

                        </span>
                    ) : null,
            },
            {
                id: 'name',
                Header: '部署名',
                accessor: 'name',
            },
            {
                id: 'readName',
                Header: 'よみ',
                accessor: 'readName',
            },
            {
                id: 'id',
                Header: 'ID',
                accessor: 'id',
            },
            {
                id: 'departmentId',
                Header: 'コード',
                accessor: 'departmentId',
            },
            {
                id: 'level',
                Header: '階層',
                accessor: 'level',
            },
            {
                id: 'parentDepartmentName',
                Header: '上位組織',
                accessor: 'parentDepartmentName',
            },
            {
                id: 'aliasName',
                Header: '別名',
                accessor: 'aliasName',
            },
            {
                id: 'ph',
                Header: '電話番号',
                accessor: 'phone',
            },
            {
                id: 'remarks',
                Header: '備考',
                accessor: 'remarks',
            },
            {
                id: 'operation',
                Header: '操作',
                accessor: 'operation',
            },
        ],
        []
    )

    return(
        <RootLayout top={true} isSidebarInclude={true}>
            <div className="body-wrapper02">
                <div className="container-fluid">
                    <main>
                        <h1 className="h3 mb-3 fw-normal text-start"><i className="bi bi-diagram-3-fill"></i>&nbsp;部署一覧</h1>
                        <div className="row mb-3">
                            <div className="col-6 text-start">
                                <button type="button" className="btn btn-danger" onClick={add} style={{ padding: "10px 40px" }}>追&nbsp;加</button>&nbsp;
                                <button type="button" className="btn btn-primary" style={{ padding: "10px 40px" }}>一括処理</button>
                            </div>
                            <div className="col-6 text-end">
                                <button type="button" onClick={ (event) => openModal(event)} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#Modal01" style={{ padding: "10px 40px" }}>絞り込み表示</button>&nbsp;
                                <Modal onClose={() => setShowModal(false)} show={isModalOpen}></Modal>
                                {/* <button type='button' onClick={() => setShowModal(true)} className="btn btn-primary"  style={{ padding: "10px 40px" }}>絞り込み表示</button>
                                <Modal onClose={() => setShowModal(false)} show={showModal}></Modal> */}
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
        const response = await organization.organizationList();
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
    const parentRows = [];
    data.map(row => {
        const aliasNames = row.organizationAliasList.map(obj => obj.aliasName);
        const aliasName = aliasNames.join(', ');
        // レコードあるチャック
        const hasRecord = row.hasOwnProperty('id') && row.id !== null; 
        const isOrg = true;

        //上位組織あるチャック
        if(row.parentDepartmentName !== null){

            //全ての階層にチャック
            parentRows.forEach((parentRow) => {
                if(parentRow.name === row.parentDepartmentName){
                    parentRow.subRows.push({...row, subRows: [], hasRecord, aliasName, isOrg });
                }
                
                if(parentRow.subRows){
                    parentRow.subRows.forEach(subRow => {
                        if(subRow.name === row.parentDepartmentName){
                            subRow.subRows.push({...row, subRows: [], hasRecord, aliasName, isOrg });
                        }
                    })
                }
            });
            
        }else{
            // Add the parent row to the parentRows array
            parentRows.push({ ...row, subRows: [], hasRecord, aliasName, isOrg });
        }
    });
    return parentRows;
}

// 部署削除
export async function organizationDelete(id, router) {
    const confirmationMessage = `削除しますか？`;
    console.debug("message:", confirmationMessage);
    const result = window.confirm(confirmationMessage);

    if (result) {
        console.debug("User clicked OK");
        let result = await organization.organizationDelete(id);
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


