'use client'

import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'
import { TemplateType } from '../constants/plantillas'

// Definir el tipo para un template
export interface Template {
  id: string;
  name: string;
  html: string;
  design: any; // El JSON del diseño de Unlayer
  createdAt: Date;
  isBackendTemplate?: boolean; // Propiedad opcional para indicar si el template viene del backend
  type?: TemplateType; // Tipo de plantilla (EMAIL o SMS)
}

interface TemplateContextType {
  templates: Template[];
  addTemplate: (template: Omit<Template, 'id' | 'createdAt'>) => void;
  getTemplates: () => Template[];
  deleteTemplate: (id: string) => void;
  selectedTemplate: Template | null;
  selectTemplate: (template: Template | null) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined)

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  // Añadir un nuevo template
  const addTemplate = async(template: Omit<Template, 'id' | 'createdAt'>) => {
    
    console.log('Template a guardar:', template);
    

    const newTemplate: Template = {
      ...template,
      id: `temp-${Date.now()}`,
      createdAt: new Date()
    };

    setTemplates(prev => [...prev, newTemplate]);
    
    return newTemplate;
  }

  // Obtener todos los templates
  const getTemplates = () => {
    return templates
  }

  // Eliminar un template
  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id))
  }

  // Seleccionar un template
  const selectTemplate = (template: Template | null) => {
    setSelectedTemplate(template)
  }

  return (
    <TemplateContext.Provider 
      value={{ 
        templates, 
        addTemplate, 
        getTemplates, 
        deleteTemplate, 
        selectedTemplate, 
        selectTemplate 
      }}
    >
      {children}
    </TemplateContext.Provider>
  )
}

export function useTemplates() {
  const context = useContext(TemplateContext)
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider')
  }
  return context
} 