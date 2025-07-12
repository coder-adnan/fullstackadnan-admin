"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const EMAILS_SUBMENU = [
  { label: "Create Campaign", href: "/dashboard/emails/create" },
  { label: "Send", href: "/dashboard/emails/send" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [emailsOpen, setEmailsOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-100 flex flex-col justify-between py-6 px-2 shadow-sm transition-all duration-200 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      <div>
        <button
          className="mb-8 ml-1 p-2 rounded hover:bg-blue-100 transition flex items-center justify-center"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-blue-700"
          >
            {collapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 12h16m-6-6l6 6-6 6"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4m6-6l-6 6 6 6"
              />
            )}
          </svg>
        </button>
        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard/blogs"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
              pathname.startsWith("/dashboard/blogs")
                ? "bg-blue-100 text-blue-700"
                : ""
            }`}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2 2 2h4a2 2 0 012 2v12a2 2 0 01-2 2z"
              />
            </svg>
            {!collapsed && "Blogs"}
          </Link>
          {/* Emails menu */}
          <div>
            <button
              className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full transition font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
                pathname.startsWith("/dashboard/emails")
                  ? "bg-blue-100 text-blue-700"
                  : ""
              }`}
              onClick={() => setEmailsOpen((o) => !o)}
              aria-expanded={emailsOpen}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {!collapsed && "Emails"}
              {!collapsed && (
                <svg
                  className={`ml-auto transition-transform ${
                    emailsOpen ? "rotate-90" : ""
                  }`}
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
            {!collapsed && emailsOpen && (
              <div className="ml-8 flex flex-col gap-1 mt-1">
                {EMAILS_SUBMENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2 py-1 rounded text-sm transition font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 ${
                      pathname === item.href ? "bg-blue-100 text-blue-700" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-1 px-2 py-3 mt-8 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-blue-700">
              A
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-semibold text-blue-700 text-sm">
                Admin User
              </span>
              <span className="text-xs text-gray-500">Super Admin</span>
            </div>
            <button
              className="p-2 rounded-full hover:bg-blue-100 transition flex items-center justify-center"
              onClick={() => setShowLogout((prev) => !prev)}
              aria-label="Toggle logout menu"
            >
              {/* 3-dots vertical icon */}
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
          </div>
          {showLogout && (
            <button
              className="mt-2 cursor-pointer bg-red-600 text-white rounded px-4 py-2 font-semibold hover:bg-red-700 transition"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                if (router) router.push("/login");
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
