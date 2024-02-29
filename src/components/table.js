
import React from "react";

import { useTable, useExpanded } from 'react-table'
import "../pages/styles/globals.css";


function Table({ columns: userColumns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { expanded },
    } = useTable(
        {
            columns: userColumns,
            data,
        },
       
        useExpanded // Use the useExpanded plugin hook
    )

    // Render the UI for table
    return (
        <div>
            <table className="table" {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup, i) => (
                        <tr key={i}>
                            {headerGroup.headers.map((column, i) => (
                                <th {...column.getHeaderProps()} key={i}>{column.render('Header')}</th>
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
                                    return <td {...cell.getCellProps()} key={i}>{cell.render('Cell')}</td>
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