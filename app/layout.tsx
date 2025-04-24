import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TemplateProvider } from "@/components/context/TemplateContext";
import { CampaignProvider } from "@/components/context/CampaignContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Campañas",
  description: "Sistema de Gestión de Campañas y Contactos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full overflow-hidden">
        <CampaignProvider>
          <TemplateProvider>
            {children}
          </TemplateProvider>
        </CampaignProvider>
      </body>
    </html>
  );
}
