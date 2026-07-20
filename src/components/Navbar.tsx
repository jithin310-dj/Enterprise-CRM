/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';
import { UserRole } from '../types';
import { Menu, Bell, User, Clock, ChevronDown, Check, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setSidebarOpen }) => {
  const { currentUser, switchRole, notifications, markNotificationAsRead, clearNotifications } = useCRM();
  const location = useLocation();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  if (!currentUser) return null;

  // Breadcrumbs title mapper
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/customers') return 'Customer Directory';
    if (path === '/leads') return 'Leads Pipeline';
    if (path === '/products') return 'Product Catalog';
    if (path === '/billing') return 'Billing & Invoices';
    if (path === '/hr') return 'HR Directory';
    if (path === '/attendance') return 'Attendance Ledger';
    if (path === '/leaves') return 'Leave Requests';
    if (path === '/payroll') return 'Payroll & Payslips';
    if (path === '/recruitment') return 'Job Postings';
    if (path === '/tasks') return 'Task Kanban';
    if (path === '/meetings') return 'Meeting Manager';
    if (path === '/settings') return 'Settings';
    return 'Enterprise CRM';
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles: UserRole[] = [
    'Super Admin',
    'Admin',
    'HR',
    'Sales Manager',
    'Sales Executive',
    'Employee',
    'Accountant',
  ];

  return (
    <header id="navbar-header" className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs">
      {/* Sidebar Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          id="toggle-sidebar-mobile"
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden hover:bg-slate-50"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb Info */}
        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Enterprise CRM</span>
            <span>/</span>
            <span className="text-slate-600 font-semibold">{getPageTitle()}</span>
          </div>
        </div>
      </div>

      {/* Utilities Hub */}
      <div className="flex items-center gap-4">
        {/* Quick Role Switcher Dashboard Indicator */}
        <div className="relative">
          <button
            id="role-switcher-btn"
            onClick={() => {
              setRoleDropdownOpen(!roleDropdownOpen);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-indigo-500" />
            <span className="hidden md:inline">View as:</span>
            <span className="font-bold underline decoration-indigo-400 decoration-2">{currentUser.role}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>

          {roleDropdownOpen && (
            <div
              id="role-switcher-dropdown"
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-slate-900/5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulate Role Access</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {roles.map((r) => (
                  <button
                    key={r}
                    id={`role-option-${r.toLowerCase().replace(/ /g, '-')}`}
                    onClick={() => {
                      switchRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium transition-colors ${
                      currentUser.role === r
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{r}</span>
                    {currentUser.role === r && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Digital Clock display */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-mono">July 15, 2026</span>
        </div>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            id="notif-bell-btn"
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setRoleDropdownOpen(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span id="notif-badge" className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div
              id="notif-dropdown"
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-slate-900/5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2.5">
                <span className="text-sm font-semibold text-slate-800">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    id="clear-all-notif-btn"
                    onClick={clearNotifications}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto py-1 divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No notifications at this time
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      id={`notification-${n.id}`}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 cursor-pointer ${
                        !n.read ? 'bg-indigo-50/20' : ''
                      }`}
                      onClick={() => markNotificationAsRead(n.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                          {n.title}
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.date.split(' ')[1]}</span>
                      </div>
                      <p className="mt-1 text-slate-600 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile avatar dropdown */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <img
            src={currentUser.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=6366f1&color=fff`}
            alt={currentUser.name}
            className="h-9 w-9 rounded-full object-cover border border-slate-200"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
};
