import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import { useRouter } from "next/router";
import { employee } from "../../api/employee";
import { error } from "jquery";

let data;
let setData;
export default function EmployeeList(){

    // router
    const router = useRouter();

    [data, setData] = useState([{id : null, "name" : null, "readName" : null, "aliasName" : null, "departmentName" : null,
     "phone" : null, "remarks" : null, "operation" : null, hasRecord : false, isOrg: false }]);
    const [formData, setFormData] = useState({});

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

    const handleChange = (e) => {
        // 値変更時のformData設定
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const employeeAdd = () => {
        router.push("./register");
    }

    //担当者一括処理
     const addBatch = () => {
        router.push("./batch_process")
    }

    const handleFilter = async (e) => {
        try {
            console.log(formData);
            const response = await employee.employeeList(formData);
            // APIの結果が正常だった場合
            // 部署なし or その他エラー
            if (response.status == 200 && response !== null) {
                const resultData = [];
                const isOrg = false;
                const res = await response.json();

                res.map(row => {
                    const aliasNames = row.employeeAliasList.map(obj => obj.aliasName);
                    const aliasName = aliasNames.join(', ');
                    
                    // レコードあるチャック
                    const hasRecord = row.hasOwnProperty('id') && row.id !== null; 
            
                    resultData.push({ ...row, hasRecord, aliasName, isOrg });
                });

                setData(resultData);
                return res;
    
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

    //階層切替
    const refresh = () => {
        router.push( window.location.reload())
    }

    return(
        <RootLayout top={true} isSidebarInclude={true}>
            <div className="body-wrapper02">
                <div className="container-fluid">
                    <main>
                        <h1 className="h3 mb-3 fw-normal text-start"><i className="bi bi-person-bounding-box"></i>&nbsp;担当者一覧</h1>
                        <div className="row mb-3">
                            <div className="col-6 text-start">
                                <button type="button" className="btn btn-danger" onClick={employeeAdd} style={{ padding: "10px 40px" }}>追&nbsp;加</button>&nbsp;
                                <button type="button" className="btn btn-primary" onClick={addBatch} style={{ padding: "10px 40px" }}>一括処理</button>
                            </div>
                            <div className="col-6 text-end">
                                <button type="button" className="btn btn-primary" onClick={refresh} style={{ padding: "10px 40px" }}>階層切替</button>&nbsp;
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#Modal01" style={{ padding: "10px 40px" }}>絞り込み表示</button>
                            
                                <div className="modal fade" id="Modal01" tabIndex="-1" aria-labelledby="ModalLabel01">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="ModalLabel01">担当者絞り込み</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
                                            </div>
                                            <div className="modal-body">
                                                <table className="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td className="col-6 text-center align-middle bg-light py-3">担当者</td>
                                                            <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="name" value={formData.name} onChange={handleChange} /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="col-6 text-center align-middle bg-light py-3">よみ</td>
                                                            <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="readName" value={formData.readName} onChange={handleChange} /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="col-6 text-center align-middle bg-light py-3">別 名</td>
                                                            <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="aliasName" value={formData.aliasName} onChange={handleChange} /></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="col-6 text-center align-middle bg-light py-3">所属部署</td>
                                                            <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" name="departmentName" value={formData.departmentName} onChange={handleChange} /></td>
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