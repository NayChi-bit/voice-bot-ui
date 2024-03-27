import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import ConfirmModal from "../../../components/confirmModal";
import { useRouter } from "next/router";
import { employee } from "../../api/employee";
import { organization } from "@/pages/api/organization";

export default function EmployeeRegister(){
    // router
    const router = useRouter();

    // error
    const [error, setErrors] = useState("");

    const [formData, setFormData] = useState({});
    //parent organization dropdwon
    const [options, setOrganizationOpt] = useState([]);
    
    //別名テキスト追加削除
    const [inputFields, setInputFields] = useState(['']);

    const [haveError, setHaveError] = useState(false);
    var confirm = "employee";

    useEffect(() => {
        getOrganizations();
    }, []);// This useEffect will run whenever level changes

    
    //別名＋ボタン押す
    const handleAddField = () => {
        setInputFields([...inputFields, '']); // Add a new empty input field
    };
    
    //別名ーボタン押
    const handleRemoveField = (index) => {
        const newInputFields = [...inputFields];
        newInputFields.splice(index, 1); // Remove the input field at the specified index
        setInputFields(newInputFields);
    };

    const handleChange = (e) => {
        // 値変更時のformData設定
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    //別名dropdown
    const handleChangeReadName = (index = null) => (e) => {
        // 値変更時のformData設定
        const { name, value } = e.target;
        if (index !== null) {
            //別名fields set
            const newInputFields = [...inputFields];
            newInputFields[index] = e.target.value; // Update the value of the input field at the specified index
            setInputFields(newInputFields);
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                employeeAliasNameList : newInputFields,
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
            
            // registEmployee(formData);
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

        //上位組織チャック
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

    const registEmployee = async (formData) => {
        try {
          const response = await employee.employeeCreate(formData);
          if (response.status == 409) {
            const result = await response.json();
            alert(JSON.stringify(result.body));
          } 
          else if (response.status == 401) {
            router.push("/");
          } else if (response.status == 200) {
            alert("担当者の登録は完了しました。");
            router.push("./list");
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

    return(
        <RootLayout top={true} isSidebarInclude={true}>
            <div className="body-wrapper01">
                <div className="container-fluid">
                    <div>
                        <form method="post" onSubmit={handleSubmit}>
                            <i className="bi bi-diagram-3-fill" style={{fontSize: "4rem"}}></i>
                            <h1 className="h3 mb-3 fw-normal">担当者追加</h1>
                            <div className="error-message" id="error-message">{error}</div>
                            <div className="form-floating mb-3">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">担当者名</td>
                                            <td className="col-6 text-center align-middle"><input type="text" className="custom-input" name="name" value={formData.name} onChange={(e) => handleChange(e)}  /></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">よみ</td>
                                            <td className="col-6 text-center align-middle"><input type="text" className="custom-input" name="readName" value={formData.readName} onChange={(e) => handleChange(e)} /></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">所属部署</td>
                                            <td className="col-6 text-center align-middle py-4">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <select name="departmentId" value={formData.departmentId} onChange={(e) => handleChange(e)} className="form-select" id="Select02" aria-label="Default select" style={{width:"347px", height: "50px"}}>
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
                                            <td className="col-6 text-center align-middle bg-light py-4">担当者別名</td>
                                            <td className="col-6 text-center align-middle py-4" style={{position: "relative"}}>
                                                {inputFields.map((input, index) => (
                                                    <div key={index}>
                                                        <input key={index} type="text" name={`input_${index}`} value={input} onChange={(e) => handleChangeReadName(index)(e)} className="custom-input mb-3 me-2" />
                                                        { inputFields.length > 1 && (
                                                            <i className="bi bi-dash-circle-fill btn-danger" onClick={() => handleRemoveField(index)} style={{fontSize: "2.6rem", position: "absolute", top: `${15 + index * 65}px`,  right: "45px", color: "#dc3545"}}></i>
                                                        )}
                                                    </div>
                                                ))}
                                                { inputFields.length < 5 && (
                                                    <i className="bi bi-plus-circle-fill" onClick={handleAddField} style={{fontSize: "2.6rem", position: "absolute", top: `${inputFields.length === 1 ? 80 : 15 + inputFields.length * 65}px`, right: "45px"}}></i>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">電話番号</td>
                                            <td className="col-6 text-center align-middle"><input type="tel" className="custom-input" name="phone" value={formData.phone} onChange={(e) => handleChange(e)}  /></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">備&nbsp;考</td>
                                            <td className="col-6 text-center align-middle"><input type="text" className="custom-input" name="remarks" value={formData.remarks} onChange={(e) => handleChange(e)}  /></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="my-5">
                                    <button className="btn btn-lg btn-primary" id="confirmBtn" type="submit"  data-bs-toggle={!haveError ? "modal" : ""} data-bs-target="#ConfirmModal" style={{padding :"10px 60px"}}>登&nbsp;録</button>&nbsp;&nbsp;
                                    <button className="btn btn-lg btn-secondary" type="reset"  style={{padding :"10px 32px"}} onClick={handleBack}>キャンセル</button>
                                </div>
                            </div>
                        </form>
                        {!haveError && (<ConfirmModal formData={formData} actionForm={registEmployee} confirm={confirm}/>)}
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}