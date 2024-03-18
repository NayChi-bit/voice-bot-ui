import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import { useRouter } from "next/router";
import { organization } from "../../api/organization";
import { event } from "jquery";
import LoginPolicy from "../../../environments/config.json";

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
    
    const depIdMin = LoginPolicy.system.policy.userIdMin;
    const depIdMax = LoginPolicy.system.policy.userIdMax;

    useEffect(() => {
        if (selectedValue !== '') {
            getParentOrgOpt(selectedValue);
          }
        
    }, [selectedValue]);// This useEffect will run whenever selectedValue changes

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

    const handleChange = (index) => (e) => {
        // 値変更時のformData設定
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));

        //level dropdown set
        setSelectedValueLevel(e.target.value);

        if (index !== null) {
            //別名fields set
            const newInputFields = [...inputFields];
            newInputFields[index] = e.target.value; // Update the value of the input field at the specified index
            setInputFields(newInputFields);
        }
    };

    const handleSubmit = async (e) => {
    
        e.preventDefault();
        // エラー出力箇所
        var errorMessage = document.getElementById("error-message");
    
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
            setErrors(
                "部署IDが正しくありません。使用できない文字が含まれています。"
            );
            return false;
        } else if (formData.departmentId.length < depIdMin || depIdMax < formData.departmentId.length) {
            setErrors("部署IDは" + depIdMin + "文字以上、" + depIdMax + "以下で設定してください。");
            return false;
        }

        // 部署名チャック
        if (!formData.name || !formData.name.trim()) {
            setErrors("部署名を入力してください");
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
            alert("既に同じログインIDが存在していま");
          } 
          else if (response.status == 401) {
            router.push("/");
          } else if (response.status == 200) {
            alert("ユーザの登録は完了しました。");
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
          ユーザID: ${formData.userId}
          パスワード: ${formData.password}
          表示名: ${formData.name}
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
                            <div className="form-floating mb-3">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">部署コード</td>
                                            <td className="col-6 text-center align-middle"><input type="text" class="custom-input" name="departmentId" value={formData.departmentId} /></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">部署名</td>
                                            <td className="col-6 text-center align-middle"><input type="text" class="custom-input" name="name" value={formData.name} /></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">よみ</td>
                                            <td className="col-6 text-center align-middle"><input type="text" class="custom-input" name="readName" value={formData.readName}/></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">階&nbsp;層</td>
                                            <td className="col-6 text-center align-middle py-4">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <select name="selectedValueLevel" value={formData.selectedValueLevel} onChange={handleChange} className="form-select" id="Select01" aria-label="Default select" style={{width:"347px", height: "50px"}}>
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
                                                    <select name="selectedValueParent" value={formData.selectedValueParent} onChange={handleChange} className="form-select" id="Select02" aria-label="Default select" style={{width:"347px", height: "50px"}}>
                                                        {options.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                            {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        {inputFields.map((input, index) => (
                                        <tr key={index}>
                                            <td className="col-6 text-center align-middle bg-light py-4">別&nbsp;名</td>
                                            <td className="col-6 text-center align-middle py-4" style={{position: "relative"}}>
                                                <input type="text" className="custom-input mb-3 me-2" onChange={ handleChange(index)} />
                                                { index !== 0 && (
                                                    <i className="bi bi-dash-circle-fill btn-danger" onClick={() => handleRemoveField(index)} style={{fontSize: "2.6rem", position: "absolute", top: "15px", color: "#dc3545"}}></i>
                                                )}
                                                
                                                {/* <input type="text" className="custom-input me-2" onChange={ handleChange(index)} /> */}
                                                { index === inputFields.length - 1 && (
                                                    <i className="bi bi-plus-circle-fill" onClick={handleAddField} style={{fontSize: "2.6rem", position: "absolute", top: "80px"}}></i>
                                                )}
                                            </td>
                                        </tr>
                                        ))}
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">電話番号</td>
                                            <td className="col-6 text-center align-middle"><input type="text" className="custom-input" name="phone" value={formData.phone} /></td>
                                        </tr>
                                        <tr>
                                            <td className="col-6 text-center align-middle bg-light py-4">備&nbsp;考</td>
                                            <td className="col-6 text-center align-middle"><input type="text" className="custom-input" name="remarks" value={formData.remarks} /></td>
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