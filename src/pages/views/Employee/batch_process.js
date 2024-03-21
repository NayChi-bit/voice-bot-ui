import React, { useState, useEffect } from "react";
import RootLayout from "../../../components/main";
import { useRouter } from "next/router";
import { employee } from "../../api/employee";
import { organization } from "@/pages/api/organization";

export default function EmployeeBatch(){
    // router
    const router = useRouter();

    // error
    const [error, setErrors] = useState("");

    const [formData, setFormData] = useState({});
    //parent organization dropdwon
    const [options, setOrganizationOpt] = useState([]);
    
    //別名テキスト追加削除
    const [inputFields, setInputFields] = useState(['']);

    useEffect(() => {
        getOrganizations();
    }, []);// This useEffect will run whenever level changes
      

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

    const divStyle = {
        
    };
    

    return(
        <RootLayout top={true} isSidebarInclude={true}>
            <div className="body-wrapper02">
                <div className="container-fluid">

                    <main className="form-signin">
                        <form>
                            <i className="bi bi-person-bounding-box" style={{fontSize: "4rem"}}></i>
                            <h1 className="h3 mb-3 fw-normal">担当者一括処理</h1>
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
                                    <button className="btn btn-lg btn-secondary" type="button" style={{padding :"10px 60px"}}>戻&nbsp;る</button>
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </RootLayout>
    );
}