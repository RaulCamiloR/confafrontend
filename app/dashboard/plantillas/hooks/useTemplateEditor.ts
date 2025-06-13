"use client";

import { useState, useRef } from "react";
import { EditorRef, EmailEditorProps } from "react-email-editor";
import axios from "axios";
import { JSONTemplate } from "../contexts/TemplateContext";

type NotificationType = {
  message: string;
  type: "success" | "error";
} | null;

export const useTemplateEditor = ({
  defaultContent,
  name,
}: {
  defaultContent?: JSONTemplate;
  name?: string;
}) => {
  const emailEditorRef = useRef<EditorRef>(null);
  const [templateName, setTemplateName] = useState(name ?? "");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [notification, setNotification] = useState<NotificationType>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const exportHtml = () => {
    if (isProcessing) return;

    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data) => {
      const { design, html } = data;
      console.log("exportHtml", html);

      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "template.html";
      a.click();
      URL.revokeObjectURL(url);
    });
  };
  const duplicateTemplateFromList = async (template) => {
    if (isProcessing) return;

    setIsProcessing(true);

    const params = {
      templateName: `${template.name} (Copia)`,
      content: template.html,
      jsonTemplate: template.design,
      channel: template.type || "EMAIL",
    };

    try {
      const { data } = await axios.post("/api/templates", params);

      console.log({ data });

      setNotification({
        message: "¡Template duplicado exitosamente!",
        type: "success",
      });

      setTimeout(() => {
        setNotification(null);
        setIsProcessing(false);
      }, 3000);
      return true
    } catch (error:any) {
      //console.error("Error al duplicar el template:", error);

      let errorMsg = "Error al duplicar el template";

      if (error?.status === 400) {
        errorMsg = `Ya existe un template con el nombre "${params.templateName}".`;
      }

      setNotification({ message: errorMsg, type: "error" });
      setTimeout(() => {
        setNotification(null);
        setIsProcessing(false);
      }, 3000);
      return false
    }
  };
  const duplicateTemplate = async () => {
    if (isProcessing) return;

    /*if (!templateName.trim()) {
      alert("Por favor ingrese un nombre para el template");
      return;
    }*/

    setIsProcessing(true);
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml(async (data) => {
      const { design, html } = data;

      try {
        const params = {
            templateName: `${templateName} (Copia)`,
            content: html,
            jsonTemplate: design,
            channel: "EMAIL",
          };

        console.log({ params });

        const { data } = await axios.post("/api/templates", params);

        console.log({ data });

        setNotification({
          message: "¡Template guardado exitosamente!",
          type: "success",
        });

        // Limpiar campos después de guardar exitosamente
        setTemplateName("");
        setShowSaveForm(false);

        // Resetear notification después de 3 segundos
        setTimeout(() => {
          setNotification(null);
          setIsProcessing(false);
        }, 3000);
      } catch (error: any) {
        console.error("Error al guardar el template:", error);

        // Verificar si es un error de nombre duplicado
        let errorMsg = "Error al guardar el template";

        if (error.response) {
          const statusCode = error.response.status;
          const responseData = error.response.data;

          // Si recibimos un mensaje específico del backend sobre duplicación
          if (
            statusCode === 409 ||
            (responseData &&
              responseData.error &&
              responseData.error.includes("existe"))
          ) {
            errorMsg = `Ya existe un template con el nombre "${templateName}". Por favor, usa un nombre diferente.`;
          }
        }

        setNotification({ message: errorMsg, type: "error" });
        setTimeout(() => {
          setNotification(null);
          setIsProcessing(false);
        }, 3000);
      }
    });
  };

  const saveTemplate = async (templateId?: string) => {
    if (isProcessing) return;

    if (!templateName.trim()) {
      alert("Por favor ingrese un nombre para el template");
      return;
    }

    setIsProcessing(true);
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml(async (data) => {
      const { design, html } = data;
      try {
        if (templateId) {
          const params = {
            id: templateId,
            templateName,
            content: html,
            jsonTemplate: design,
            channel: "EMAIL",
          };

          console.log({ params });
          const { data } = await axios.put("/api/templates", params);

          console.log({ data });
        } else {
          const params = {
            templateName,
            content: html,
            jsonTemplate: design,
            channel: "EMAIL",
          };

          console.log({ params });

          const { data } = await axios.post("/api/templates", params);

          console.log({ data });
        }

        setNotification({
          message: "¡Template guardado exitosamente!",
          type: "success",
        });

        // Limpiar campos después de guardar exitosamente
        setTemplateName("");
        setShowSaveForm(false);

        // Resetear notification después de 3 segundos
        setTimeout(() => {
          setNotification(null);
          setIsProcessing(false);
        }, 3000);
      } catch (error: any) {
        console.error("Error al guardar el template:", error);

        // Verificar si es un error de nombre duplicado
        let errorMsg = "Error al guardar el template";

        if (error.response) {
          const statusCode = error.response.status;
          const responseData = error.response.data;

          // Si recibimos un mensaje específico del backend sobre duplicación
          if (
            statusCode === 409 ||
            (responseData &&
              responseData.error &&
              responseData.error.includes("existe"))
          ) {
            errorMsg = `Ya existe un template con el nombre "${templateName}". Por favor, usa un nombre diferente.`;
          }
        }

        setNotification({ message: errorMsg, type: "error" });
        setTimeout(() => {
          setNotification(null);
          setIsProcessing(false);
        }, 3000);
      }
    });
  };

  const onReady: EmailEditorProps["onReady"] = (unlayer) => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
    // const templateJson = { DESIGN JSON GOES HERE };
    // unlayer.loadDesign(templateJson);
    if (defaultContent) {
      unlayer.loadDesign(defaultContent);
    }
    
  };

  const handleTemplateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateName(e.target.value);
  };

  const toggleSaveForm = () => {
    setShowSaveForm(!showSaveForm);
  };

  const cancelSaveForm = () => {
    setShowSaveForm(false);
  };

  return {
    // Referencias
    emailEditorRef,

    // Estados
    templateName,
    showSaveForm,
    notification,
    isProcessing,

    // Funciones
    exportHtml,
    saveTemplate,
    duplicateTemplate,
    onReady,
    handleTemplateNameChange,
    toggleSaveForm,
    cancelSaveForm,
    duplicateTemplateFromList
  };
};
