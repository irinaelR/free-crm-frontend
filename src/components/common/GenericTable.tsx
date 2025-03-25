import { ReactNode, useState } from "react";
import {FaPencil, FaCheck, FaXmark, FaTrash, FaForward} from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import {FaBackward} from "react-icons/fa";

type TableData = {
    headers: string[];
    tableContents: {
        value: string | number | boolean | Date | ReactNode;
        id?: string; // Optional id to identify the row for API calls
    }[][];
    modifiableCol?: number; // Index of the column that should be modifiable
    onRowUpdate?: (rowData: any, modifiedValue: number) => Promise<void>; // Callback for row update
    onRowDelete?: (rowData: any) => Promise<void>; // Callback for row delete
    itemsPerPage?: number; // Number of items to display per page
};

const GenericTable: React.FC<TableData> = ({
                                               headers,
                                               tableContents,
                                               modifiableCol,
                                               onRowUpdate,
                                               onRowDelete,
                                               itemsPerPage = 10, // Default to 10 items per page
                                           }) => {
    const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
    const [modifiedValue, setModifiedValue] = useState<number>(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [removedRowIndex, setRemovedRowIndex] = useState<number | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(tableContents.length / itemsPerPage);

    // Get current page data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tableContents.slice(indexOfFirstItem, indexOfLastItem);

    const renderItem = (item: string | number | boolean | Date | ReactNode) => {
        if (item instanceof Date) {
            return item.toLocaleDateString("en-US", {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }); // e.g., "Jan 20, 2025"
        } else if (typeof item === "number") {
            return item.toLocaleString("en-EN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }); // e.g., "1 234,56"
        } else if (typeof item === "boolean") {
            return <input type="checkbox" checked={item} disabled />;
        } else {
            return item; // Strings remain unchanged
        }
    };

    // Function to handle saving the modified value
    const handleSave = async (rowIndex: number) => {
        if (!onRowUpdate) return;

        try {
            setIsUpdating(true);
            // Calculate the actual index in the original data
            const actualRowIndex = indexOfFirstItem + rowIndex;
            // Get the row data to send to the API
            const rowData = tableContents[actualRowIndex];
            await onRowUpdate(rowData, modifiedValue);
            setEditingRowIndex(null);
        } catch (error) {
            console.error('Error updating row:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (rowIndex: number) => {
        if (!onRowDelete) return;

        try {
            // Calculate the actual index in the original data
            const actualRowIndex = indexOfFirstItem + rowIndex;
            const rowData = tableContents[actualRowIndex];
            await onRowDelete(rowData);
            tableContents.splice(actualRowIndex, 1);

            // Check if we need to adjust the current page after deletion
            if (currentItems.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }

            setRemovedRowIndex(null);
        } catch (err) {
            console.error('Error deleting row:', err);
        }
    }

    // Function to render a cell with modification capabilities if needed
    const renderCell = (item: any, rowIndex: number, colIndex: number) => {
        // Check if this is the modifiable column and this row is being edited
        if (modifiableCol !== undefined && colIndex === modifiableCol) {
            if (editingRowIndex === rowIndex) {
                return (
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            value={modifiedValue}
                            onChange={(e) => setModifiedValue(Number(e.target.value))}
                            className="w-48 p-2 border border-gray-400 rounded text-base"
                            step="0.01"
                        />
                        <button
                            onClick={() => handleSave(rowIndex)}
                            disabled={isUpdating}
                            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                            title="Save"
                        >
                            {isUpdating ? <span className="animate-pulse">...</span> : <FaCheck size={16} />}
                        </button>
                        <button
                            onClick={() => setEditingRowIndex(null)}
                            className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            title="Cancel"
                        >
                            <FaXmark size={16} />
                        </button>
                    </div>
                );
            } else {
                return (
                    <div className="flex items-center space-x-2">
                        <span className="min-w-36">{renderItem(item.value)}</span>
                        {modifiableCol !== undefined && onRowUpdate && onRowDelete && (
                            <div>
                                <button
                                    onClick={() => {
                                        setEditingRowIndex(rowIndex);
                                        setModifiedValue(typeof item.value === 'number' ? item.value : 0);
                                    }}
                                    className="ml-2 p-1.5 text-blue-500 cursor-pointer rounded hover:text-blue-600 text-base"
                                    title="Modify amount"
                                >
                                    <FaPencil size={14} />
                                </button>
                                <button
                                    onClick={() => {
                                        setRemovedRowIndex(rowIndex);
                                        handleDelete(rowIndex);
                                    }}
                                    className="ml-2 p-1.5 text-red-500 cursor-pointer rounded hover:text-red-600 text-base"
                                    title="Delete row"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                );
            }
        }

        // Regular cell rendering
        return renderItem(item.value);
    };

    // Generate table column classes with special handling for modifiable column
    const getColumnClass = (index: number) => {
        if (modifiableCol !== undefined && index === modifiableCol) {
            return "w-10"; // Make the modifiable column wider
        }
        return "w-0";
    };

    // Page change handlers
    const goToNextPage = () => {
        setCurrentPage(page => Math.min(page + 1, totalPages));
        setEditingRowIndex(null); // Cancel any editing when changing pages
    };

    const goToPreviousPage = () => {
        setCurrentPage(page => Math.max(page - 1, 1));
        setEditingRowIndex(null); // Cancel any editing when changing pages
    };

    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setEditingRowIndex(null); // Cancel any editing when changing pages
    };

    const goToFirstPage = () => {
        setEditingRowIndex(null);
        setCurrentPage(1);
    }

    const goToLastPage = () => {
        setEditingRowIndex(null);
        setCurrentPage(totalPages);
    }

    // Generate pagination buttons
    const renderPaginationButtons = () => {
        const pageButtons = [];
        const maxPageButtons = 5; // Maximum number of page buttons to show

        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        // Adjust if we're at the end
        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`px-3 py-1 mx-1 rounded ${
                        currentPage === i
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }

        return pageButtons;
    };

    return (
        <div className="rounded-lg overflow-hidden shadow-md">
            <table className="w-full text-left min-w-max rounded-lg font-body">
                <thead className="border-b bg-blue-300 border-b-blue-200">
                <tr>
                    {headers.map((header, index) => (
                        <th
                            key={index}
                            className={`p-4 text-lg font-bold text-blue-50 cursor-pointer ${getColumnClass(index)}`}
                        >
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                {currentItems && currentItems.length > 0 ? (
                    <tbody>
                    {currentItems.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={
                                rowIndex < currentItems.length - 1
                                    ? "border-b border-b-blue-100"
                                    : ""
                            }
                        >
                            {row.map((item, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`p-4 ${editingRowIndex === rowIndex && colIndex === modifiableCol ? 'bg-blue-50' : ''} ${getColumnClass(colIndex)}`}
                                >
                                    {renderCell(item, rowIndex, colIndex)}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                ) : (
                    <tbody>
                    <tr>
                        <td colSpan={headers.length} className="p-4 text-center">
                            No data available
                        </td>
                    </tr>
                    </tbody>
                )}
            </table>

            {/* Pagination Controls */}
            {tableContents.length > itemsPerPage && (
                <div className="flex justify-between items-center bg-gray-100 p-4 border-t">
                    <div className="text-sm text-gray-600">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, tableContents.length)} of {tableContents.length} entries
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={goToFirstPage}
                            disabled={currentPage === 1}
                            className="p-2 mx-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaBackward size={14} />
                        </button>

                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="p-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaChevronLeft size={14} />
                        </button>

                        {renderPaginationButtons()}

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaChevronRight size={14} />
                        </button>
                        <button
                            onClick={goToLastPage}
                            disabled={currentPage === totalPages}
                            className="p-2 mx-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaForward size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GenericTable;