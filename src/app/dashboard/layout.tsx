import React from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-blue-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-start">
        {children}
      </main>
    </div>
  );
}
