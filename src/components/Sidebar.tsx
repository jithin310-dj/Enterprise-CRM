/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Package,
  FileSpreadsheet,
  FolderLock,
  CalendarCheck,
  PlaneTakeoff,
  BadgeDollarSign,
  Briefcase,
  CheckSquare,
  Video,
  Settings,
  Menu,
  ChevronLeft,
  X,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

export const menuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Super Admin', 'Admin', 'HR', 'Sales Manager', 'Sales Executive', 'Employee', 'Accountant'] },
  { name: 'Customers', path: '/customers', icon: Users, roles: ['Super Admin', 'Admin', 'Sales Manager', 'Sales Executive'] },
  { name: 'Leads Pipeline', path: '/leads', icon: TrendingUp, roles: ['Super Admin', 'Admin', 'Sales Manager', 'Sales Executive'] },
  { name: 'Product Catalog', path: '/products', icon: Package, roles: ['Super Admin', 'Admin', 'Sales Manager', 'Sales Executive', 'Accountant'] },
  { name: 'Billing & Invoices', path: '/billing', icon: FileSpreadsheet, roles: ['Super Admin', 'Admin', 'Sales Manager', 'Accountant'] },
  { name: 'HR Directory', path: '/hr', icon: FolderLock, roles: ['Super Admin', 'Admin', 'HR'] },
  { name: 'My Attendance', path: '/attendance', icon: CalendarCheck, roles: ['Super Admin', 'Admin', 'HR', 'Sales Manager', 'Sales Executive', 'Employee', 'Accountant'] },
  { name: 'Leave Requests', path: '/leaves', icon: PlaneTakeoff, roles: ['Super Admin', 'Admin', 'HR', 'Sales Manager', 'Sales Executive', 'Employee', 'Accountant'] },
  { name: 'Payroll & Payslips', path: '/payroll', icon: BadgeDollarSign, roles: ['Super Admin', 'Admin', 'HR', 'Accountant'] },
  { name: 'Recruitment', path: '/recruitment', icon: Briefcase, roles: ['Super Admin', 'Admin', 'HR'] },
  { name: 'Task Board', path: '/tasks', icon: CheckSquare, roles: ['Super Admin', 'Admin', 'HR', 'Sales Manager', 'Sales Executive', 'Employee', 'Accountant'] },
  { name: 'Meetings', path: '/meetings', icon: Video, roles: ['Super Admin', 'Admin', 'HR', 'Sales Manager', 'Sales Executive', 'Employee', 'Accountant'] },
  { name: 'Company Settings', path: '/settings', icon: Settings, roles: ['Super Admin', 'Admin'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentUser, logout } = useCRM();
  const location = useLocation();

  if (!currentUser) return null;

  const filteredMenu = menuItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="sidebar-panel"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-between rounded-lg bg-indigo-600 p-2 text-white shadow-xs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-sans text-lg font-bold tracking-tight text-slate-800">
              Enterprise <span className="text-indigo-600">CRM</span>
            </span>
          </Link>

          {/* Close Sidebar Button for Mobile */}
          <button
            id="close-sidebar-btn"
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 lg:hidden hover:bg-slate-50 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Quick Info */}
        <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=6366f1&color=fff`}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden">
              <h4 className="font-sans text-sm font-semibold text-slate-800 truncate">{currentUser.name}</h4>
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 mt-0.5 border border-indigo-100">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav id="sidebar-nav" className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                id={`sidebar-link-${item.name.toLowerCase().replace(/ /g, '-')}`}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <IconComponent
                  className={`h-4.5 w-4.5 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Area with Sign Out */}
        <div className="p-4 border-t border-slate-100">
          <button
            id="sidebar-logout-btn"
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
