
import React from "react";

import { useTable, useExpanded, usePagination } from 'react-table'
import "../pages/styles/globals.css";
import { useMemo } from 'react';

function Table({ columns: columns, data }) {
    const maxPagesToShow = 5;
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
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
            columns: columns,
            data,
            initialState: {
                pageIndex: 1, pageSize: 2
            },
        },
       
        usePagination
    )

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

    // Render the UI for table
    return (
        <div>
            <pre>
                <code>
                    {JSON.stringify(
                        {
                            pageIndex,
                            pageSize,
                            pageCount,
                            canNextPage,
                            canPreviousPage,
                        },
                        null,
                        2
                    )}
                </code>
            </pre>
            <table className="table table-bordered"  {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup, i) => (
                        <tr key={i}>
                            {headerGroup.headers.map((column, i) => (
                                <th {...column.getHeaderProps()} key={i} scope="col" className="py-3">{column.render('Header')} </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()} key={i}>
                                {row.cells.map((cell, i) => {
                                    return <td {...cell.getCellProps()} key={i} className="text-center align-middle py-3">
                                        {/* 部署一覧、担当者一覧 */}
                                        {cell.column.id === 'operation' ?  (cell.row.original.hasRecord ? (
                                            <div>
                                                <a href="#"><i className="bi bi-trash-fill fs-4"></i></a>&nbsp;&nbsp;&nbsp;
                                                <a href="#"><i className="bi bi-sticky-fill fs-4"></i></a>
                                            </div>
                                            ) : null) : (cell.column.id === 'userDelete' ? (
                                            cell.row.original.hasRecord ? (
                                                    <div>
                                                        <a href="#"><i className="bi bi-trash-fill fs-4"></i></a>
                                                    </div>
                                                ) : null) : (cell.column.id === 'userDetail' ? (
                                                    cell.row.original.hasRecord ? (
                                                    <div>
                                                        <a href="#"><i className="bi bi-sticky-fill fs-4"></i></a>
                                                    </div>
                                                    ) : null)  : (cell.column.id === 'download' ? (
                                                        cell.row.original.hasRecord ? (
                                                        <div>
                                                            <a href="#"><i className="bi bi-file-earmark-arrow-down-fill fs-3"></i></a>
                                                        </div>
                                                        ) : null) : cell.render('Cell'))))}
                                    </td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
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
                <p class="mt-3">件数：{rows.length}件</p>
            </div>
        </div >
    )
}

function paginationTableComponent({columns: columns, data}) {

    return (
        <Table columns={columns} data={data} />
    )
}

export default paginationTableComponent;