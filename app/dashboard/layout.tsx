"use server";

import React from "react";
import Navbar from "@/components/dashboardComponents/Navbar";
import Sidebar from "@/components/dashboardComponents/Sidebar";
import { SidebarProvider } from "@/components/context/SidebarContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="h-full w-full flex flex-col overflow-hidden bg-gray-100">
        <Sidebar />
        <div className="md:pl-64 flex flex-col flex-1 h-full overflow-hidden">
          <Navbar />
          <main className="h-full pb-14">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
