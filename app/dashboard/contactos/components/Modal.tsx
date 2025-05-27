"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiUpload, FiCheck } from "react-icons/fi";
import { AiOutlineFileExcel } from "react-icons/ai";
import { BsCheckCircleFill } from "react-icons/bs";
import axios from "axios";
import { segmentConstants } from "../constants/segments";
import { useSegmentPermissions } from "../contexts/SegmentPermissionsContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const { hasEmailPermission, hasSmsPermission, hasVoicePermission } =
    useSegmentPermissions();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [segmentName, setSegmentName] = useState<string>("");
  const [segmentNameError, setSegmentNameError] = useState<string>("");
  const [uniqueSegmentName, setUniqueSegmentName] = useState<string>("");
  const [channelType, setChannelType] = useState<string>("");
  const [presignedUrl, setPresignedUrl] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  if (!isOpen) return null;

  const resetForm = () => {
    setCurrentStep(1);
    setSegmentName("");
    setSegmentNameError("");
    setUniqueSegmentName("");
    setChannelType("");
    setPresignedUrl("");
    setFile(null);
    setFileName("");
    setUploadStatus("");
    setIsUploading(false);
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const handleSegmentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSegmentName(value);

    // Validar que solo contenga letras y números
    if (!/^[a-zA-Z0-9]*$/.test(value) && value !== "") {
      setSegmentNameError("Solo se permiten letras y números, sin espacios");
    } else {
      setSegmentNameError("");
    }
  };

  const handleNextToFileUpload = async () => {
    if (!segmentName.trim()) {
      setSegmentNameError("El nombre del segmento es obligatorio");
      return;
    }

    if (segmentNameError) {
      return;
    }

    const uniqueName = `${segmentName}-${Date.now()}`;

    setUniqueSegmentName(uniqueName);

    setCurrentStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setUploadStatus("");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setUploadStatus("");
    }
  };

  const handleNextToSummary = () => {
    if (!file) {
      setUploadStatus("Por favor selecciona un archivo primero");
      return;
    }
    setCurrentStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !uniqueSegmentName) {
      setUploadStatus("Información incompleta");
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus("Subiendo archivo...");

      console.log("Segmento:", uniqueSegmentName);
      console.log("Tipo de canal:", channelType);

      console.log("Nombre del archivo:", file?.name);
      console.log("Tipo de archivo:", file?.type);

      console.log("Archivo:", file);

      const { data } = await axios.post("/api/geturl", {
        segmentName: uniqueSegmentName,
        channelType: channelType,
        fileName: file?.name,
        fileType: file?.type,
      });

      console.log("URL prefirmada:", data.data.uploadUrl);

      const response = await axios.put(data.data.uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      console.log("response", response.status);

      console.log({ uniqueSegmentName });

      if (response.status !== 200) {
        throw new Error("Error al subir el archivo");
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));

      setUploadStatus("Archivo subido exitosamente");
      setCurrentStep(4);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setUploadStatus(
        `Error al subir el archivo: ${error instanceof Error ? error.message : "Error desconocido"}`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Determinar el título según el paso actual
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Crear nuevo segmento";
      case 2:
        return "Subir archivo de contactos";
      case 3:
        return "Confirmar y procesar";
      case 4:
        return "Carga exitosa";
      default:
        return title || "Subir contactos";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Asigna un nombre al segmento de contactos que vas a crear.
            </p>
            <div>
              <label
                htmlFor="segmentName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nombre del segmento
              </label>
              <input
                type="text"
                id="segmentName"
                value={segmentName}
                onChange={handleSegmentNameChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  segmentNameError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="ejemplo: clientesvip"
              />
              {segmentNameError && (
                <p className="mt-1 text-sm text-red-500">{segmentNameError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="channelType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Tipo de canal
              </label>
              <select
                id="channelType"
                value={channelType}
                onChange={(e) => setChannelType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="" disabled></option>
                {segmentConstants.channelTypes
                  .filter(
                    (type) =>
                      (type === "EMAIL" && hasEmailPermission) ||
                      (type === "SMS" && hasSmsPermission) ||
                      (type === "VOICE" && hasVoicePermission),
                  )
                  .map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={handleNextToFileUpload}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sube el archivo Excel con los contactos para el segmento{" "}
              <span className="font-semibold">{uniqueSegmentName}</span>
            </p>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 ${
                isDragging
                  ? "border-orange-500 bg-orange-50 dark:bg-gray-700"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <AiOutlineFileExcel className="mx-auto text-gray-400 dark:text-gray-300 text-4xl mb-2" />
              <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Haz clic para subir</span> o
                arrastra y suelta
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Solo archivos CSV, XLSX (MAX. 10MB)
              </p>
              <input
                type="file"
                className="hidden"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="mt-4 inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 border border-orange-200 rounded-md cursor-pointer hover:bg-orange-200 dark:bg-gray-700 dark:text-orange-400 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <FiUpload className="mr-2" />
                Seleccionar archivo
              </label>
            </div>

            {fileName && (
              <div className="flex items-center p-2 mb-4 bg-gray-50 dark:bg-gray-700 rounded">
                <AiOutlineFileExcel
                  className="text-green-600 dark:text-green-400 mr-2"
                  size={20}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {fileName}
                </span>
              </div>
            )}

            {uploadStatus && uploadStatus !== "Subiendo archivo..." && (
              <div
                className={`p-2 mb-4 rounded text-sm ${
                  uploadStatus.includes("error") ||
                  uploadStatus.includes("Error")
                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                }`}
              >
                {uploadStatus}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNextToSummary}
                disabled={!fileName}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Confirma la información antes de procesar.
            </p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Detalles del segmento
                </h4>
                <div className="mt-1 p-2 border border-gray-200 dark:border-gray-600 rounded-md">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Nombre del segmento:</span>{" "}
                    {uniqueSegmentName}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Tipo de canal:</span>{" "}
                    {channelType}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Archivo seleccionado
                </h4>
                <div className="flex items-center mt-1 p-2 border border-gray-200 dark:border-gray-600 rounded-md">
                  <AiOutlineFileExcel
                    className="text-green-600 dark:text-green-400 mr-2"
                    size={20}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {fileName}
                  </span>
                </div>
              </div>
            </div>

            {uploadStatus && (
              <div
                className={`p-2 mb-4 rounded text-sm ${
                  uploadStatus.includes("error") ||
                  uploadStatus.includes("Error")
                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                    : uploadStatus.includes("exitosamente")
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                }`}
              >
                {uploadStatus}
              </div>
            )}

            <button
              type="submit"
              disabled={isUploading}
              className={`w-full inline-flex justify-center items-center rounded-md px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 focus:ring-orange-500 text-white"
              }`}
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <FiCheck className="mr-2" />
                  Procesar y subir
                </>
              )}
            </button>
          </form>
        );

      case 4:
        return (
          <div className="space-y-6 text-center py-4">
            <BsCheckCircleFill className="mx-auto text-green-500 text-5xl" />
            <div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                ¡Segmento creado exitosamente!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                El archivo ha sido subido y procesado correctamente.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Ahora puedes usar este segmento para tus campañas.
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="inline-flex justify-center items-center rounded-md px-6 py-2 font-medium bg-orange-500 hover:bg-orange-600 focus:ring-orange-500 text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Cerrar
            </button>
          </div>
        );

      default:
        return children;
    }
  };

  // Barra de progreso
  const renderProgressBar = () => {
    // Si estamos en el paso de éxito, mostramos la barra completa
    const progressWidth = currentStep === 4 ? 100 : (currentStep / 3) * 100;

    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
        <div
          className="bg-orange-500 h-2 transition-all duration-300 ease-in-out"
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    );
  };

  // Renderizado condicional de los botones de footer
  const renderFooterButtons = () => {
    // No mostrar botones en la pantalla de éxito
    if (currentStep === 4) {
      return null;
    }

    return (
      <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={handleCloseModal}
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-500 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancelar
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* No mostrar título ni X en la pantalla de éxito */}
        {currentStep !== 4 && (
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {getStepTitle()}
            </h3>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <IoMdClose size={24} />
            </button>
          </div>
        )}

        {/* Barra de progreso */}
        {renderProgressBar()}

        <div className="p-6">{renderStepContent()}</div>

        {renderFooterButtons()}
      </div>
    </div>
  );
};

export default Modal;
