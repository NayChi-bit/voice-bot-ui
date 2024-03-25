import RootLayout from "../../../components/main";
import Table from "../../../components/table";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import callLogList from "../../api/callLog";

export default function Home() {
    // router
    const router = useRouter();
    const [error, setErrors] = useState("");
    // テーブルデータ
    const [data, setData] = useState([{"callTime" : null, "deptName" : null, "userName" : null, "download" : null, hasRecord : false }]);
    
    //Search data
    // const [formData, setformData] = useState([{"startDate" : null, "endDate" : null, "userName" : null, "deptName" : null, hasRecord : false }]);
    const [formData, setformData] = useState({});

    // 初期表示時
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await showList();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            };

            fetchData();
        }, []);   
    
    const showList = async () => {
        try {            
            const response = await callLogList(formData);
            console.log(formData);
            // alert(JSON.stringify(formData));
            // APIの結果が正常だった場合
            // 部署なし or その他エラー
            if (response.status == 200 && response !== null) {
                const res = await response.json();

                const result = processData(res);
                return result;

            } else if (response.status == 401) {
                setErrors("認証の有効期限が切れました");
                return false;
            }
        } catch (errors) {
            // APIの結果が異常
            console.debug(errors.status);
            console.error("エラーerror:", errors);
            setErrors("エラーが発生しました");
            return false;
        }  
    }

    const processData = (data) => {
    const resultData = [];
        data.map(row => {
            
            // レコードあるチャック
            const hasRecord = row.hasOwnProperty('id') && row.id !== null; 

            resultData.push({ ...row, hasRecord });
        });

        return resultData;
    }

    const columns =  [
        {
            Header: '通話時刻',
            accessor: 'callTime',
        },
        {
            Header: '部 署',
            accessor: 'deptName',
        },
        {
            Header: '担当者',
            accessor: 'userName',
        },
        {
            Header: '',
            accessor: 'download',
        },
    ];

    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null); 
    
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const handleStartDateChange = (date) => {
        console.log(date);
        if (date != null) {
            const stDate = formatDate(new Date(date));
            console.log(stDate);
            setSelectedStartDate(stDate);
        }
        
        if(startTime != null){
            const dateTime = stDate + " " + startTime;
            console.log("notime" + dateTime);
            setformData((prevData) => ({
                ...prevData,
                startDate: dateTime,
            }));
        } else {
            const dateTime = stDate + " 00:00:00";
            console.log("time" + dateTime);
            setformData((prevData) => ({
                ...prevData,
                startDate: dateTime,
            }));
        }        
     };

     const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0, so add 1 and pad with zero if needed
        const day = String(date.getDate()).padStart(2, '0'); // Pad day with zero if needed
       
        return `${year}/${month}/${day}`;
    };       

    const handleEndDateChange = (date) => {
        const enDate = formatDate(new Date(date));
        console.log(enDate);
        setSelectedEndDate(enDate);
        if(endTime != null){
            const dateTime = enDate + " " + endTime;
            console.log("notime" + dateTime);
            setformData((prevData) => ({
                ...prevData,
                endDate: dateTime,
            }));
        } else {
            const dateTime = enDate + " 00:00:00";
            console.log("time" + dateTime);
            setformData((prevData) => ({
                ...prevData,
                endDate: dateTime,
            }));
        } 
    };

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
        console.log(startTime);
        if(selectedStartDate != null){
            const dateTime = selectedStartDate + " " + e.target.value;
            console.log("time" + dateTime);
            setformData((prevData) => ({
                ...prevData,
                startDate: dateTime,
            }));
        }
     };

     const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
        console.log(endTime);
        if(selectedEndDate != null){
            const dateTime = selectedEndDate + " "+ e.target.value;
            console.log("time" + dateTime);
            setformData((prevData) => ({
                ...prevData,
                endDate: dateTime,
            }));
        }
     };

    const handleChange = (e) => {
        // 値変更時のformData設定
        const { name, value } = e.target;
        setformData((prevData) => ({
        ...prevData,
        [name]: value === '' ? null : value,
        }));
    };

    const searchBtn = async (e) => { 
        try {
            const result = await showList(formData);
            alert(JSON.stringify(result));
            setData(result);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
      
    return (
        <RootLayout top={true} isSidebarInclude={true}>
            <div className="body-wrapper02">
                <div className="container-fluid">
                    <main>
                        <div className="row mb-4">
                            <div className="col text-start">
                                <h1 className="h3 mb-3 fw-normal"><i className="bi bi-clipboard-check-fill"></i>&nbsp;ログ管理</h1>
                            </div>
                            <div className="col text-end">
                                <button type="button" className="btn btn-primary" style={{padding: "10px 40px"}}>一括ダウンロード</button>
                            </div>
                        </div>
                        <form>
                            <div className="row mb-3">
                                <div className="col text-start">
                                    <label htmlFor="start-date">開始日</label>
                                    <DatePicker className="form-control" id="startDate" dateFormat="yyyy/MM/dd" selected={selectedStartDate} onChange={handleStartDateChange} input = {true}/>
                                </div>
                                <div className="col">
                                    <label></label>
                                    <select name="startTime" onChange={(e) => handleStartTimeChange(e)} className="form-select" id="Select01" style={{width: "100px", height: "46px"}}>
                                        <option value="00:00:00">00:00</option>
                                        <option value="01:00:00">01:00</option>
                                        <option value="02:00:00">02:00</option>
                                        <option value="03:00:00">03:00</option>
                                        <option value="04:00:00">04:00</option>
                                        <option value="05:00:00">05:00</option>
                                        <option value="06:00:00">06:00</option>
                                        <option value="07:00:00">07:00</option>
                                        <option value="08:00:00">08:00</option>
                                        <option value="09:00:00">09:00</option>
                                        <option value="10:00:00">10:00</option>
                                        <option value="11:00:00">11:00</option>
                                        <option value="12:00:00">12:00</option>
                                        <option value="13:00:00">13:00</option>
                                        <option value="14:00:00">14:00</option>
                                        <option value="15:00:00">15:00</option>
                                        <option value="16:00:00">16:00</option>
                                        <option value="17:00:00">17:00</option>
                                        <option value="18:00:00">18:00</option>
                                        <option value="19:00:00">19:00</option>
                                        <option value="20:00:00">20:00</option>
                                        <option value="21:00:00">21:00</option>
                                        <option value="22:00:00">22:00</option>
                                        <option value="23:00:00">23:00</option>
                                        <option value="24:00:00">24:00</option>
                                    </select>
                                </div>
                                <div className="col text-start">
                                    <label htmlFor="end-date">終了日</label>
                                    <DatePicker className="form-control" id="endDate" dateFormat="yyyy/MM/dd" selected={selectedEndDate} onChange={handleEndDateChange}/>
                                </div>
                                <div className="col">
                                    <label></label>
                                    <select name="endTime" onChange={(e) => handleEndTimeChange(e)} className="form-select" id="Select02" style={{width: "100px", height: "46px"}}>
                                        <option value="00:00:00">00:00</option>
                                        <option value="01:00:00">01:00</option>
                                        <option value="02:00:00">02:00</option>
                                        <option value="03:00:00">03:00</option>
                                        <option value="04:00:00">04:00</option>
                                        <option value="05:00:00">05:00</option>
                                        <option value="06:00:00">06:00</option>
                                        <option value="07:00:00">07:00</option>
                                        <option value="08:00:00">08:00</option>
                                        <option value="09:00:00">09:00</option>
                                        <option value="10:00:00">10:00</option>
                                        <option value="11:00:00">11:00</option>
                                        <option value="12:00:00">12:00</option>
                                        <option value="13:00:00">13:00</option>
                                        <option value="14:00:00">14:00</option>
                                        <option value="15:00:00">15:00</option>
                                        <option value="16:00:00">16:00</option>
                                        <option value="17:00:00">17:00</option>
                                        <option value="18:00:00">18:00</option>
                                        <option value="19:00:00">19:00</option>
                                        <option value="20:00:00">20:00</option>
                                        <option value="21:00:00">21:00</option>
                                        <option value="22:00:00">22:00</option>
                                        <option value="23:00:00">23:00</option>
                                        <option value="24:00:00">24:00</option>
                                    </select>
                                </div>
                                <div className="col text-start">
                                    <label htmlFor="department">部署名</label>
                                    <input type="text" className="form-control" name="deptName" value={formData.deptName} onChange={(e) => handleChange(e)} id="department" style={{height: "46px"}} />
                                </div>
                                <div className="col text-start">
                                    <label htmlFor="contactPerson">担当者名</label>
                                    <input type="text" className="form-control" name="userName" value={formData.userName} onChange={(e) => handleChange(e)} id="contactPerson" style={{height: "46px"}} />
                                </div>
                                <div className="col d-flex align-items-end">
                                    <button type="button" className="btn btn-dark" style={{padding: "10px 40px"}} onClick={searchBtn}>検&nbsp;索</button>
                                </div>
                            </div>
                        </form>
                        <Table columns={columns} data={data} paginationEnabled={true} />
                    </main>
                </div>
            </div>
        </RootLayout>
    );
}
