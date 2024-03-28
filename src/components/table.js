
import React from "react";

import { useTable, useExpanded, usePagination } from 'react-table'
import { useRouter } from "next/router";
import { organizationDelete } from "@/pages/views/Organization/list";
import { employeeDelete  } from "@/pages/views/Employee/list";
import { userDelete  } from "@/pages/views/User/list";
import { useMemo } from 'react';
import { useEffect, useState } from "react";
import "../pages/styles/globals.css";
import { employee } from "@/pages/api/employee";

const Table = ({ columns, data, paginationEnabled = false, isVarticleTable = false}) => {
    const router = useRouter();
    const maxPagesToShow = 5;
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: {  },
        page,
        canPreviousPage: internalCanPreviousPage,
        canNextPage: internalCanNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns, 
            data,
            initialState: {
                expanded: {}, pageIndex: 1, pageSize: 2
            },
        },
       
        useExpanded,
        paginationEnabled ? usePagination : (hooks) => { hooks.skipPageReset = true; }
    )

    // 部署||担当者削除
    const deleteOpr = (id, event, isOrg) => {
        event.stopPropagation();
        isOrg ? organizationDelete(id, router) : employeeDelete(id, router);
    };  

    //ユーザー削除
    const systemUserDelete = (id, event) => {
        event.stopPropagation();
        userDelete(id, router);
    };

    // 部署||担当者詳細
    const  detailOpr = async (id, event, isOrg) => {
        event.stopPropagation();
        if(isOrg){
            sessionStorage.setItem("organizationId", id);
            router.push('../Organization/detail');
        } else {
            sessionStorage.setItem("employeeId", id);
            router.push('../Employee/detail');
        }
    }
    
    // ユーザー詳細
    const  userDetail = async (id, event) => {
        event.stopPropagation();
        sessionStorage.setItem("userId", id);
        router.push('../User/detail');
    }

    // Calculate canPreviousPage manually
    const canPreviousPage = useMemo(() => {
        if (pageIndex <= 3) {
            return false;
            } else {
            return true;
        }
    }, [pageIndex]);

    // Calculate canNextPage manually
    const canNextPage = useMemo(() => {
        if (pageIndex <= pageCount - 2) {
            return false;
            } else {
            return true;
        }
    }, [pageIndex]);

    const getPageIndexes = () => {
        
        let pages = [];
        
        if (pageCount <= maxPagesToShow) {
          pages = [...Array(pageCount).keys()];
        } else {
          const startPages = [...Array.from({ length: Math.min(pageIndex, 3) }, (_, i) => i)];
          const middlePages = ['・・・'];
          const endPages = [...Array.from({ length: Math.min(pageCount - pageIndex - 1, 2) }, (_, i) => pageIndex + i + 1)];
          pages = [...startPages, pageIndex, ...middlePages, ...endPages];
        }
    
        return pages;
    };
    const pageIndexes = useMemo(getPageIndexes, [pageIndex, pageOptions]);

    const [id, setUserId] = useState('');

    useEffect(() => {
        const storedId = sessionStorage.getItem('id');
        setUserId(storedId);
    })

    // Render the UI for table
    return (
        <div>
            <table className="table table-bordered"  {...getTableProps()}>
                {!isVarticleTable ? (
                    <thead>
                        {headerGroups.map((headerGroup, i) => (
                            <tr key={i}>
                                {headerGroup.headers.map((column, i) => (
                                    <th {...column.getHeaderProps()} key={i} scope="col" className="py-3">{column.render('Header')} </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                ) : null}
                
                <tbody {...getTableBodyProps()}>
                    {(paginationEnabled ? page : rows).map((row, i) => {
                        prepareRow(row)
                        return ( 
                            <React.Fragment key={row.id}>
                                {
                                    isVarticleTable ? (
                                        <React.Fragment key={row.id}>
                                            {row.cells.map((cell, index) => (
                                            <tr key={index}>
                                                <React.Fragment key={index}>
                                                <td className="col-6 text-center align-middle bg-light py-4">
                                                    {columns[index].Header}
                                                </td>
                                                <td className="col-6 text-center align-middle py-4">
                                                    {cell.render('Cell')}
                                                </td>
                                                </React.Fragment>
                                            </tr>
                                        ))}
                                        </React.Fragment>                                       
                                    ) : (
                                        <tr {...row.getRowProps()} key={i}>
                                            {row.cells.map((cell, i) => {
                                                return (
                                                    <td {...cell.getCellProps()} key={i} className="text-center align-middle py-3">
                                                        {/* 部署一覧、担当者一覧 */}
                                                        {
                                                            cell.column.id === 'operation' ? 
                                                            (
                                                                cell.row.original.hasRecord ? 
                                                                (
                                                                    cell.row.original.hasSubOrganization ? 
                                                                        (
                                                                            <div>
                                                                                <a href="#" onClick={(event) => detailOpr(cell.row.original.id, event, cell.row.original.isOrg)}>
                                                                                    {cell.row.original.isOrg}<i className="bi bi-sticky-fill fs-4"></i>
                                                                                </a>
                                                                            </div>
                                                                        ) : 
                                                                        (
                                                                            <div>
                                                                                <a href="#" data-bs-toggle="modal" data-bs-target={`#deleteModal${cell.row.id}`}>
                                                                                    <i className="bi bi-trash-fill fs-4"></i>{cell.row.original.isOrg}
                                                                                </a>&nbsp;&nbsp;&nbsp;
                                                                                <a href="#" onClick={(event) => detailOpr(cell.row.original.id, event, cell.row.original.isOrg)}>
                                                                                    <i className="bi bi-sticky-fill fs-4">{cell.row.original.isOrg}</i>
                                                                                </a>
                                                                                {deleteModal(`deleteModal${cell.row.id}`, 'deleteModalLabel', (event) => deleteOpr(cell.row.original.id, event, cell.row.original.isOrg))}
                                                                            </div>
                                                                        )
                                                                ) : null
                                                            ) : 
                                                            (cell.column.id === 'userDelete' ? 
                                                                (
                                                                    cell.row.original.hasRecord ? 
                                                                    (
                                                                            <div>
                                                                                {                            
                                                                                    id == cell.row.original.id ? null : 
                                                                                    <a href="#" data-bs-toggle="modal" data-bs-target={`#userDeleteModal${cell.row.id}`}><i className="bi bi-trash-fill fs-4" ></i></a>
                                                                                }
                                                                                {deleteModal(`userDeleteModal${cell.row.id}`, 'userDeleteModalLabel', (event) => systemUserDelete(cell.row.original.id, event))}
                                                                            </div>
                                                                    ) : null
                                                                ) : 
                                                                (cell.column.id === 'userDetail' ? 
                                                                    (
                                                                        cell.row.original.hasRecord ? 
                                                                        (
                                                                            <div>
                                                                                <a href="#" onClick={(event) => userDetail(cell.row.original.id, event)}><i className="bi bi-sticky-fill fs-4"></i></a>
                                                                            </div>
                                                                        ) : null
                                                                    ) : 
                                                                    (
                                                                        cell.column.id === 'download' ? 
                                                                        (
                                                                            cell.row.original.hasRecord ? 
                                                                                (
                                                                                    <div>
                                                                                        <a href="#"><i className="bi bi-file-earmark-arrow-down-fill fs-3"></i></a>
                                                                                    </div>
                                                                                ) : null
                                                                        ) : cell.render('Cell')
                                                                    )
                                                                )
                                                            )
                                                        }
                                                    </td>
                                                );
                                            })
                                            }
                                        </tr>
                                    )
                                }
                               
                            </React.Fragment>
                        )
                    })}
                </tbody>
            </table>
            {paginationEnabled && (
                <div className="container mt-5">
                    <div className="pagination">
                        <a onClick={() => previousPage()} disabled={!canPreviousPage}>
                            <i className="bi bi-caret-left-fill"></i>
                        </a>
                        {pageIndexes.map((page, index) => (
                        <a className={pageIndex === page ? 'active' : ''} key={index} onClick={() => gotoPage(page)}>
                            {page === '・・・' ? '・・・' : page + 1}
                        </a>
                        ))}
        
                        <a onClick={() => nextPage()} disabled={!canNextPage}>
                            <i className="bi bi-caret-right-fill"></i>
                        </a>
                    </div>
                    <p className="mt-3">件数：{rows.length}件</p>
                </div>
            )}
        </div >
    )
}

function ExpandableTableComponent({columns, data, paginationEnabled, isVarticleTable}) {

    return (
        <Table columns={columns} data={data} paginationEnabled={paginationEnabled} isVarticleTable={isVarticleTable} />
    )
}

function deleteModal(id, label, onConfirm) {
    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-labelledby={`${label}${id}`}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-danger text-white">
                        <h5 className="modal-title" id={`${label}${id}`}>Delete Confirmation</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <i className="bi bi-x-circle fs-1 text-danger"></i> 
                        <p>削除しますか？</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={(event) => onConfirm(event)}>削除</button>
                        <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpandableTableComponent;