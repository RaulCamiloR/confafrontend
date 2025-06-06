"use client"

import { useState, useRef } from 'react'
import { EditorRef, EmailEditorProps } from 'react-email-editor'
import axios from 'axios'

type NotificationType = {
  message: string;
  type: 'success' | 'error';
} | null;

export const useTemplateEditor = () => {
  const emailEditorRef = useRef<EditorRef>(null)
  const [templateName, setTemplateName] = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [notification, setNotification] = useState<NotificationType>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const exportHtml = () => {
    if (isProcessing) return
    
    const unlayer = emailEditorRef.current?.editor

    unlayer?.exportHtml((data) => {
      const { design, html } = data
      console.log('exportHtml', html)

      const blob = new Blob([html], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "template.html"
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  const saveTemplate = async() => {
    if (isProcessing) return
    
    if (!templateName.trim()) {
      alert('Por favor ingrese un nombre para el template')
      return
    }

    setIsProcessing(true)
    const unlayer = emailEditorRef.current?.editor
    
    unlayer?.exportHtml(async (data) => {
      const { design, html } = data
      
      try {
<<<<<<< Updated upstream
        const params = {
          templateName,
          content: html,
          channel: 'EMAIL',
=======
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
>>>>>>> Stashed changes
        }

        console.log({params})

        const {data} = await axios.post('/api/templates', params)

        console.log({data})
        
        setNotification({ message: '¡Template guardado exitosamente!', type: 'success' })
        
        // Limpiar campos después de guardar exitosamente
        setTemplateName('')
        setShowSaveForm(false)
        
        // Resetear notification después de 3 segundos
        setTimeout(() => {
          setNotification(null)
          setIsProcessing(false)
        }, 3000)
        
      } catch (error: any) {
        console.error('Error al guardar el template:', error)
        
        // Verificar si es un error de nombre duplicado
        let errorMsg = 'Error al guardar el template'
        
        if (error.response) {
          const statusCode = error.response.status
          const responseData = error.response.data
          
          // Si recibimos un mensaje específico del backend sobre duplicación
          if (statusCode === 409 || (responseData && responseData.error && responseData.error.includes('existe'))) {
            errorMsg = `Ya existe un template con el nombre "${templateName}". Por favor, usa un nombre diferente.`
          }
        }
        
        setNotification({ message: errorMsg, type: 'error' })
        setTimeout(() => {
          setNotification(null)
          setIsProcessing(false)
        }, 3000)
      }
    })
  }

  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
    // const templateJson = { DESIGN JSON GOES HERE };
    // unlayer.loadDesign(templateJson);
  }

  const handleTemplateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateName(e.target.value)
  }

  const toggleSaveForm = () => {
    setShowSaveForm(!showSaveForm)
  }

  const cancelSaveForm = () => {
    setShowSaveForm(false)
  }

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
    onReady,
    handleTemplateNameChange,
    toggleSaveForm,
    cancelSaveForm
  }
}
