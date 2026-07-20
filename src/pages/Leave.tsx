/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { LeaveRequest } from '../types';
import {
  CalendarDays,
  Plus,
  X,
  Check,
  Ban,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const Leave: React.FC = () => {
  const { leaves, addLeave, updateLeave, deleteLeave, currentUser, employees } = useCRM();

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);

  // Form Fields
  const [type, setType] = useState<LeaveRequest['type']>('Casual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const isHR = currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin' || currentUser?.role === 'HR';

  const handleOpenAdd = () => {
    setType('Casual');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setReason('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !reason) return;

    addLeave({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      type,
      startDate,
      endDate,
      reason,
      status: 'Pending',
    });

    setModalOpen(false);
  };

  const handleApprove = (id: string) => {
    updateLeave(id, { status: 'Approved' });
  };

  const handleReject = (id: string) => {
    updateLeave(id, { status: 'Rejected' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this leave application request?')) {
      deleteLeave(id);
    }
  };

  // Calculate dynamic balances for current logged in user
  // Base constants: Sick=12, Casual=8, Earned=15
  const userApprovedLeaves = leaves.filter((l) => l.employeeId === currentUser?.id && l.status === 'Approved');

  const sickTaken = userApprovedLeaves.filter((l) => l.type === 'Sick').length * 2 || 1; // simulation: estimate 2 days per approved entry
  const casualTaken = userApprovedLeaves.filter((l) => l.type === 'Casual').length * 2 || 2;
  const earnedTaken = userApprovedLeaves.filter((l) => l.type === 'Earned').length * 2 || 0;

  const balances = {
    Sick: Math.max(0, 12 - sickTaken),
    Casual: Math.max(0, 8 - casualTaken),
    Earned: Math.max(0, 15 - earnedTaken),
  };

  // Filter lists based on role
  // Normal employee: only see their own requests.
  // HR/Admin: see all corporate leave requests.
  const displayLeaves = leaves.filter((l) => isHR || l.employeeId === currentUser?.id);

  return (
    <div id="leave-page-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Leave Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">Apply for paid/sick leaves and audit corporate leave requests.</p>
        </div>

        <button
          id="apply-leave-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" /> Apply Leave
        </button>
      </div>

      {/* Leave Balance Indicators */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Sick Leave Remaining</span>
            <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1.5">{balances.Sick} / 12 Days</span>
          </div>
          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">Sick</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Casual Leave Remaining</span>
            <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1.5">{balances.Casual} / 8 Days</span>
          </div>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">Casual</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Earned Leave Remaining</span>
            <span className="text-xl font-mono font-extrabold text-slate-800 block mt-1.5">{balances.Earned} / 15 Days</span>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Earned</span>
        </div>
      </div>

      {/* Main Leave Logs Workspace */}
      <div className="border border-slate-200 bg-white rounded-2xl shadow-xs p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-sans text-sm font-bold text-slate-800">
            {isHR ? 'Corporate Leave Requests Queue' : 'My Personal Requests History'}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Leave Category</th>
                <th className="px-5 py-3">Date span</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status Badge</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {displayLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No leave requests on record.
                  </td>
                </tr>
              ) : (
                displayLeaves.map((request) => (
                  <tr key={request.id} id={`leave-row-${request.id}`} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4 font-bold text-slate-800">{request.employeeName}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                          request.type === 'Sick'
                            ? 'bg-rose-50 border-rose-100 text-rose-700'
                            : request.type === 'Casual'
                            ? 'bg-amber-50 border-amber-100 text-amber-700'
                            : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        }`}
                      >
                        {request.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {request.startDate} to {request.endDate}
                    </td>
                    <td className="px-5 py-4 text-slate-400 max-w-xs truncate" title={request.reason}>
                      {request.reason}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                          request.status === 'Approved'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : request.status === 'Rejected'
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {isHR && request.status === 'Pending' ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            id={`approve-leave-${request.id}`}
                            onClick={() => handleApprove(request.id)}
                            className="p-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            title="Approve Leave"
                          >
                            <Check className="h-4.5 w-4.5" />
                          </button>
                          <button
                            id={`reject-leave-${request.id}`}
                            onClick={() => handleReject(request.id)}
                            className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Reject Leave"
                          >
                            <Ban className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ) : !isHR && request.status === 'Pending' ? (
                        <button
                          id={`delete-leave-${request.id}`}
                          onClick={() => handleDelete(request.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 hover:bg-slate-50 rounded-lg"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave request form modal */}
      {modalOpen && (
        <div id="leave-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-sans text-base font-bold text-slate-800">Apply Time Off Request</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 focus:outline-hidden">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Leave category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Casual">Casual Leave (Paid)</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Earned">Earned Corporate Privilege Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Reason / Description</label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State your reason clearly for rapid approval"
                  rows={3}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 focus:outline-hidden"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs focus:outline-hidden"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
