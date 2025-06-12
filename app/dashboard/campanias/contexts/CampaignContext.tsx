'use client'

import React, { createContext, useContext, useState } from 'react'
import { Template } from '@/app/dashboard/plantillas/contexts/TemplateContext'

// Tipos para la campaña
export interface Contact {
  id?: string;
  PhoneNumber: string;
  UserLang: string;
}

export interface Segment {
  value: string;
  label: string;
  createdAt: string;
  // Campos adicionales para el formato de segmentos completos
  segmentId?: string;
  segmentName?: string;
  status?: string;
  channelType?: string;
  recordsProcessed?: number;
  startedAt?: string;
  updatedAt?: string;
}

export type CampaignType = 'EMAIL' | 'SMS' | 'VOICE';
export type SchedulingType = 'instantanea' | 'programar';

export interface Campaign {
  name: string;
  email: string;
  // Nuevos campos para campañas de email
  subject: string;
  senderEmail: string;
  contact: Contact | null;
  segment: Segment | null;
  template: Template | null;
  type: CampaignType;
  schedulingType: SchedulingType;
  scheduledDate: Date | null;
}

interface CampaignContextType {
  campaign: Campaign;
  updateCampaign: (data: Partial<Campaign>) => void;
  resetCampaign: () => void;
}

// Lista de canales disponibles
export const CHANNEL_TYPES: CampaignType[] = ['EMAIL', 'SMS', 'VOICE'];

// Estado inicial
const initialCampaign: Campaign = {
  name: '',
  email: '',
  subject: '',
  senderEmail: '',
  contact: null,
  segment: null,
  template: null,
  type: 'EMAIL',
  schedulingType: 'instantanea',
  scheduledDate: new Date()
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [campaign, setCampaign] = useState<Campaign>(initialCampaign)

  const updateCampaign = (data: Partial<Campaign>) => {
    setCampaign(prev => ({ ...prev, ...data }))
  }

  const resetCampaign = () => {
    setCampaign(initialCampaign)
  }

  return (
    <CampaignContext.Provider value={{ campaign, updateCampaign, resetCampaign }}>
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaign() {
  const context = useContext(CampaignContext)
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider')
  }
  return context
} 