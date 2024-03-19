import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import { useRouter } from "next/router";
import { organization } from "../../api/organization";
import { event } from "jquery";

export default function UserRegister(){
    // router
    const router = useRouter();

    // error
    const [error, setErrors] = useState("");

    const [formData, setFormData] = useState({});
    //parent organization dropdwon
    const [options, setParentOrgOpt] = useState([]);
    //level dropdown
    const [selectedValue, setSelectedValueLevel] = useState('');
    //別名テキスト追加削除
    const [inputFields, setInputFields] = useState(['']);

    useEffect(() => {
        if (selectedValue !== '') {
            getParentOrgOpt(selectedValue);
        }
        setSelectedValueLevel("1");
    }, [selectedValue]);// This useEffect will run whenever level changes

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

        //level dropdown set
        setSelectedValueLevel(e.target.value);
    };

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
                aliasNames : newInputFields,
            }));
        }
    };

    const handleSubmit = async (e) => {
    
        e.preventDefault();
        // エラー出力箇所
        var errorMessage = document.getElementById("error-message");
    
        // const aliasNameArr = formData.aliasNames.split(',').map((item) => item.trim());
        // setFormData({
        //     ...formData,
        //     organizationAliasList : aliasNameArr
        // });
        // alert(JSON.stringify(formData));
        if (validateForm()) {
            console.debug("Form Data:", formData);
            errorMessage.innerHTML = "";
            
            registOrg(formData);
        } else {
          console.log("Error Data:", error)
        }
    };
    
    // validation
    const validateForm = () => {
        //部署名の検証
        const departmentIdIdRegex = /[^a-zA-Z0-9]/;
        if (!formData.departmentId || !formData.departmentId.trim()) {
            setErrors("部署IDを入力してください");
            return false;
        } else if (departmentIdIdRegex.test(formData.departmentId)) {
            setErrors("部署IDが正しくありません。使用できない文字が含まれています。");
            return false;
        } 
        // else if (formData.departmentId.length < depIdMin || depIdMax < formData.departmentId.length) {
        //     setErrors("部署IDは" + depIdMin + "文字以上、" + depIdMax + "以下で設定してください。");
        //     return false;
        // }

        // 部署名チャック
        if (!formData.name || !formData.name.trim()) {
            setErrors("部署名を入力してください");
            return false;
        }

        //上位組織チャック
        if(formData.level !== 1 && (formData.parentDepartmentName === null || !formData.parentDepartmentName)){
            setErrors("上位組織を選択してください。");
            return false;
        }

        //電話番号チャック
        const phoneNumberRegex = /^\d{3}-\d{4}-\d{4}$/;
        if (!phoneNumberRegex.test(formData.phone)) {
            setErrors("電話番号は000-0000-0000フォーマットで入力してください。");
            return false;
        }

        var confirmed = showConfirmation(formData);
        if (!confirmed) {
            return false;
        }

        return true;
    };

    const registOrg = async (formData) => {
        try {
          const response = await organization.organizationCreate(formData);
          console.debug(response);
  
          if (response.status == 409) {
            alert(response.body);
            alert("既に同じ部署コードが存在しています。");
          } 
          else if (response.status == 401) {
            router.push("/");
          } else if (response.status == 200) {
            alert("部署の登録は完了しました。");
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
      
    function showConfirmation(formData) {
        var confirmationMessage = `
          部署ID: ${formData.departmentId}
          部署名: ${formData.name}
          よみ:${formData.readName}
          階 層:${formData.level}
          上位組織:${formData.parentDepartmentName}
          電話番号:${formData.name}
          備 考:${formData.name}
          別名：${formData.aliasNames}
        `;

        return confirm("以下の情報で登録してよろしいですか。？\n" + confirmationMessage);
    }

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
    
    return(
        <RootLayout top={true} isSidebarInclude={true}>
            <div className="body-wrapper01">
                <div className="container-fluid">
                    <div>
                        <form method="post" onSubmit={handleSubmit}>
                            <i className="bi bi-diagram-3-fill" style={{fontSize: "4rem"}}></i>
                            <h1 className="h3 mb-3 fw-normal">部署追加</h1>
                            <div className="error-message" id="error-message">{error}</div>
                            <div className="form-floating mb-3">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">部署コード</td>
                                            <td className="col-6 text-center align-middle"><input type="text" className="custom-input" name="departmentId" value={formData.departmentId} onChange={(e) => handleChange(e)}  /></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">部署名</td>
                                            <td className="col-6 text-center align-middle"><input type="text" className="custom-input" name="name" value={formData.name} onChange={(e) => handleChange(e)}  /></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">よみ</td>
                                            <td className="col-6 text-center align-middle"><input type="text" className="custom-input" name="readName" value={formData.readName} onChange={(e) => handleChange(e)} /></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">階&nbsp;層</td>
                                            <td className="col-6 text-center align-middle py-4">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <select name="level" value={formData.level} onChange={(e) => handleChange(e)} className="form-select" id="Select01" aria-label="Default select" style={{width:"347px", height: "50px"}}>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">上位組織</td>
                                            <td className="col-6 text-center align-middle py-4">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <select name="parentDepartmentName" value={formData.parentDepartmentName} onChange={(e) => handleChange(e)} className="form-select" id="Select02" aria-label="Default select" style={{width:"347px", height: "50px"}}>
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
                                            <td className="col-6 text-center align-middle bg-light py-4">別&nbsp;名</td>
                                            <td className="col-6 text-center align-middle py-4" style={{position: "relative"}}>
                                                {inputFields.map((input, index) => (
                                                    <div key={index}>
                                                        <input key={index} type="text" name={`input_${index}`} value={formData.aliasName} onChange={(e) => handleChangeReadName(index)(e)} className="custom-input mb-3 me-2" />
                                                        { index !== 0 && (
                                                            <i className="bi bi-dash-circle-fill btn-danger" onClick={() => handleRemoveField(index)} style={{fontSize: "2.6rem", position: "absolute", top: "15px", color: "#dc3545"}}></i>
                                                        )}
                                                        {/* <input key={index} type="text" name="readName" value={formData.readName} onChange={(e) => handleChange(index)} /> */}
                                                        { index === inputFields.length - 1 && (
                                                            <i className="bi bi-plus-circle-fill" onClick={handleAddField} style={{fontSize: "2.6rem", position: "absolute", top: "80px"}}></i>
                                                        )} 
                                                    </div>
                                                ))}
                                            </td>
                                            {/* <td className="col-6 text-center align-middle py-4" style={{position: "relative"}}>
                                                <input type="text" className="custom-input mb-3 me-2" name="readName" value={formData.readName} onChange={ handleChange(index)} />
                                                <input type="text" className="custom-input me-2" onChange={ handleChange(index)} /> 
                                                { index === inputFields.length - 1 && (
                                                    <i className="bi bi-plus-circle-fill" onClick={handleAddField} style={{fontSize: "2.6rem", position: "absolute", top: "80px"}}></i>
                                                )} 
                                            </td> */}
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">電話番号</td>
                                            <td className="col-6 text-center align-middle"><input type="text" className="custom-input" name="phone" value={formData.phone} onChange={(e) => handleChange(e)}  /></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">備&nbsp;考</td>
                                            <td className="col-6 text-center align-middle"><input type="text" className="custom-input" name="remarks" value={formData.remarks} onChange={(e) => handleChange(e)}  /></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="my-5">
                                    <button className="btn btn-lg btn-primary" type="submit" style={{padding :"10px 60px"}}>登&nbsp;録</button>&nbsp;&nbsp;
                                    <button className="btn btn-lg btn-secondary" type="reset"  style={{padding :"10px 32px"}}>キャンセル</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}