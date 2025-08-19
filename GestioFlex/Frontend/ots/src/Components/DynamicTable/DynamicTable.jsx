import React, { useState, useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from "react-router-dom";

// Función para obtener propiedades anidadas
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
};

const DynamicTable = ({ token, apiurl, columns, basePath }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch(apiurl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Error al cargar datos");
        const datos = await response.json();
        setData(datos);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchPedidos();
  }, [apiurl, token]);

  const handleRowClick = (id) => {
    navigate(`${basePath}/${id}`);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.field}>{column.headerName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id} onClick={() => handleRowClick(row.id)} style={{ cursor: "pointer" }}>
              {columns.map((column) => (
                <td key={column.field}>
                  {column.valueFormatter
                    ? column.valueFormatter(getNestedValue(row, column.field))
                    : getNestedValue(row, column.field) || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Filas por página"
      />
    </div>
  );
};

export default DynamicTable;
