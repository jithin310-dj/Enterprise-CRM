/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { LineChart, BarChart } from '../components/InteractiveChart';
import {
  TrendingUp,
  DollarSign,
  FileCheck,
  FileClock,
  Users,
  Briefcase,
  Layers,
  Percent,
  Calendar,
  Video,
  Activity,
  ChevronRight,
  Clock,
  AlertCircle,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    customers,
    leads,
    invoices,
    employees,
    attendance,
    meetings,
    tasks,
    currentUser,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'hr'>('all');

  // Calculate live statistical indicators
  const todayStr = '2026-07-15';
  const monthPrefix = '2026-07';

  // 1. Today's Revenue (paid invoices dated today, or a default baseline)
  const todayInvoices = invoices.filter((inv) => inv.date === todayStr && inv.status === 'Paid');
  const todayRevenue = todayInvoices.reduce((acc, curr) => acc + curr.total, 0) || 1512; // baseline default

  // 2. Monthly Revenue (July 2026 total paid invoice amounts)
  const monthlyRevenue = invoices
    .filter((inv) => inv.date.startsWith(monthPrefix) && inv.status === 'Paid')
    .reduce((acc, curr) => acc + curr.total, 0);

  // 3. Billing ratios
  const pendingInvoices = invoices.filter((i) => i.status === 'Unpaid' || i.status === 'Overdue');
  const pendingBillsAmount = pendingInvoices.reduce((acc, curr) => acc + curr.total, 0);
  const paidBillsCount = invoices.filter((i) => i.status === 'Paid').length;

  // 4. Counts
  const totalEmployees = employees.length;
  const totalCustomers = customers.length;
  const totalLeads = leads.length;

  // 5. Attendance ratios for today (2026-07-15)
  const todayAttendance = attendance.filter((a) => a.date === todayStr);
  const presentCount = todayAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const attendancePct = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 100;

  // Custom Chart Data Series
  const salesTrendData = [
    { label: 'Jan', value: 12000 },
    { label: 'Feb', value: 15000 },
    { label: 'Mar', value: 14500 },
    { label: 'Apr', value: 22000 },
    { label: 'May', value: 19000 },
    { label: 'Jun', value: 28000 },
    { label: 'Jul', value: monthlyRevenue || 35000 },
  ];

  const monthlyBillingData = [
    { label: 'Jan', value: 8000 },
    { label: 'Feb', value: 11000 },
    { label: 'Mar', value: 15000 },
    { label: 'Apr', value: 12000 },
    { label: 'May', value: 18000 },
    { label: 'Jun', value: 24000 },
    { label: 'Jul', value: invoices.reduce((acc, c) => acc + (c.date.startsWith(monthPrefix) ? c.total : 0), 0) },
  ];

  const employeeGrowthData = [
    { label: 'Q1 25', value: 2 },
    { label: 'Q2 25', value: 3 },
    { label: 'Q3 25', value: 4 },
    { label: 'Q4 25', value: 5 },
    { label: 'Q1 26', value: 5 },
    { label: 'Q2 26', value: 6 },
  ];

  // Activities generation (merged feed)
  const activityLogs = [
    { id: 1, type: 'lead', text: 'New inbound Lead Samantha Vance added to CRM.', time: 'Today 08:30 AM', color: 'bg-indigo-50 text-indigo-600' },
    { id: 2, type: 'attendance', text: 'Meera Nair clocked in (Present).', time: 'Today 08:45 AM', color: 'bg-green-50 text-green-600' },
    { id: 3, type: 'attendance', text: 'David Foster clocked in late (Late arrival).', time: 'Today 09:35 AM', color: 'bg-amber-50 text-amber-600' },
    { id: 4, type: 'invoice', text: 'Invoice INV-2026-0001 marked as paid by Acme Corp.', time: 'Yesterday 11:15 AM', color: 'bg-emerald-50 text-emerald-600' },
    { id: 5, type: 'task', text: 'Alex Mercer completed mapping transform on Project ERP Migration.', time: 'Yesterday 04:00 PM', color: 'bg-cyan-50 text-cyan-600' },
  ];

  return (
    <div id="dashboard-page-container" className="space-y-8 animate-in fade-in duration-200">
      {/* Dynamic Header Welcomer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Welcome, {currentUser?.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enterprise overview of sales performance, operations, and staff logs.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold max-w-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            All Areas
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'sales' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Sales Metrics
          </button>
          <button
            onClick={() => setActiveTab('hr')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'hr' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            HR Portal
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div id="stats-grid" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Revenue */}
        {(activeTab === 'all' || activeTab === 'sales') && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Revenue</span>
              <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1">
                ${todayRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold mt-0.5 inline-flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> +12% from yesterday
              </span>
            </div>
          </div>
        )}

        {/* Monthly Revenue */}
        {(activeTab === 'all' || activeTab === 'sales') && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <TrendingUp className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Monthly Revenue</span>
              <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1">
                ${monthlyRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                July 2026 Billing cycle
              </span>
            </div>
          </div>
        )}

        {/* Pending Bills */}
        {(activeTab === 'all' || activeTab === 'sales') && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FileClock className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Bills</span>
              <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1">
                ${pendingBillsAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-rose-500 font-bold block mt-0.5">
                {pendingInvoices.length} invoices unpaid
              </span>
            </div>
          </div>
        )}

        {/* Paid Bills count */}
        {(activeTab === 'all' || activeTab === 'sales') && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <FileCheck className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Paid Invoices</span>
              <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1">
                {paidBillsCount}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                100% remittance rate
              </span>
            </div>
          </div>
        )}

        {/* Total Customers */}
        {(activeTab === 'all' || activeTab === 'sales') && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Accounts</span>
              <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1">
                {totalCustomers}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                +1 prospect added today
              </span>
            </div>
          </div>
        )}

        {/* Total Leads */}
        {(activeTab === 'all' || activeTab === 'sales') && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600">
              <Briefcase className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Leads</span>
              <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1">
                {totalLeads}
              </span>
              <span className="text-[10px] text-fuchsia-600 font-bold block mt-0.5">
                Valued: ${(leads.reduce((a,c) => a + c.value, 0) / 1000).toFixed(0)}k total
              </span>
            </div>
          </div>
        )}

        {/* Total Employees */}
        {(activeTab === 'all' || activeTab === 'hr') && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Layers className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Company Staff</span>
              <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1">
                {totalEmployees}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Across 4 departments
              </span>
            </div>
          </div>
        )}

        {/* Attendance Percentage */}
        {(activeTab === 'all' || activeTab === 'hr') && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Percent className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
              <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1">
                {attendancePct}%
              </span>
              <span className="text-[10px] text-violet-600 font-bold block mt-0.5">
                {presentCount} clocked in today
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Trend Line Chart */}
        {(activeTab === 'all' || activeTab === 'sales') && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-sans text-base font-bold text-slate-800">Sales Analytics Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Gross monthly deals processed in USD</p>
              </div>
              <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                Annual View
              </span>
            </div>
            <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-xl">
              <LineChart data={salesTrendData} />
            </div>
          </div>
        )}

        {/* Monthly Billing Bar Chart */}
        {(activeTab === 'all' || activeTab === 'sales') && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-sans text-base font-bold text-slate-800">Monthly Billing Invoiced</h3>
                <p className="text-xs text-slate-400 mt-0.5">Aggregate values representing invoiced orders</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                July Aggregates
              </span>
            </div>
            <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-xl">
              <BarChart data={monthlyBillingData} color="#4f46e5" />
            </div>
          </div>
        )}

        {/* Staff Growth metrics */}
        {activeTab === 'hr' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-sans text-base font-bold text-slate-800">Company Headcount Growth</h3>
                <p className="text-xs text-slate-400 mt-0.5">Accumulated full-time staff listings by quarter</p>
              </div>
            </div>
            <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-xl">
              <BarChart data={employeeGrowthData} color="#06b6d4" />
            </div>
          </div>
        )}
      </div>

      {/* Meetings, Tasks, and Activities Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Calendar & Meetings column */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <h3 className="font-sans text-base font-bold text-slate-800">Corporate Calendars & Upcoming</h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
              July 2026
            </span>
          </div>

          {/* Simple July 2026 Interactive Calendar view */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs border border-slate-100 p-3 rounded-xl bg-slate-50/50">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <span key={i} className="font-bold text-slate-400 pb-2">{day}</span>
            ))}
            {/* Pad July 2026 (Starts on Wednesday) */}
            <span className="text-slate-300 py-1.5 font-medium">28</span>
            <span className="text-slate-300 py-1.5 font-medium">29</span>
            <span className="text-slate-300 py-1.5 font-medium">30</span>
            {[...Array(31)].map((_, i) => {
              const dayNum = i + 1;
              const isToday = dayNum === 15;
              const hasMeeting = dayNum === 15 || dayNum === 16 || dayNum === 18;

              return (
                <button
                  key={i}
                  className={`relative py-1.5 font-semibold rounded-lg hover:bg-indigo-50 focus:outline-hidden ${
                    isToday ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700'
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasMeeting && (
                    <span
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${
                        isToday ? 'bg-white' : 'bg-indigo-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Upcoming Meetings List */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled events</h4>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
              {meetings.slice(0, 3).map((meet) => (
                <div key={meet.id} className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Video className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{meet.title}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">{meet.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-400">
                          <Clock className="h-3 w-3" /> {meet.time} ({meet.duration} mins)
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[9px] text-indigo-600 font-bold">
                          {meet.participants.length} attending
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Activities Column */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <h3 className="font-sans text-base font-bold text-slate-800">Latest Activities</h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-110">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${log.color}`}>
                  <Activity className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-700 leading-normal">{log.text}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{log.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Core System Alerts or Warnings */}
          <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-3 flex gap-2.5">
            <AlertCircle className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-indigo-800 leading-relaxed font-semibold">
              GST Calculation is running under standard tax brackets (18%). You can alter default rates and prefixes in Company Settings at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
