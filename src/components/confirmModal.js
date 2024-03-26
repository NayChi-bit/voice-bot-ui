const ConfirmModal = ({ formData, editForm, confirm }) => {
    const handleConfirm = () => {
        editForm(formData);
    };

    return ( 
        <div className="modal fade" id="ConfirmModal" tabIndex="-1" aria-labelledby="ConfirmModalLabel01">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title fs-5" id="ConfirmModalLabel01">Confirmation</h2>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
                    </div>
                    <div className="modal-body">
                        <p>以下の情報で登録してよろしいですか？</p>
                        {  confirm === "user" && (
                            <div style={{marginLeft: "88px", textAlign : "left"}}>
                                <p>ユーザID: {formData.userId}</p>
                                <p>表示名: {formData.name}</p>
                            </div>
                        )}
                        {  confirm === "org" && (
                            <div style={{marginLeft: "88px", textAlign : "left"}}>
                                <p>部署ID: {formData.departmentId}</p>
                                <p>部署名: {formData.name}</p>
                                <p>よみ:{formData.readName}</p>
                                <p>階 層:{formData.level}</p>
                                <p>上位組織:{formData.parentDepartmentName}</p>
                                <p>電話番号:{formData.phone}</p>
                                <p>備 考:{formData.remarks}</p>
                                <p>別名：{formData.organizationAliasNames}</p>
                            </div>
                        )}
                        {  confirm === "employee" && (
                            <div style={{marginLeft: "88px", textAlign : "left"}}>
                                <p>担当者名: {formData.name}</p>
                                <p>よみ: {formData.readName}</p>
                                <p>所属部署 : {formData.departmentName}</p>
                                <p>電話番号: {formData.phone}</p>
                                <p>備 考: {formData.remarks}</p>
                                <p>担当者別名： {formData.employeeAliasNames}</p>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleConfirm} data-bs-dismiss="modal">Confirm</button>
                        <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                    </div>
                </div> 
            </div>
        </div>
    );
};
  
export default ConfirmModal;