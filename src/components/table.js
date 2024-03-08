
import React from "react";

import { useTable, useExpanded } from 'react-table'
import "../pages/styles/globals.css";


function Table({ columns: columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { expanded },
    } = useTable(
        {
            columns: columns,
            data,
            initialState: {
                expanded: {},
              },
        },
       
        useExpanded // Use the useExpanded plugin hook
    )

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
                                        {cell.column.id === 'operation' ? (
                                            cell.row.original.hasRecord ? (
                                            <div>
                                                <a href="#"><i className="bi bi-trash-fill fs-4"></i></a>&nbsp;&nbsp;&nbsp;
                                                <a href="#"><i className="bi bi-sticky-fill fs-4"></i></a>
                                            </div>
                                            ) : null // Render nothing if there's no record
                                        ) : (
                                            cell.render('Cell')
                                        )}
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