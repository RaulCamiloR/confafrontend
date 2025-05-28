"use client";

import React, { createContext, useContext } from "react";

interface SegmentPermissionsContextType {
  hasEmailPermission: boolean;
  hasSmsPermission: boolean;
  hasVoicePermission: boolean;
}

// Estado inicial
const initialSegmentPermissions: SegmentPermissionsContextType = {
  hasEmailPermission: false,
  hasSmsPermission: false,
  hasVoicePermission: false,
};

const SegmentPermissionsContext = createContext<SegmentPermissionsContextType>(
  initialSegmentPermissions,
);

export function SegmentPermissionsProvider({
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
    <SegmentPermissionsContext.Provider value={value}>
      {children}
    </SegmentPermissionsContext.Provider>
  );
}

export function useSegmentPermissions() {
  const context = useContext(SegmentPermissionsContext);
  if (context === undefined) {
    throw new Error(
      "useSegmentPermissions must be used within a SegmentPermissionsProvider",
    );
  }
  return context;
}

