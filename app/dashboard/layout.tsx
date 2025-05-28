"use server";

import React from "react";
import Navbar from "@/components/dashboardComponents/Navbar";
import Sidebar from "@/components/dashboardComponents/Sidebar";
import { SidebarProvider } from "@/components/context/SidebarContext";
import { SegmentPermissionsProvider } from "@/app/dashboard/contactos/contexts/SegmentPermissionsContext";
import { Actions, Resources } from "@/app/data/utils";
import { testPolicy } from "@/app/data/policies";
import { CampaignPermissionsProvider } from "@/app/dashboard/campanias/contexts/CampaignPermissionsContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasEmailPermissionCampaign = await testPolicy(Actions.Write, [
    Resources.CampaignsEmailCampaign,
  ]);
  const hasSmsPermissionCampaign = await testPolicy(Actions.Write, [
    Resources.CampaignsSmsCampaign,
  ]);
  const hasVoicePermissionCampaign = await testPolicy(Actions.Write, [
    Resources.CampaignsVoiceCampaign,
  ]);
  const hasEmailPermissionSegment = await testPolicy(Actions.Write, [
    Resources.CampaignsEmailSegment,
  ]);
  const hasSmsPermissionSegment = await testPolicy(Actions.Write, [
    Resources.CampaignsSmsSegment,
  ]);
  const hasVoicePermissionSegment = await testPolicy(Actions.Write, [
    Resources.CampaignsVoiceSegment,
  ]);

  return (
    <CampaignPermissionsProvider
      hasEmailPermission={hasEmailPermissionCampaign}
      hasSmsPermission={hasSmsPermissionCampaign}
      hasVoicePermission={hasVoicePermissionCampaign}
    >
      <SegmentPermissionsProvider
        hasEmailPermission={hasEmailPermissionSegment}
        hasSmsPermission={hasSmsPermissionSegment}
        hasVoicePermission={hasVoicePermissionSegment}
      >
        <SidebarProvider>
          <div className="h-full w-full flex flex-col overflow-hidden bg-gray-100">
            <Sidebar />
            <div className="md:pl-64 flex flex-col flex-1 h-full overflow-hidden">
              <Navbar />
              <main className="h-full pb-14">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </SegmentPermissionsProvider>
    </CampaignPermissionsProvider>
  );
}
