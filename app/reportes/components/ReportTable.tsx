'use client'

import React, { useState } from "react";
import "../styles/ReportTable.css";

interface Column {
  field: string;
  label: string;
  fixed?: boolean;
}

interface ReportTableProps {
  data: any[];
  activeTab: string;
}

type SortConfig = {
  key: string | null;
  direction: 'asc' | 'desc';
};

const ReportTable: React.FC<ReportTableProps> = ({ data, activeTab }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" });

  const columns: Column[] = activeTab === "callbacks"
    ? [
        //{ field: "contact_id", label: "ID Contacto", fixed: true },
        { field: "estado", label: "Estado" },
        { field: "fecha_devolucion", label: "Fecha Devolución" },
        { field: "hora_devolucion", label: "Hora Devolución" },
        { field: "fecha_generacion", label: "Fecha Generación" },
        { field: "hora_generacion", label: "Hora Generación" },
        { field: "intentos", label: "Intentos" },
        { field: "nro_doc", label: "Nro Documento" },
        { field: "tipo_doc", label: "Tipo Documento" },
        { field: "servicio", label: "Servicio" }
      ]
    : [
        //{ field: "PK", label: "ID Contacto", fixed: true },
        { field: "agente", label: "Agente" },
        { field: "cola", label: "Cola" },
        { field: "nroDoc", label: "Documento" },
        { field: "tipoDoc", label: "Tipo Documento" },
        { field: "fecha", label: "Fecha" },
        { field: "hora", label: "Hora" },
        { field: "ntel", label: "N° Teléfono" },
        { field: "respuesta_1", label: "Respuesta 1" },
        { field: "respuesta_2", label: "Respuesta 2" }
      ];

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="table-wrapper">
      <div className="scroll-container">
        <table className="report-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.field} onClick={() => handleSort(column.field)} className={column.fixed ? "fixed-column" : ""}>
                  {column.label} {sortConfig.key === column.field ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▼"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={column.field} className={column.fixed ? "fixed-column" : ""}>{row[column.field]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data">No hay datos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;
