

const Modal = ({ show, onClose }) => {

    const handleCloseClick = (e) => {
      e.preventDefault();
      onClose();
    };
  
    return ( show ? (
        <div className="modal fade" id="Modal01" tabIndex="-1" aria-labelledby="ModalLabel01">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="ModalLabel01">ユーザ編集</h1>
                        <button type="button" onClick={handleCloseClick} className="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
                        
                        {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#Modal01" style="--bs-btn-padding-y: 10px; --bs-btn-padding-x: 40px;">絞り込み表示</button>&nbsp; */}
                    </div>
                    <div className="modal-body">
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <td className="col-6 text-center align-middle bg-light py-3">部署名</td>
                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" /></td>
                            </tr>
                            <tr>
                                <td className="col-6 text-center align-middle bg-light py-3">よみ</td>
                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" /></td>
                            </tr>
                            <tr>
                                <td className="col-6 text-center align-middle bg-light py-3">コード</td>
                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" /></td>
                            </tr>
                            <tr>
                                <td className="col-6 text-center align-middle bg-light py-3">階&nbsp;層</td>
                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" /></td>
                            </tr>
                            <tr>
                                <td className="col-6 text-center align-middle bg-light py-3">上位組織</td>
                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" /></td>
                            </tr>
                            <tr>
                                <td className="col-6 text-center align-middle bg-light py-3">別&nbsp;名</td>
                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" /></td>
                            </tr>
                            <tr>
                                <td className="col-6 text-center align-middle bg-light py-3">電話番号</td>
                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" /></td>
                            </tr>
                            <tr>
                                <td className="col-6 text-center align-middle bg-light py-3">備&nbsp;考</td>
                                <td className="col-6 text-center align-middle py-3"><input type="text" className="custom-input" /></td>
                            </tr>
                        </tbody>
                    </table>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" style={{padding : "10px 45px"}}>絞り込み</button>
                            <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal" style={{padding : "10px 37px"}}>キャンセル</button>
                        </div>{/* /.modal-footer  */}
                    </div>
                </div>{/* /.modal-content  */}
            </div>{/* /.modal-dialog  */}
        </div>
    ) : null
    );
  };
  
  export default Modal;