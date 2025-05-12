'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../styles/Reports.css";
// Logo
import { FaSyncAlt, FaSignOutAlt } from "react-icons/fa";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import ReportTable from "./ReportTable";
import Image from "next/image";

interface ReportsProps {
  accessToken: string;
  refreshToken: string;
  idToken: string;
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

  useEffect(() => {
    localStorage.setItem("token", accessToken);
    fetchData(currentPage);
  }, [currentPage, activeTab, accessToken]);

  const fetchData = async (page: number) => {
    setIsRefreshing(true);
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    setLastPaginationKey(null);
    const tableParam = activeTab === "callbacks" ? "TABLE_CALLBACK" : "TABLE_SURVEY";
    try {
      let url = `https://wdba5ur6id.execute-api.us-east-1.amazonaws.com/prod/fetch-data?table=${tableParam}&lastEvaluatedKey=${lastPaginationKey || ""}`;
      const response = await fetch(
        url,
        {
          method: "GET",
          headers: { "Authorization": `Bearer ${accessToken}` },
        }
      );

      if (response.status === 401 || response.status === 404) {
        //setErrorFetchData(true);
      } else {
        const responseData = await response.json();
        setData(responseData.items);
        setItemsCountTable(responseData.itemCount || 50);
        setItems(responseData.items.length);

        if (responseData.lastEvaluatedKey) {
          setPaginationKeys((prevKeys) => ({ ...prevKeys, [page]: responseData.lastEvaluatedKey }));
          setLastPaginationKey(responseData.lastEvaluatedKey);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const switchTab = (tab: string) => {
    if (activeTab !== tab) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab(tab);
        setIsTransitioning(false);
        setLastPaginationKey(null);
        handlePageChange(1);
      }, 300); // Duración de la animación
    }
  };

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

  const handleDownloadTable = async () => {
    try {
      console.log("Download Table CSV");
      let tableParam = activeTab === "callbacks" ? "TABLE_CALLBACK" : "TABLE_SURVEY";
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
          <div className="tabs">
            <span className={activeTab === "callbacks" ? "active-tab" : ""} onClick={() => switchTab("callbacks")}>
              Callbacks
            </span>
            <span className={activeTab === "surveys" ? "active-tab" : ""} onClick={() => switchTab("surveys")}>
              Encuestas
            </span>
          </div>
          <div className="header-icons">
            <FaSyncAlt className={`refresh-icon ${isRefreshing ? "rotating" : ""}`} onClick={() => { setCurrentPage(1); fetchData(1); }} />
            <FaSignOutAlt size={22} className="logout-icon" onClick={() => {
              localStorage.removeItem("token");
              router.push("/");
            }} />
          </div>
        </div>
        <hr className="divider" />
        <div className={`table-container ${isTransitioning ? "fade-out" : "fade-in"}`}>
          <div className="table-title">
            <p className="items-count">Ítems: {items}</p>
            <button className={!showDownloadMenu ? "download-container" : "download-container-dropdown-open"} onClick={() => setShowDownloadMenu(!showDownloadMenu)}>
              <HiOutlineDocumentDownload size={22} color="white" className="download-button" />
              <span className="textDownload">Descargar</span>
            </button>
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
          <ReportTable data={data} activeTab={activeTab} />
        </div>
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
