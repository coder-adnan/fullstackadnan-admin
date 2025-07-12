"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      }
    }
  }, [router]);

  // Logout functionality moved to Sidebar component

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Welcome to the Portfolio Admin Dashboard
        </h1>
      </div>
      <div className="text-gray-600 text-lg">
        Select a section from the sidebar to get started.
      </div>
    </div>
  );
}
