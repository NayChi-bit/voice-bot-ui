import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import ConfirmModal from "../../../components/confirmModal";
import { useRouter } from "next/router";
import { employee } from "../../api/employee";
import { organization } from "@/pages/api/organization";

export default function EmployeeDetail(){

    // router
    const router = useRouter();
    
    const [data, setData] = useState([{ "id" : null, "name" : null, "readName" : null, "aliasName" : null, "departmentName" : null,
     "phone" : null, "remarks" : null, hasRecord : false}]);
     
    const [error, setErrors] = useState("");

    // edit form data
    const [formData, setFormData] = useState({});

    // parent organization dropdwon
    const [options, setOrganizationOpt] = useState([]);

    // 別名テキスト追加削除
    const [inputFields, setInputFields] = useState([]);

    const [haveError, setHaveError] = useState(false);
    var confirm = "employee";

    useEffect(() => {
        const id = sessionStorage.getItem('employeeId');
        const fetchData = async () => {
            try {
                const response = await showDetail(id);
                setData(response);
                setFormData(response[0]);
                setInputFields(response[0].employeeAliasList.map(item => item.aliasName));
                getOrganizations();
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

        // update employeeAliasList
        const updatedEmployeeAliasList = [...formData.employeeAliasList];
        updatedEmployeeAliasList.splice(index, 1);
        setFormData((prevData) => ({
            ...prevData,
            employeeAliasNameList : newInputFields,
            employeeAliasNames : updatedEmployeeAliasList.map(item => item.aliasName).join(', '),
            employeeAliasList: updatedEmployeeAliasList                
        }));
    };

    const handleChange = (e) => {
        // 値変更時のformData設定
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));

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
            //別名fields set
            const newInputFields = [...inputFields];
            newInputFields[index] = e.target.value; // Update the value of the input field at the specified index
            setInputFields(newInputFields);
            const updatedEmployeeAliasList = [...formData.employeeAliasList];
            updatedEmployeeAliasList[index] = {aliasName:e.target.value};

            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                employeeAliasNameList : newInputFields,
                employeeAliasNames : updatedEmployeeAliasList.map(item => item.aliasName).join(', '),
                employeeAliasList: updatedEmployeeAliasList                
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
            
            // editEmployee(formData);
            setHaveError(false); 
        } else {
            setHaveError(true);
          console.log("Error Data:", error)
        }
    };

    // validation
    const validateForm = () => {
        // 部署名チャック
        if (!formData.name || !formData.name.trim()) {
            setErrors("担当者名を入力してください。");
            return false;
        }

        // 上位組織チャック
        if(formData.departmentId === null || !formData.departmentId){
            setErrors("所属部署名を選択してください。");
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

    const editEmployee = async (formData) => {
        try {
          const response = await employee.employeeEdit(formData);
          if (response.status == 409) {
            const result = await response.json();
            alert(JSON.stringify(result.body));
          } 
          else if (response.status == 401) {
            router.push("/");
          } else if (response.status == 200) {
            alert("担当者の登録は完了しました。");
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

    const getOrganizations = async () => {
        try {
          const response = await organization.organizationList();
          console.debug(response);
  
          if (response.status == 200) {
            const data = await response.json();
            const dropdownOptions = data.map(item => ({
                value: item.id,
                label: item.name
              }));
              setOrganizationOpt(dropdownOptions);
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
        const employeeAliasNames = aliasNames.join(', ');
        
        // レコードあるチャック
        const hasRecord = data.hasOwnProperty('id') && data.id !== null; 

        resultData.push({ ...data, hasRecord, aliasName, employeeAliasNames });

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
                            <div className="modal fade editModal" id="Modal01" tabIndex="-1" aria-labelledby="ModalLabel01">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="ModalLabel01">担当者詳細編集</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="error-message" id="error-message" style={{marginBottom :"15px"}}>{error}</div>
                                            <table className="table table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <td className="text-center align-middle bg-light py-3">担当者名</td>
                                                        <td className="text-center align-middle py-3"><input type="text" className="custom-input edit-input" name="name" value={formData.name} onChange={(e) => handleChange(e)} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center align-middle bg-light py-3">よみ</td>
                                                        <td className="text-center align-middle py-3"><input type="text" className="custom-input edit-input" name="readName" value={formData.readName} onChange={(e) => handleChange(e)} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center align-middle bg-light py-3">担当者別名</td>
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
                                                        <td className="text-center align-middle bg-light py-3">所属部署</td>
                                                        <td className="text-center align-middle py-3">
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <select name="departmentId" value={formData.departmentId} onChange={(e) => handleChange(e)} className="form-select" id="Select02" aria-label="Default select" style={{width:"325px", height: "50px"}}>
                                                                    <option value="">部署一覧から選択</option>
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
                                                        <td className="text-center align-middle bg-light py-3">電話番号</td>
                                                        <td className="text-center align-middle py-3"><input type="text" name="phone" className="custom-input edit-input" value={formData.phone} onChange={(e) => handleChange(e)} /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center align-middle bg-light py-3">備考</td>
                                                        <td className="text-center align-middle py-3"><input type="text" name="remarks" className="custom-input edit-input" value={formData.remarks} onChange={(e) => handleChange(e)} /></td>
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
                        {!haveError && (<ConfirmModal formData={formData} actionForm={editEmployee} confirm={confirm}/>)}
                    </main>
                </div>
            </div>
        </RootLayout>
    );
}




