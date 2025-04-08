import "../css/Table.css"
import React, { useState } from 'react';

const Table = ({ head, data, columns, defaultSort=0 }) => {
    // Initialize with name column (index 0) in descending order
    const [sortConfig, setSortConfig] = useState({ key: defaultSort, direction: 'asc' });

    const handleSort = (columnIndex) => {
        // Only sort if the column is sortable
        if (!columns[columnIndex].sortable) return;
        
        let direction = 'asc';
        if (sortConfig.key === columnIndex && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: columnIndex, direction });
    };

    // Sort the data based on the current sort configuration
    const sortedData = [...data];
    if (sortConfig.key !== null && columns[sortConfig.key].sortable) {
        sortedData.sort((a, b) => {
            const aValue = a[columns[sortConfig.key].key];
            const bValue = b[columns[sortConfig.key].key];
            
            // Handle numeric values
            if (typeof aValue === 'number' || !isNaN(aValue)) {
                return sortConfig.direction === 'asc' 
                    ? Number(aValue) - Number(bValue)
                    : Number(bValue) - Number(aValue);
            }
            
            // Handle string values
            return sortConfig.direction === 'asc'
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });
    }

    const sortableHead = React.Children.map(head, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                children: React.Children.map(child.props.children, (cell, index) => {
                    if (React.isValidElement(cell) && cell.type === 'th') {
                        const isSorted = sortConfig.key === index;
                        const isSortable = columns[index].sortable !== false; // Default to true if not specified
                        return React.cloneElement(cell, {
                            onClick: () => handleSort(index),
                            style: { 
                                cursor: isSortable ? 'pointer' : 'default',
                                position: 'relative'
                            },
                            children: (
                                <>
                                    {cell.props.children}
                                    {isSorted && isSortable && (
                                        <span style={{ marginLeft: '5px' }}>
                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </>
                            )
                        });
                    }
                    return cell;
                })
            });
        }
        return child;
    });

    return (
        <table className="custom-table">
            <thead>
                {sortableHead}
            </thead>
            <tbody>
                {sortedData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column, colIndex) => (
                            <td key={colIndex} className={column.className}>
                                {column.render ? column.render(row) : row[column.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;