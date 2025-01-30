import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Table = ({ columns, data, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            {/* Tabla para pantallas grandes */}
            <table className="hidden md:table min-w-full bg-white border border-gray-200">
                <thead className="">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 border-b border-gray-200 bg-[#70C544] text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                        {(onEdit || onDelete) && (
                            <th className="px-6 py-3 border-b border-gray-200 bg-[#70C544] text-right text-xs font-medium text-white uppercase tracking-wider">
                                Acciones
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-6 py-4 border-b border-gray-200"
                                >
                                    {column.render ? column.render(row) : row[column.key]}
                                </td>
                            ))}

                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Lista de tarjetas para pantallas pequeñas */}
            <div className="md:hidden space-y-4">
                {data.map((row, rowIndex) => (
                    <div key={rowIndex} className="bg-white p-4 rounded-lg shadow-md">
                        {columns.map((column, colIndex) => (
                            <div key={colIndex} className="mb-2">
                                <span className="font-medium text-gray-700">{column.header}: </span>
                                <span className="text-gray-600">
                                    {column.render ? column.render(row) : row[column.key]}
                                </span>
                            </div>
                        ))}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Table;