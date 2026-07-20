/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCRM } from '../context/CRMContext';
import { BarChart, LineChart } from '../components/InteractiveChart';
import {
  FileText,
  Printer,
  TrendingUp,
  Percent,
  Coins,
  ShieldAlert,
  Award,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { leads, invoices, employees, customers } = useCRM();

  // 1. LEAD CONVERSION PERFORMANCE
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.stage === 'Won').length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  // 2. BILLING ANALYTICS AGGREGATES
  const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.total, 0);
  const totalPaid = invoices.filter((i) => i.status === 'Paid').reduce((acc, curr) => acc + curr.total, 0);
  const totalOutstanding = invoices.filter((i) => i.status === 'Unpaid' || i.status === 'Overdue').reduce((acc, curr) => acc + curr.total, 0);

  // 3. EXECUTIVE ASSIGNMENT PERFORMANCE
  const executivePerformance = employees
    .filter((emp) => emp.role === 'Sales Executive' || emp.role === 'Sales Manager')
    .map((emp) => {
      const empLeads = leads.filter((l) => l.assignedEmployeeId === emp.id);
      const wonValue = empLeads.filter((l) => l.stage === 'Won').reduce((a, c) => a + c.value, 0);
      const totalVal = empLeads.reduce((a, c) => a + c.value, 0);
      return {
        name: emp.name,
        totalLeadsAssigned: empLeads.length,
        pipelineValue: totalVal,
        wonRevenue: wonValue,
      };
    });

  // Chart structures
  const funnelChartData = [
    { label: 'New', value: leads.filter((l) => l.stage === 'New').length },
    { label: 'Contacted', value: leads.filter((l) => l.stage === 'Contacted').length },
    { label: 'Proposal', value: leads.filter((l) => l.stage === 'Proposal Sent').length },
    { label: 'Negotiation', value: leads.filter((l) => l.stage === 'Negotiation').length },
    { label: 'Won', value: wonLeads },
  ];

  const billingBreakdownData = [
    { label: 'Total Billed', value: totalInvoiced },
    { label: 'Collected', value: totalPaid },
    { label: 'Receivables', value: totalOutstanding },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reports-page-container" className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Enterprise Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">Corporate business audits, financial collection audits, and team benchmarks.</p>
        </div>

        <button
          id="print-report-btn"
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
        >
          <Printer className="h-4 w-4" /> Print Business Audit
        </button>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Deal Conversion Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Percent className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Conversion Success Rate</span>
            <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1">
              {conversionRate}%
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              {wonLeads} out of {totalLeads} Won
            </span>
          </div>
        </div>

        {/* Collections index */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Coins className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Realized Collections</span>
            <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1">
              ${totalPaid.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
              Out of ${totalInvoiced.toLocaleString()} billed
            </span>
          </div>
        </div>

        {/* Risk Outstanding */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <ShieldAlert className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Uncollected Receivables</span>
            <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1">
              ${totalOutstanding.toLocaleString()}
            </span>
            <span className="text-[10px] text-rose-500 font-bold block mt-0.5">
              Outstanding debt pipeline
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Deal pipeline distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-sans text-base font-bold text-slate-800">Pipeline Deal Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Number of active deal listings currently in each pipeline phase</p>
          </div>
          <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-xl">
            <BarChart data={funnelChartData} color="#6366f1" />
          </div>
        </div>

        {/* Collections chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-sans text-base font-bold text-slate-800">Billing Collection Parameters</h3>
            <p className="text-xs text-slate-400 mt-0.5">Comparative chart of totals, collection benchmarks, and overdue balances</p>
          </div>
          <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-xl">
            <BarChart data={billingBreakdownData} color="#10b981" />
          </div>
        </div>
      </div>

      {/* Staff Representative Performances */}
      <div className="border border-slate-200 bg-white rounded-2xl shadow-xs p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-sans text-sm font-bold text-slate-800 flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-amber-500" /> Sales Representative Performance Index
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Executive Rep</th>
                <th className="px-5 py-3.5">Assigned Deals Count</th>
                <th className="px-5 py-3.5">Assigned Pipeline Value</th>
                <th className="px-5 py-3.5">Realized Won Revenue</th>
                <th className="px-5 py-3.5 text-right">Yield Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {executivePerformance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No active sales representatives mapped on system database.
                  </td>
                </tr>
              ) : (
                executivePerformance.map((exec, idx) => {
                  const yieldPct = exec.pipelineValue > 0 ? Math.round((exec.wonRevenue / exec.pipelineValue) * 100) : 0;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4 font-bold text-slate-800">{exec.name}</td>
                      <td className="px-5 py-4 font-mono text-slate-500">{exec.totalLeadsAssigned} deals</td>
                      <td className="px-5 py-4 font-mono text-slate-600">${exec.pipelineValue.toLocaleString()}</td>
                      <td className="px-5 py-4 font-mono text-emerald-600">${exec.wonRevenue.toLocaleString()}</td>
                      <td className="px-5 py-4 text-right">
                        <span
                          className={`inline-flex rounded-lg px-2.5 py-1 text-[10px] font-bold border ${
                            yieldPct >= 50
                              ? 'bg-green-50 border-green-100 text-green-700'
                              : yieldPct >= 20
                              ? 'bg-indigo-50 border-indigo-100 text-indigo-700'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          {yieldPct}% Yield
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
