"use client";

import React, { createContext, useContext } from "react";

interface CampaignPermissionsContextType {
  hasEmailPermission: boolean;
  hasSmsPermission: boolean;
  hasVoicePermission: boolean;
}

// Estado inicial
const initialCampaignPermissions: CampaignPermissionsContextType = {
  hasEmailPermission: false,
  hasSmsPermission: false,
  hasVoicePermission: false,
};

const CampaignPermissionsContext = createContext<CampaignPermissionsContextType>(
  initialCampaignPermissions,
);

export function CampaignPermissionsProvider({
  children,
  hasEmailPermission,
  hasSmsPermission,
  hasVoicePermission,
}: {
  children: React.ReactNode;
  hasEmailPermission: boolean;
  hasSmsPermission: boolean;
  hasVoicePermission: boolean;
}) {
  const value = {
    hasEmailPermission,
    hasSmsPermission,
    hasVoicePermission,
  };
  return (
    <CampaignPermissionsContext.Provider value={value}>
      {children}
    </CampaignPermissionsContext.Provider>
  );
}

export function useCampaignPermissions() {
  const context = useContext(CampaignPermissionsContext);
  if (context === undefined) {
    throw new Error(
      "useCampaignPermissions must be used within a SegmentPermissionsProvider",
    );
  }
  return context;
}
