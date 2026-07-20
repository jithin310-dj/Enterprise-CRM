/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useCRM } from '../context/CRMContext';
import { Employee, Payslip } from '../types';
import {
  DollarSign,
  Download,
  Printer,
  FileSpreadsheet,
  X,
  CreditCard,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export const Payroll: React.FC = () => {
  const { employees } = useCRM();
  
  const [payslips, setPayslips] = useState<Payslip[]>(() => {
    const saved = localStorage.getItem('crm_payslips');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('crm_payslips', JSON.stringify(payslips));
  }, [payslips]);

  const addPayslip = (payload: Omit<Payslip, 'id'>) => {
    const newSlip = { ...payload, id: `slip_${Date.now()}` };
    setPayslips((prev) => [newSlip, ...prev]);
  };

  const [activeTab, setActiveTab] = useState<'payroll' | 'history'>('payroll');
  const [detailSlip, setDetailSlip] = useState<Payslip | null>(null);

  // Quick KPIs
  const totalMonthlyPayroll = employees.reduce((acc, curr) => acc + curr.salary / 12, 0);

  const handleGeneratePayslip = (emp: Employee) => {
    // Basic calculation parameters
    const grossMonthly = Math.round(emp.salary / 12);
    const allowanceHRA = Math.round(grossMonthly * 0.4); // 40% House Rent Allowance
    const allowanceSpecial = Math.round(grossMonthly * 0.1); // 10% special allowance
    const deductionPF = Math.round(grossMonthly * 0.12); // 12% Provident Fund
    const deductionTax = Math.round(grossMonthly * 0.05); // 5% Professional Tax/TDS

    const netSalary = grossMonthly + allowanceHRA + allowanceSpecial - deductionPF - deductionTax;

    const payload = {
      employeeId: emp.id,
      employeeName: emp.name,
      month: 'July 2026',
      basicSalary: grossMonthly,
      allowance: allowanceHRA + allowanceSpecial,
      deduction: deductionPF + deductionTax,
      netSalary,
      status: 'Paid' as const,
    };

    addPayslip(payload);
    alert(`Success: Compiled & posted July 2026 salary slip ledger for ${emp.name} (Net: $${netSalary.toLocaleString()}).`);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div id="payroll-page-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Payroll Administration</h1>
          <p className="text-sm text-slate-500 mt-0.5">Disburse salaries, calculate deductions, allowances, and compile printable payslips.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold max-w-xs self-start sm:self-center shrink-0">
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${activeTab === 'payroll' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Staff Salaries
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Payslip History ({payslips.length})
          </button>
        </div>
      </div>

      {/* KPI block - Hidden during prints */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 print:hidden">
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Monthly Payroll Expense</span>
            <span className="text-lg font-mono font-extrabold text-slate-800 block mt-1">
              ${Math.round(totalMonthlyPayroll).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CreditCard className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Scheduled Payout</span>
            <span className="text-lg font-sans font-bold text-slate-800 block mt-1">
              July 31, 2026
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <UserCheck className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Disbursement Status</span>
            <span className="text-lg font-mono font-extrabold text-slate-800 block mt-1">
              {payslips.length} / {employees.length} Processed
            </span>
          </div>
        </div>
      </div>

      {activeTab === 'payroll' ? (
        /* SALARY MANAGEMENT SECTION */
        <div className="border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden print:hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Staff Salary structure</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Base CTC Annual</th>
                  <th className="px-6 py-4">Est. Gross Monthly</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {employees.map((emp) => {
                  const alreadyGenerated = payslips.some((p) => p.employeeId === emp.id && p.month === 'July 2026');

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4.5">
                        <div className="font-bold text-slate-800">{emp.name}</div>
                        <span className="text-xs text-slate-400 font-medium">{emp.designation}</span>
                      </td>

                      <td className="px-6 py-4.5 text-xs text-slate-500">{emp.department}</td>

                      <td className="px-6 py-4.5 font-mono text-slate-800">${emp.salary.toLocaleString()}</td>

                      <td className="px-6 py-4.5 font-mono text-slate-800">${Math.round(emp.salary / 12).toLocaleString()}</td>

                      <td className="px-6 py-4.5 text-right">
                        {alreadyGenerated ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="h-4 w-4" /> Disbursed
                          </span>
                        ) : (
                          <button
                            id={`generate-payslip-${emp.id}`}
                            onClick={() => handleGeneratePayslip(emp)}
                            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-xs"
                          >
                            Generate July Slip
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* HISTORIC PAYSLIPS LIST */
        <div className="border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden print:hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payslip history registry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Payment Month</th>
                  <th className="px-6 py-4">Gross Basic</th>
                  <th className="px-6 py-4">Total Allowances</th>
                  <th className="px-6 py-4">Net Payout</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {payslips.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No payslips generated for this cycle yet.
                    </td>
                  </tr>
                ) : (
                  payslips.map((slip) => (
                    <tr key={slip.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4.5 font-bold text-slate-800">{slip.employeeName}</td>
                      <td className="px-6 py-4.5 text-slate-400">{slip.month}</td>
                      <td className="px-6 py-4.5 font-mono text-slate-500">${slip.basicSalary.toLocaleString()}</td>
                      <td className="px-6 py-4.5 font-mono text-emerald-600">+${slip.allowance.toLocaleString()}</td>
                      <td className="px-6 py-4.5 font-mono text-indigo-600 font-bold">${slip.netSalary.toLocaleString()}</td>
                      <td className="px-6 py-4.5 text-right">
                        <button
                          id={`view-payslip-${slip.id}`}
                          onClick={() => setDetailSlip(slip)}
                          className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-bold"
                        >
                          View Payslip
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL PAYSLIP VIEW MODAL */}
      {detailSlip && (
        <div id="payslip-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 print:relative print:bg-transparent print:p-0">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 print:border-none print:shadow-none">
            {/* Header - Hidden during prints */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 print:hidden">
              <h3 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider">Salary Statement</h3>
              <div className="flex items-center gap-2">
                <button
                  id="print-payslip-btn"
                  onClick={handlePrintSlip}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center gap-1.5 text-xs font-bold"
                >
                  <Printer className="h-4 w-4" /> Print Statement
                </button>
                <button onClick={() => setDetailSlip(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Print Envelope Frame */}
            <div className="p-8 space-y-6">
              <div className="flex justify-between border-b border-slate-200 pb-5">
                <div>
                  <h2 className="text-base font-black tracking-tight text-slate-800">Enterprise CRM Inc.</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">Corporate Human Resource Department</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xs text-indigo-600 uppercase tracking-wider block">Payslip Statement</span>
                  <span className="font-mono text-xs font-semibold text-slate-500 mt-1 block">{detailSlip.month}</span>
                </div>
              </div>

              {/* Employee Parameters Block */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block tracking-wider font-bold">Employee Name</span>
                  <span className="text-slate-700 block mt-0.5">{detailSlip.employeeName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block tracking-wider font-bold">Disbursement ID</span>
                  <span className="font-mono text-slate-600 block mt-0.5">{detailSlip.id}</span>
                </div>
              </div>

              {/* Structured Grid: Earnings vs Deductions */}
              <div className="grid grid-cols-2 gap-6 border-t border-slate-200 pt-5 text-xs">
                {/* Earnings */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-1.5">Earnings</h4>
                  <div className="space-y-1.5 font-medium text-slate-600">
                    <div className="flex justify-between">
                      <span>Basic Monthly:</span>
                      <span className="font-mono">${detailSlip.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Allowances (HRA + Special):</span>
                      <span className="font-mono">+${detailSlip.allowance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-1.5">Deductions</h4>
                  <div className="space-y-1.5 font-medium text-slate-600">
                    <div className="flex justify-between text-rose-500">
                      <span>Aggregate Deductions (PF + TDS):</span>
                      <span className="font-mono">-${detailSlip.deduction.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary net payout block */}
              <div className="border-t border-slate-200 pt-5 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500">Disbursed net salary:</span>
                <span className="font-mono text-base font-black text-indigo-700 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-150">
                  ${detailSlip.netSalary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
