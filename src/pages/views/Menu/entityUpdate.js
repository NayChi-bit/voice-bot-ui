import { useState } from "react";
import RootLayout from "../../../components/main";

export default function EntityUpdate() {

  //ファイル設定
  const [file, setFile] = useState();

  //Uploadボタン処理
  const onSubmit = async (event) => {
    event.preventDefault();
    // エラー出力箇所
    var errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = "";

    if (!file){
      //ファイルがない場合
      errorMessage.innerHTML = "ファイルを選択してください。";
      return false;
    } else if(!file.name.endsWith('.csv')){
      //CSV形式がない場合
      errorMessage.innerHTML =  'CSVファイルを選択してください。' ;
      return false;
    }

    try {
      const data = new FormData();
      data.set('file', file);

      //エンティティ更新API呼び出し
      const res = await fetch('http://localhost:8080/api/dialogFlow/updateEntities', {
        method: 'POST',
        body: data
      })

      //データクリア
      setFile(null);
      document.getElementById('fileInput').value = '';

      // APIの結果が正常だった場合
      if (res.status == 200) {
        alert("エンティティ更新しました。");
        return false;
      } else {
        // APIの結果が異常だった場合
        alert("エンティティ更新に失敗しました。");
        return false;
      } 
    } catch (error) {
        // APIの結果が異常
        console.error("エラーerror:", error);
        alert("エンティティ更新に失敗しました。");
        return false;
    }
  }
  
  return (
    <RootLayout top={true} isSidebarInclude={true}>
      <div className="body-wrapper02">
        <div className="container-fluid">
          <main>
            <div>
              <h2>エンティティ更新</h2>
              <div className="mt-5">
                <form onSubmit={onSubmit}> 
                  <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                    <input className="form-control form-control-lg" id="fileInput" type="file" name="file" onChange={(e) => setFile(e.target.files?.[0])} />
                    </div>
                    <div className="col-lg-2 col-md-2">
                    <button className="btn btn-lg btn-primary" type="submit" value="Upload" >Upload</button>
                    </div>
                  </div>
                  <div className="error-message" id="error-message"></div>
                </form>
              </div>
            </div>          
          </main>
        </div>
      </div>
     
    </RootLayout>
  );
}