import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import ConfirmModal from "../../../components/confirmModal";
import { useRouter } from "next/router";
import { organization } from "../../api/organization";

export default function OrganizationDetail(){

    // router
    const router = useRouter();
    
    const [data, setData] = useState([{"name" : null, "readName" : null, "id" : null, "departmentId" : null, 
    "level" : null,  "parentDepartmentName" : null, "aliasName" : null, "phone" : null, "remarks" : null, "operation" : null, hasRecord : false, hasSubOrganization : false }]);

    const [error, setErrors] = useState("");

    // edit form data
    const [formData, setFormData] = useState({});
    
    // parent organization dropdwon
    const [options, setParentOrgOpt] = useState([]);

    // level dropdown
    const [selectedValue, setSelectedValueLevel] = useState('');

    // 別名テキスト追加削除
    const [inputFields, setInputFields] = useState([]);

    const [haveError, setHaveError] = useState(false);
    var confirm = "org";

    useEffect(() => {
        if (selectedValue !== '') {
            getParentOrgOpt(selectedValue);
        }
        setSelectedValueLevel(selectedValue);
    }, [selectedValue]); // This useEffect will run whenever level changes

    useEffect(() => {
        const id = sessionStorage.getItem('organizationId');
        const fetchData = async () => {
            try {
                const response = await showDetail(id);
                setData(response);
                setFormData(response[0]);
                setInputFields(response[0].organizationAliasList.map(item => item.aliasName));
                setSelectedValueLevel(response[0].level);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // 別名＋ボタン押す
    const handleAddField = () => {
        setInputFields([...inputFields, '']); // Add a new empty input field
    };
        
    // 別名ーボタン押
    const handleRemoveField = (index) => {
        const newInputFields = [...inputFields];
        newInputFields.splice(index, 1); // Remove the input field at the specified index
        setInputFields(newInputFields);

        // update organizationAliasList
        const updatedOrganizationAliasList = [...formData.organizationAliasList];
        updatedOrganizationAliasList.splice(index, 1);
        setFormData((prevData) => ({
            ...prevData,
            organizationAliasNameList : newInputFields,
            organizationAliasNames :  updatedOrganizationAliasList.map(item => item.aliasName).join(', '),
            organizationAliasList: updatedOrganizationAliasList
        }));
    };

    const getParentOrgOpt = async (level) => {
        try {
          const response = await organization.parentOrgList(level);
          console.debug(response);
  
          if (response.status == 200) {
            const data = await response.json();
            const dropdownOptions = data.map(item => ({
                value: item.name,
                label: item.name
              }));
              setParentOrgOpt(dropdownOptions);
          } else {
            return false;
          }
        } catch (error) {
          // APIの結果が異常
          console.log("エラーerror:", error);
          return false;
        }
    };

    // 戻るボタン押す
    const handleBack = (e) => {
        e.preventDefault();
        router.push("./list");
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if(name == "level") {
            setSelectedValueLevel(e.target.value);
        }

        if (!haveError) {
            const confirmButton = document.getElementById("confirmBtn");
            confirmButton.removeAttribute("data-bs-toggle", "modal");
        }
    };

    // 別名dropdown
    const handleChangeReadName = (index = null) => (e) => {
        // 値変更時のformData設定
        const { name, value } = e.target;
        if (index !== null) {
            // 別名fields set
            const newInputFields = [...inputFields];
            newInputFields[index] = e.target.value; // Update the value of the input field at the specified index
            const updatedOrganizationAliasList = [...formData.organizationAliasList];
            updatedOrganizationAliasList[index] = {aliasName:e.target.value};
            setInputFields(newInputFields);
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                organizationAliasNameList : newInputFields,
                organizationAliasNames : updatedOrganizationAliasList.map(item => item.aliasName).join(', '),
                organizationAliasList: updatedOrganizationAliasList                
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // エラー出力箇所
        var errorMessage = document.getElementById("error-message");

        if (validateForm()) {
            console.debug("Form Data:", formData);
            errorMessage.innerHTML = "";
            
            // editOrg(formData);
            setHaveError(false); 
        } else {
            setHaveError(true);
          console.log("Error Data:", error)
        }
    };

    // validation
    const validateForm = () => {
        // 部署名の検証
        const departmentIdIdRegex = /[^a-zA-Z0-9]/;
        if (!formData.departmentId || !formData.departmentId.trim()) {
            setErrors("部署IDを入力してください");
            return false;
        } else if (departmentIdIdRegex.test(formData.departmentId)) {
            setErrors("部署IDが正しくありません。使用できない文字が含まれています。");
            return false;
        } 

        // 部署名チャック
        if (!formData.name || !formData.name.trim()) {
            setErrors("部署名を入力してください");
            return false;
        }

        // 位組織チャック
        if(formData.level !== 1 && (formData.parentDepartmentName === null || !formData.parentDepartmentName)){
            setErrors("上位組織を選択してください。");
            return false;
        }

        //電話番号チャック
        const phoneNumberRegex = /^[\d-]+$/;
        if (!phoneNumberRegex.test(formData.phone)) {
            setErrors("電話番号は不要な文字が入ってしまいました。");
            return false;
        }

        return true;
    };

    const editOrg = async (formData) => {
        try {
            const response = await organization.organizationEdit(formData);
            if (response.status == 409) {
                const result = await response.json();
                alert(JSON.stringify(result.body));
            } 
            else if (response.status == 401) {
                router.push("/");
            } else if (response.status == 200) {
            alert("部署の登録は完了しました。");
                router.reload();
            } else {
                alert("登録に失敗しました");
            return false;
            }
        } catch (error) {
            // APIの結果が異常
            console.log("エラーerror:", error);
            alert("登録に失敗しました");
            return false;
        }
    };
        

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
        const organizationAliasNames = aliasNames.join(', ');

        resultData.push({ ...data, aliasName , organizationAliasNames });
       
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
                            <div className="modal fade editModal" id="Modal01" tabIndex="-1" aria-labelledby="ModalLabel01">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="ModalLabel01">部署詳細編集</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="error-message" id="error-message" style={{marginBottom :"15px"}}>{error}</div>
                                            <table className="table table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <td className="text-center align-middle bg-light py-3">部署コード</td>
                                                        <td className="text-center align-middle py-3"><input type="text" className="custom-input edit-input" name="departmentId" value={formData.departmentId} onChange={(e) => handleChange(e)}/></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center align-middle bg-light py-3">部署名</td>
                                                        <td className="text-center align-middle py-3"><input type="text" className="custom-input edit-input" name="name" value={formData.name} onChange={(e) => handleChange(e)}/></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center align-middle bg-light py-3">よみ</td>
                                                        <td className="text-center align-middle py-3"><input type="text" className="custom-input edit-input" name="readName" value={formData.readName} onChange={(e) => handleChange(e)}/></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center align-middle bg-light py-3">階層</td>
                                                        <td className="text-center align-middle py-3">
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <select name="level" value={formData.level} onChange={(e) => handleChange(e)} className="form-select" id="Select01" aria-label="Default select" style={{width:"325px", height: "50px"}}>
                                                                    <option value="1">1</option>
                                                                    <option value="2">2</option>
                                                                    <option value="3">3</option>
                                                                </select>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center align-middle bg-light py-3">上位組織</td>
                                                        <td className="text-center align-middle py-3">
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <select name="parentDepartmentName" value={formData.parentDepartmentName} onChange={(e) => handleChange(e)} className="form-select" id="Select02" aria-label="Default select" style={{width:"325px", height: "50px"}}>
                                                                    <option value="">上位組織を選択してください</option>
                                                                    {options.map(option => (
                                                                        <option key={option.value} value={option.value}>
                                                                        {option.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center align-middle bg-light py-3">別名</td>
                                                        <td className="text-center align-middle py-3" style={{position: "relative"}}>
                                                            { inputFields.map((input, index) => (
                                                                <div key={index} className="icon-btn">
                                                                    <input key={index} type="text" name={`input_${index}`} value={input} onChange={(e) => handleChangeReadName(index)(e)} className="custom-input edit-input mb-3 me-2" />
                                                                    { inputFields.length > 1 && (
                                                                        <i className="bi bi-dash-circle-fill btn-danger" onClick={() => handleRemoveField(index)} style={{fontSize: "2.6rem", position: "absolute", top: `${10 + index * 65}px`,  right: "5px", color: "#dc3545"}}></i>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            { inputFields.length < 5 && (
                                                                <i className="bi bi-plus-circle-fill" onClick={handleAddField} style={{fontSize: "2.6rem", position: "absolute", top: `${inputFields.length === 1 ? 67 : 10 + inputFields.length * 63}px`, right: "5px"}}></i>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center align-middle bg-light py-3">電話番号</td>
                                                        <td className="text-center align-middle py-3"><input type="text" className="custom-input edit-input" name="phone" value={formData.phone} onChange={(e) => handleChange(e)}/></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center align-middle bg-light py-3">備考</td>
                                                        <td className="text-center align-middle py-3"><input type="text" className="custom-input edit-input" name="remarks" value={formData.remarks} onChange={(e) => handleChange(e)}/></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className="modal-footer">
                                                <button type="button" id="confirmBtn" className="btn btn-primary" data-bs-toggle={!haveError ? "modal" : ""} data-bs-target="#ConfirmModal" style={{padding : "10px 45px"}} onClick={handleSubmit}>更&nbsp;新</button>
                                                <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal" style={{padding : "10px 37px"}}>キャンセル</button>
                                            </div>{/* /.modal-footer  */}
                                        </div>
                                    </div>{/* /.modal-content  */}
                                </div>{/* /.modal-dialog  */}
                            </div>
                        }
                        {!haveError && (<ConfirmModal formData={formData} actionForm={editOrg} confirm={confirm}/>)}
                    </main>
                </div>
            </div>
        </RootLayout>
    );
}




