'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../styles/Reports.css";
// Logo
import { FaSyncAlt, FaSignOutAlt } from "react-icons/fa";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import ReportTable from "./ReportTable";
import Image from "next/image";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

interface ReportsProps {
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

interface Column {
  field: string;
  label: string;
  fixed?: boolean;
}

// Definir tipos para los datos
type PaginationKeysType = Record<number, string | null>;
type PageType = (number | string);

const Reports: React.FC<ReportsProps> = ({ accessToken, refreshToken, idToken }) => {
  const [activeTab, setActiveTab] = useState("callbacks");
  const [items, setItems] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationKeys, setPaginationKeys] = useState<PaginationKeysType>({});
  const maxPageDisplay = 7;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [itemsCountTable, setItemsCountTable] = useState(0);
  const [lastPaginationKey, setLastPaginationKey] = useState<string | null>(null);
  const [errorFetchData, setErrorFetchData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const router = useRouter();
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

  const handlePageChange = (page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
    }
  };

  const generatePagination = (): PageType[] => {
    let pages: PageType[] = [];
    if (itemsCountTable < 51) {
      pages = [1];
    } else {
      if (Object.keys(paginationKeys).length < maxPageDisplay) {
        pages = Array.from({ length: Object.keys(paginationKeys).length + 1 }, (_, i) => i + 1);
      } else if (currentPage <= 4) {
        pages = [1, 2, 3, 4, 5, 6, 7, "..."];
      } else if (!paginationKeys[currentPage]) {
        pages = [1, "...", currentPage - 3, currentPage - 2, currentPage - 1, currentPage];
      } else {
        pages = [1, "...", currentPage - 3, currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, "..."];
      }
    }

    return pages;
  };

  const handleDownload = (data: any[]) => {
    console.log("Download Page CSV");
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadTable = async (tab:string) => {
    try {
      console.log("Download Table CSV");
      let tableParam = tab === "callbacks" ? "TABLE_CALLBACK" : "TABLE_SURVEY";
      let url = `https://wdba5ur6id.execute-api.us-east-1.amazonaws.com/prod/fetch-all-items?table=${tableParam}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const dataResponse = await response.json();
      console.log(dataResponse.items);
      const csvTable = convertToCSV(dataResponse.items);
      const blob = new Blob([csvTable], { type: "text/csv;charset=utf-8;" });
      const urlBlob = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = "table_data.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading table:", error);
    }
  };

  const tabs = [
  {
    key: "callbacks",
    label: "Callbacks",
    endpoint: `https://wdba5ur6id.execute-api.us-east-1.amazonaws.com/prod/fetch-data?table=TABLE_CALLBACK&lastEvaluatedKey=`,
    columns: [
      //{ field: "contact_id", label: "ID Contacto", fixed: true },
      { key: "estado", label: "Estado" },
      { key: "fecha_devolucion", label: "Fecha Devolución" },
      { key: "hora_devolucion", label: "Hora Devolución" },
      { key: "fecha_generacion", label: "Fecha Generación" },
      { key: "hora_generacion", label: "Hora Generación" },
      { key: "intentos", label: "Intentos" },
      { key: "nro_doc", label: "Nro Documento" },
      { key: "tipo_doc", label: "Tipo Documento" },
      { key: "servicio", label: "Servicio" }
    ]
  },
  {
    key: "surveys",
    label: "Encuestas",
    endpoint: `https://wdba5ur6id.execute-api.us-east-1.amazonaws.com/prod/fetch-data?table=TABLE_SURVEY&lastEvaluatedKey=`,
    columns: [
      //{ field: "PK", label: "ID Contacto", fixed: true },
      { key: "agente", label: "Agente" },
      { key: "cola", label: "Cola" },
      { key: "nroDoc", label: "Documento" },
      { key: "tipoDoc", label: "Tipo Documento" },
      { key: "fecha", label: "Fecha" },
      { key: "hora", label: "Hora" },
      { key: "ntel", label: "N° Teléfono" },
      { key: "respuesta_1", label: "Respuesta 1" },
      { key: "respuesta_2", label: "Respuesta 2" }
    ]
  }
];

  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return "";

    const headers = Object.keys(data[0]).join(","); // Encabezados del CSV
    const rows = data
      .map((item) =>
        Object.values(item)
          .map((value) => `"${value}"`) // Envolver valores en comillas para evitar problemas con comas
          .join(",")
      )
      .join("\n");

    return `${headers}\n${rows}`; // Junta encabezados y filas
  };

  if (errorFetchData) {
    return (
      <div className="reports-page">
        <Image src="/images/confalogo.png" alt="Logo Confa" className="logo" width={180} height={60} />
        
        <div className="error">
          <p className="error-title">Sesión finalizada</p>
          <p className="error-subtitle">Se expiró el tiempo de sesión de 1 hora</p>
        </div>
        <button className="error-button" onClick={() => { localStorage.removeItem("token"); router.push("/auth"); }}>
          Volver a Iniciar Sesión
        </button>
      </div>
    );
  } else {
    return (
      <div className="reports-page">
        <Image src="/images/confalogo.png" alt="Logo Confa" className="logo" width={180} height={60} />
       <div className="header-container">
        <Link
          href="/"
          className="flex items-left justify-center space-x-2 text-white bg-orange-500 hover:bg-orange-200 px-6 py-2 rounded-lg transition-colors w-48"
        >
          <MdArrowBack className="text-xl" />
          <span>Volver</span>
        </Link>
        </div>  
        
          <ReportTable accessToken={accessToken} tabs={tabs} onDownload={handleDownloadTable} refreshButton={true} downloadButton={true}/>
        
        <div className="pagination">
          <button onClick={() => itemsCountTable > 50 ? handlePageChange(currentPage - 1) : null} disabled={currentPage === 1}>{"<"}</button>
          {generatePagination().map((page, index) => (
            <button key={index} className={page === currentPage ? "active-page" : ""} onClick={() => typeof page === "number" && handlePageChange(page)}>
              {page}
            </button>
          ))}
          <button onClick={() => itemsCountTable > 50 ? handlePageChange(currentPage + 1) : null} disabled={!paginationKeys[currentPage]}>{">"}</button>
        </div>
      </div>
    );
  }
};

export default Reports;
/*
     <div className="table-title">
            {showDownloadMenu && (
                <div className="dropdown-menu">
                  <li className="dropdown-option" style={{ "--i": 0 } as React.CSSProperties} onClick={(e) => {
                    handleDownload(data);
                    setShowDownloadMenu(false);
                  }}>
                    Descarga página actual
                  </li>
                  <li className="dropdown-option" style={{ "--i": 1 } as React.CSSProperties} onClick={(e) => {
                    handleDownloadTable();
                    setShowDownloadMenu(false);
                  }}>
                    Descarga completa
                  </li>
                </div>
              )}
          </div>

          */