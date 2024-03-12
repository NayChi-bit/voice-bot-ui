
import React from "react";

import { useTable, useExpanded, usePagination } from 'react-table'
import "../pages/styles/globals.css";
import { organizationDelete } from '../pages/views/Menu/organizationList'

function Table({ columns: columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: {  },
    } = useTable(
        {
            columns: columns,
            data,
            initialState: {
                expanded: {},
            },
        },
       
        useExpanded
    )

    // 部署削除
    const orgDelete = (id, event) => {
        event.stopPropagation();
        organizationDelete(id);
    };

    // Render the UI for table
    return (
        <div>
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
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()} key={i}>
                                {row.cells.map((cell, i) => {
                                    return <td {...cell.getCellProps()} key={i} className="text-center align-middle py-3">
                                        {/* 部署一覧、担当者一覧 */}
                                        {cell.column.id === 'operation' ?  (cell.row.original.hasRecord ? (
                                            cell.row.original.hasSubOrganization ? (
                                                <div>
                                                    <a href="#"><i className="bi bi-sticky-fill fs-4"></i></a>
                                                </div>
                                            ) : (
                                                <div>
                                                    <a href="#" onClick={(event) => orgDelete(cell.row.original.id, event)}><i className="bi bi-trash-fill fs-4"></i></a>&nbsp;&nbsp;&nbsp;
                                                    <a href="#"><i className="bi bi-sticky-fill fs-4"></i></a>
                                                </div>
                                            )) : null) : (cell.column.id === 'userDelete' ? (
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
        </div >
    )
}

function ExpandableTableComponent({columns: columns, data}) {

    return (
        <Table columns={columns} data={data} />
    )
}

export default ExpandableTableComponent;