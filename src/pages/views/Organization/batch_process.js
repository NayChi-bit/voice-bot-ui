import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import { useRouter } from "next/router";
import { organization } from "../../api/organization";

export default function OrganizationCSVDownload(){
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
        setSelectedValueLevel(selectedValue);
    }, [selectedValue]);// This useEffect will run whenever level changes

    useEffect(() => {
        if (selectedValue !== '') {
            getParentOrgOpt(selectedValue);
        }
        setSelectedValueLevel(selectedValue);
    }, [selectedValue]);// This useEffect will run whenever level changes

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

    return(
        <RootLayout top={true} isSidebarInclude={true}>
            <div className="body-wrapper02">
                <div className="container-fluid">

                    <main className="form-signin">
                        <form>
                            <i className="bi bi-diagram-3-fill" style={{fontSize: "4rem"}}></i>
                            <h1 className="h3 mb-3 fw-normal">部署一括処理</h1>
                            <div className="form-floating mb-3">

                                <table className="table table-bordered">
                                <tbody>
                                <tr>
                                    <td className="col-6 text-center align-middle bg-light py-4">登録一括処理</td>
                                    <td className="col-6 text-center align-middle py-4">
                                        <div className="d-flex align-items-center">
                                            <input type="file" className="form-control" id="fileInput" name="fileInput" />
                                            <button className="btn btn-lg btn-primary ms-4" type="button" style={{padding :"10px 60px"}}>実&nbsp;行</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-6 text-center align-middle bg-light py-4">ダウンロード一括処理</td>
                                    <td className="col-6 text-center align-middle py-4">
                                        <div className="d-flex justify-content-end align-items-center">
                                            <button className="btn btn-lg btn-primary" type="button" style={{padding :"10px 60px"}}>実&nbsp;行</button>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                                </table>
                                <div className="my-5">
                                    <button className="btn btn-lg btn-secondary" type="button" style={{padding :"10px 60px"}} onClick={handleBack}>戻&nbsp;る</button>
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </RootLayout>
    );
}