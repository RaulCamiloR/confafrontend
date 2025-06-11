'use client'

import React, { useEffect, useState } from "react";
import "../styles/ReportTable.css";
import { FaSyncAlt } from "react-icons/fa";
import { HiOutlineDocumentDownload } from "react-icons/hi";

interface Column {
  field: string;
  label: string;
  fixed?: boolean;
}


type ColumnDef = {
  key: string;
  label: string;
};

type TabConfig = {
  key: string;
  label: string;
  endpoint: string;
  columns: ColumnDef[];
};

interface ReportTableProps {
  tabs: TabConfig[];
  title?: string;
  rowKey?: string;
  accessToken?:string
  onDownload: (tab: string) => void;
  refreshButton:boolean;
  downloadButton:boolean;
}

type SortConfig = {
  key: any | null;
  direction: 'asc' | 'desc';
};

const ReportTable: React.FC<ReportTableProps> = ({ 
  tabs,
  title,
  rowKey = 'id',
  accessToken ,
  onDownload,
  refreshButton,
  downloadButton
}) => {
  const [selectedTabKey, setSelectedTabKey] = useState(tabs[0].key);
  const [rawData, setRawData] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedTab = tabs.find((tab) => tab.key === selectedTabKey);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" });

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    if (!selectedTab) return;

    try {
      const response = await fetch(selectedTab.endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401 || response.status === 404) {
        setError("No autorizado o recurso no encontrado");
      } else {
        const responseData = await response.json();
        const items = responseData.items ?? responseData;
        setRawData(items); // Guardamos sin ordenar
      }
    } catch (err) {
      console.error("Error al cargar los datos", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTabKey]);

  useEffect(() => {
    if (!sortConfig.key) {
      setData(rawData);
      return;
    }

  const sorted = [...rawData].sort((a, b) => {
  const aValue = a[sortConfig.key] ?? '';
  const bValue = b[sortConfig.key] ?? '';

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  setData(sorted);
}, [rawData, sortConfig]);

return (
  <div className="w-full">
    <div className="flex justify-between items-center w-full mb-[10px] mt-[2vh]">
      <div className="flex gap-[20px] text-[26px] font-bold text-gray-50">
        {tabs.map((tab) => (
          <span
            key={tab.key}
            onClick={() => setSelectedTabKey(tab.key)}
            className={`px-4 py-2 text-[18px] cursor-pointer ${
              tab.key === selectedTabKey
                ? 'text-orange-500 border-b-[3px] border-orange-500 font-bold'
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </span>
        ))}
      </div>

      <div className="flex gap-[15px] items-center">
        {refreshButton && (
          <div className="group">
            <FaSyncAlt
              className="text-[20px] cursor-pointer text-orange-500 transition-transform duration-300 ease-in-out group-hover:rotate-180"
              onClick={() => { fetchData(); }}
            />
          </div>
        )}
       {downloadButton && <div
          className="group flex items-center justify-center bg-orange-500 text-white rounded-full px-4 py-2 cursor-pointer w-fit transition-all duration-600 ease-in-out hover:bg-orange-600 hover:shadow-lg"
          onClick={() => {
            onDownload(selectedTabKey);
          }}
        >
          <HiOutlineDocumentDownload size={24} className="transition-all duration-600" />
          <span className="ml-0 group-hover:ml-2 overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-200 ease-in-out font-semibold text-sm">
            Descargar
          </span>
        </div>}
      </div>
    </div>

    {!loading && <hr className="divider" />}

    {loading ? (
      <div className="flex justify-center items-center p-8 h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    ) : (
      <div
        className={`
          w-full
          bg-gray-50
          p-[2vh]
          rounded-[10px]
          shadow-[1px_0px_20px_10px_rgba(0,0,0,0.1)]
          transition-opacity duration-300
        `}
      >
        <div className="flex flex-row items-center justify-between mb-2 relative pt-2">
          <p className="text-[22px] font-bold mb-[5px] mt-0 text-left w-full text-gray-800">
            Ítems: {data?.length ?? '0'}
          </p>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          <div className="max-h-[360px] overflow-y-auto">
            <table className="min-w-full table-auto bg-white">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  {selectedTab?.columns?.map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}{' '}
                      {sortConfig.key === col.key
                        ? sortConfig.direction === 'asc'
                          ? '▲'
                          : '▼'
                        : '▼'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="even:bg-gray-50">
                    {selectedTab?.columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-2 text-sm text-gray-800 border-b"
                      >
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
  </div>
);
   /* 
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
   
   
   */
};

export default ReportTable;
