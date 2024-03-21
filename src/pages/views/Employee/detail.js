import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import { useRouter } from "next/router";
import { employee } from "../../api/employee";

export default function organizationDetail(){

    // router
    const router = useRouter();
    
    const [data, setData] = useState([{ "id" : null, "name" : null, "readName" : null, "aliasName" : null, "departmentName" : null,
     "phone" : null, "remarks" : null, hasRecord : false}]);
     
    const [error, setErrors] = useState("");

    useEffect(() => {
        const id = sessionStorage.getItem('employeeId');
        const fetchData = async () => {
            try {
                const response = await showDetail(id);
                setData(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // 戻るボタン押す
    const handleBack = (e) => {
        e.preventDefault();
        router.push("./list");
    }

    const showDetail = async (id) => {
        try {
            const response = await employee.employeeDetail(id);
            // APIの結果が正常だった場合
            // 部署なし or その他エラー
            if (response.status == 200 && response !== null) {
                const res = await response.json();
                const result = processData(res);
                return result;

            } else {
                return false;
            }
        } catch (errors) {
            // APIの結果が異常
            console.debug(errors.status);
            console.error("エラーerror:", errors);
            return false;
        }  
    }

    const processData = (data) => {
        const resultData = [];
        
        const aliasNames = data.employeeAliasList.map(obj => obj.aliasName);
        const aliasName = aliasNames.join(', ');
        
        // レコードあるチャック
        const hasRecord = data.hasOwnProperty('id') && data.id !== null; 

        resultData.push({ ...data, hasRecord, aliasName });

        return resultData;
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
            }
        ],
        []
    )

    return(
        <RootLayout>
            <div className="body-wrapper01">
                <div className="container-fluid">
                    <main className="form-signin">
                        <form>
                            <i className="bi bi-diagram-3-fill" style={{fontSize: "4rem"}}></i>
                            <h1 className="h3 mb-3 fw-normal">担当者詳細</h1>
                            <div className="form-floating mb-3">
                                <Table columns={columns} data={data} paginationEnabled={false} isVarticleTable={true}/>
                                <div className="my-5">
                                    <button type="button" className="btn btn-lg btn-primary" data-bs-toggle="modal" data-bs-target="#Modal01" style={{padding :"10px 60px"}}>編&nbsp;集</button>&nbsp;&nbsp;
                                    <button className="btn btn-lg btn-secondary" type="button" onClick={handleBack} style={{padding :"10px 60px"}}>戻&nbsp;る</button>
                                </div>
                            </div>
                        </form>
                        {
                            <div className="modal fade" id="Modal01" tabIndex="-1" aria-labelledby="ModalLabel01">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="ModalLabel01">担当者詳細&nbsp;集</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
                                        </div>
                                        <div className="modal-body">
                                            <table className="table table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">担当者ID</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].id} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">担当者名</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].name} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">よみ</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].readName} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">担当者別名</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].employeeAliasList?.map((item) => item.aliasName).join(', ') || ''} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">所属部署</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].departmentName} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">電話番号</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].phone} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">備考</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].remarks}/></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary" style={{padding : "10px 45px"}}>編&nbsp;集</button>
                                                <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal" style={{padding : "10px 37px"}}>キャンセル</button>
                                            </div>{/* /.modal-footer  */}
                                        </div>
                                    </div>{/* /.modal-content  */}
                                </div>{/* /.modal-dialog  */}
                            </div>
                        }
                    </main>
                </div>
            </div>
        </RootLayout>
    );
}




