import { useState, useEffect } from "react";

export default function EntityUpdate() {

  //ファイル設定
  const [file, setFile] = useState();

  //Uploadボタン処理
  const onSubmit = async (event) => {
    //event.preventDefault();
    // エラー出力箇所
    var errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = "";


    if (!file){
      //ファイルがない場合
      errorMessage.innerHTML = "ファイルを選択してください。";
    } else if(!file.name.endsWith('.csv')){
      //CSV形式がない場合
      errorMessage.innerHTML =  'CSVファイルを選択してください。' ;
    }

    try {
      const data = new FormData();
      data.set('file', file);

      //エンティティ更新API呼び出し
      const res = await fetch('http://localhost:8080/api/dialogFlow/updateEntities', {
        method: 'POST',
        body: data
      })

      // APIの結果が正常だった場合
      if (res.status == 200) {
        alert("変更しました。");
        return false;
      } else {
        alert("変更に失敗しました。");
        return false;
      } 
    } catch (error) {
        // APIの結果が異常
        console.error("エラーerror:", error);
        alert("変更に失敗しました。");
        return false;
    }
  }
  
  return (
    <main>
      <div>
      <h2>エンティティ更新</h2>
      <div className="mt-5">
        <form onSubmit={onSubmit}> 
          <input type="file" name="file" onChange={(e) => setFile(e.target.files?.[0])} />
          <button className="btn btn-lg btn-primary" type="submit" value="Upload" >Upload</button>
          <div className="error-message" id="error-message"></div>
        </form>
      </div>
      </div>
    </main>
  );
}