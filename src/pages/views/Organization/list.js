import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import { useRouter } from "next/router";
import { organization } from "../../api/organization";

let data;
let setData;
let setErrors;
let errors;

export default function OrganizationList(){

    // router
    const router = useRouter();
    [data, setData] = useState([{"name" : null, "readName" : null, "id" : null, "departmentId" : null, 
    "level" : null,  "parentDepartmentName" : null, "aliasName" : null, "phone" : null, "remarks" : null, "operation" : null, hasRecord : false, hasSubOrganization : false, isOrg : true }]);
    [errors, setErrors] = useState("");
    const [formData, setFormData] = useState({});

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

    //新規登録
    const add = () => {
        router.push("./register")
    }

      //部署一括処理
      const addBatch = () => {
        router.push("./batch_process")
    }

    //階層切替
    const refresh = () => {
        router.push( window.location.reload())
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

    const handleChange = (e) => {
        // 値変更時のformData設定
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFilter = async (e) => {
        try {
            //alert(JSON.stringify(formData));
            const response = await organization.organizationList(formData);
            // APIの結果が正常だった場合
            // 部署なし or その他エラー
            if (response.status == 200 && response !== null) {
                const resultData = [];
                const isOrg = true;
                const res = await response.json();

                res.map(row => {
                    const aliasNames = row.organizationAliasList.map(obj => obj.aliasName);
                    const aliasName = aliasNames.join(', ');
                    // レコードあるチャック
                    const hasRecord = row.hasOwnProperty('id') && row.id !== null; 
            
                    resultData.push({ ...row, hasRecord, aliasName, isOrg });
                });

                setData(resultData);
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

    return(
        <RootLayout top={true} isSidebarInclude={true}>
            <div className="body-wrapper02">
                <div className="container-fluid">
                    <main>
                        <h1 className="h3 mb-3 fw-normal text-start"><i className="bi bi-diagram-3-fill"></i>&nbsp;部署一覧</h1>
                        <div className="row mb-3">
                            <div className="col-6 text-start">
                                <button type="button" className="btn btn-danger" onClick={add} style={{ padding: "10px 40px" }}>追&nbsp;加</button>&nbsp;
                                <button type="button" className="btn btn-primary" onClick={addBatch} style={{ padding: "10px 40px" }}>一括処理</button>
                            </div>
                            <div className="col-6 text-end">
                                <button type="button" className="btn btn-primary" onClick={refresh} style={{ padding: "10px 40px" }}>階層切替</button>&nbsp;
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#Modal01" style={{ padding: "10px 40px" }}>絞り込み表示</button>&nbsp;
                                {
                                    <div className="modal fade" id="Modal01" tabIndex="-1" aria-labelledby="ModalLabel01">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="ModalLabel01">部署絞り込み</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <table className="table table-bordered">
                                                        <tbody>
                                                            <tr>
                                                                <td className="col-6 text-center align-middle bg-light py-3">部署名</td>
                                                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="name" value={formData.name} onChange={handleChange} /></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="col-6 text-center align-middle bg-light py-3">よみ</td>
                                                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="readName" value={formData.readName} onChange={handleChange} /></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="col-6 text-center align-middle bg-light py-3">コード</td>
                                                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="departmentId" value={formData.departmentId} onChange={handleChange} /></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="col-6 text-center align-middle bg-light py-3">階&nbsp;層</td>
                                                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="level" value={formData.level} onChange={handleChange} /></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="col-6 text-center align-middle bg-light py-3">上位組織</td>
                                                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="parentDepartmentName" value={formData.parentDepartmentName} onChange={handleChange} /></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="col-6 text-center align-middle bg-light py-3">別&nbsp;名</td>
                                                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="aliasName" value={formData.aliasName} onChange={handleChange} /></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="col-6 text-center align-middle bg-light py-3">電話番号</td>
                                                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="phone" value={formData.phone} onChange={handleChange} /></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="col-6 text-center align-middle bg-light py-3">備&nbsp;考</td>
                                                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="remarks" value={formData.remarks} onChange={handleChange} /></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <div className="modal-footer">
                                                        <button type="button" onClick={handleFilter} className="btn btn-primary" data-bs-dismiss="modal" style={{padding : "10px 45px"}}>絞り込み</button>
                                                        <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal" style={{padding : "10px 37px"}}>キャンセル</button>
                                                    </div>{/* /.modal-footer  */}
                                                </div>
                                            </div>{/* /.modal-content  */}
                                        </div>{/* /.modal-dialog  */}
                                    </div>
                                }
                                    
                            </div>
                        </div>
                        <Table columns={columns} data={data} />
                    </main>
                </div>
            </div>
        </RootLayout>
    );
}

export const showList = async (formData) => {
    try {
        const response = await organization.organizationList(formData);
        // APIの結果が正常だった場合
        // 部署なし or その他エラー
        if (response.status == 200 && response !== null) {
            const res = await response.json();
            console.log(res);
            const result = processData(res);
            console.log("processData return " + JSON.stringify(result));
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
    console.log(data);
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
    let result = await organization.organizationDelete(id);
    if (result.status == 401) {
        router.push("/");
    } else {
        const result = await showList();
        setData(result);
    }
};


