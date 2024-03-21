import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import { useRouter } from "next/router";
import { organization } from "../../api/organization";

export default function organizationDetail(){

    // router
    const router = useRouter();
    
    const [data, setData] = useState([{"name" : null, "readName" : null, "id" : null, "departmentId" : null, 
    "level" : null,  "parentDepartmentName" : null, "aliasName" : null, "phone" : null, "remarks" : null, "operation" : null, hasRecord : false, hasSubOrganization : false }]);

    const [error, setErrors] = useState("");

    useEffect(() => {
        const id = sessionStorage.getItem('organizationId');
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
            const response = await organization.organizationDetail(id);
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
        
        const aliasNames = data.organizationAliasList.map(obj => obj.aliasName);
        const aliasName = aliasNames.join(', ');

        resultData.push({ ...data, aliasName });
       
        return resultData;
    }

    const columns = React.useMemo(
        () => [
            {
                id: 'id',
                Header: '部署ID',
                accessor: 'id',
            },
            {
                id: 'departmentId',
                Header: '部署コード',
                accessor: 'departmentId',
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
                            <h1 className="h3 mb-3 fw-normal">部署詳細</h1>
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
                                            <h1 className="modal-title fs-5" id="ModalLabel01">部署詳細編&nbsp;集</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
                                        </div>
                                        <div className="modal-body">
                                            <table className="table table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">部署ID</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].id} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">部署コード</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].departmentId} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">部署名</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].name} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">よみ</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].readName} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">階層</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].level} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">上位組織</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].parentDepartmentName} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">別名</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].organizationAliasList?.map((item) => item.aliasName).join(', ') || ''}/></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">電話番号</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].phone} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="col-6 text-center align-middle bg-light py-3">備考</td>
                                                        <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" value={data[0].remarks} /></td>
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




