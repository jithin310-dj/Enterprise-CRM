/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';
import { Sidebar, menuItems } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { ShieldAlert } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { currentUser } = useCRM();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Redirect to Auth if not logged in
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  // Check role permission for active path
  const currentMenuItem = menuItems.find((item) => item.path === location.pathname);
  const isAuthorized = currentMenuItem
    ? currentMenuItem.roles.includes(currentUser.role)
    : true; // fallback for unmapped subpaths

  return (
    <div id="dashboard-layout-root" className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Sidebar Panel */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navigation Control Bar */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* Scrollable Action Panel */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin">
          {isAuthorized ? (
            <Outlet />
          ) : (
            <div
              id="unauthorized-card"
              className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-md mt-16 animate-in fade-in duration-200"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <h2 className="mt-5 font-sans text-xl font-bold text-slate-800">Access Denied</h2>
              <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">
                Your currently active role (<span className="font-semibold text-indigo-600">{currentUser.role}</span>) does not have clearance to view this module.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                To test this panel, use the role switcher at the top right to select a permitted role.
              </p>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Authorized Roles for this panel:
                </span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {currentMenuItem?.roles.map((r) => (
                    <span
                      key={r}
                      className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 border border-slate-200"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
