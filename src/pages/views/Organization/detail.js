import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import Modal from "../../../components/modal";
import { useRouter } from "next/router";
import { organization } from "../../api/organization";

export default function organizationDetail(){

    const [data, setData] = useState([{"name" : null, "readName" : null, "id" : null, "departmentId" : null, 
    "level" : null,  "parentDepartmentName" : null, "aliasName" : null, "phone" : null, "remarks" : null, "operation" : null, hasRecord : false, hasSubOrganization : false }]);

    const [error, setErrors] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const id = sessionStorage.getItem('organizationId');
        const fetchData = async () => {
            try {
                const response = await showDetail(id);
                setData(response);
                //setLoading(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </RootLayout>
    );
}




