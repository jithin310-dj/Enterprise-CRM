/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Lead, LeadStage } from '../types';
import {
  TrendingUp,
  Plus,
  X,
  UserCheck,
  Calendar,
  History,
  Phone,
  Mail,
  Building,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export const Leads: React.FC = () => {
  const { leads, addLead, updateLead, deleteLead, moveLeadStage, employees } = useCRM();

  // Form controls
  const [modalOpen, setModalOpen] = useState(false);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState(5000);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('');
  const [notes, setNotes] = useState('');

  const stages: LeadStage[] = ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

  const handleOpenAdd = () => {
    setName('');
    setCompany('');
    setValue(5000);
    setPhone('');
    setEmail('');
    setAssignedEmployeeId(employees[0]?.id || '');
    setNotes('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email) return;

    addLead({
      name,
      company,
      value: Number(value),
      phone,
      email,
      assignedEmployeeId,
      notes,
    });

    setModalOpen(false);
  };

  // Drag and Drop Event Handlers (Native HTML5)
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: LeadStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      moveLeadStage(id, targetStage);
    }
  };

  // Stage details calculator
  const getStageStats = (stage: LeadStage) => {
    const stageLeads = leads.filter((l) => l.stage === stage);
    const sum = stageLeads.reduce((acc, curr) => acc + curr.value, 0);
    return { count: stageLeads.length, totalValue: sum };
  };

  return (
    <div id="leads-page-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Leads Pipeline</h1>
          <p className="text-sm text-slate-500 mt-0.5">Drag and drop cards across pipeline stages to update deal cycles.</p>
        </div>

        <button
          id="add-lead-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Lead Prospect
        </button>
      </div>

      {/* Drag & Drop Instruction Box */}
      <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 flex gap-3 text-xs text-indigo-800 leading-normal font-semibold">
        <AlertCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
        <p>
          Drag any prospect card by its title and drop it inside a stage column to immediately log the activity and calculate column totals. You can also click cards to view details and history notes.
        </p>
      </div>

      {/* Kanban Board Container */}
      <div
        id="kanban-scroller"
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin select-none snap-x snap-mandatory"
      >
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          const { count, totalValue } = getStageStats(stage);

          return (
            <div
              key={stage}
              id={`kanban-column-${stage.toLowerCase().replace(/ /g, '-')}`}
              className="flex-1 min-w-[280px] max-w-[320px] bg-slate-50 border border-slate-200 rounded-2xl flex flex-col h-[65vh] snap-start"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              {/* Column Header */}
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-100/50 rounded-t-2xl shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      stage === 'Won'
                        ? 'bg-emerald-500'
                        : stage === 'Lost'
                        ? 'bg-rose-500'
                        : stage === 'Negotiation'
                        ? 'bg-amber-500'
                        : 'bg-indigo-500'
                    }`}
                  />
                  <span className="font-bold text-xs text-slate-700 font-sans">{stage}</span>
                  <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                    {count}
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold text-slate-500">
                  ${(totalValue / 1000).toFixed(1)}k
                </span>
              </div>

              {/* Column Cards Lists */}
              <div
                className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scroll-smooth"
                style={{ minHeight: '150px' }}
              >
                {stageLeads.length === 0 ? (
                  <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-[10px] text-slate-400 font-bold">
                    Drop items here
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const assignedRep = employees.find((e) => e.id === lead.assignedEmployeeId);

                    return (
                      <div
                        key={lead.id}
                        id={`lead-card-${lead.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onClick={() => setDetailLead(lead)}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                      >
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block truncate">
                          {lead.company}
                        </span>
                        <h4 className="font-sans text-xs font-bold text-slate-800 mt-1 leading-snug group-hover:text-indigo-600 truncate">
                          {lead.name}
                        </h4>

                        {/* Cost & Rep Row */}
                        <div className="flex items-center justify-between mt-3.5 border-t border-slate-100 pt-2 text-[10px]">
                          <span className="font-mono font-extrabold text-slate-600 flex items-center">
                            <DollarSign className="h-3 w-3 text-slate-400 shrink-0" />
                            {lead.value.toLocaleString()}
                          </span>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 truncate max-w-[100px]">
                            {assignedRep ? assignedRep.name.split(' ')[0] : 'Unassigned'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE LEAD MODAL */}
      {modalOpen && (
        <div id="create-lead-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-sans text-base font-bold text-slate-800">New Sales Deal Pipeline</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 focus:outline-hidden">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Prospect Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alan Turing"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Company / Agency Name</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Enigma Systems"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Estimated Deal Value ($)</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    placeholder="5000"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Assigned Sales Executive</label>
                  <select
                    value={assignedEmployeeId}
                    onChange={(e) => setAssignedEmployeeId(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.designation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-4040"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alan@enigma.com"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Lead Discovery Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Summarize demands, budget boundaries and timeline preferences"
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
                  Create Deal Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAD DETAILS & HISTORY DRAWER POPUP */}
      {detailLead && (
        <div id="lead-details-modal" className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 px-6 py-6 text-white relative">
              <button
                onClick={() => setDetailLead(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-sans tracking-tight">{detailLead.name}</h2>
                  <p className="text-xs text-slate-400 mt-1">{detailLead.company}</p>
                </div>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Email</span>
                    <span className="text-slate-700 block mt-0.5">{detailLead.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Phone</span>
                    <span className="text-slate-700 block mt-0.5">{detailLead.phone || '--'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Value</span>
                  <span className="text-sm font-mono font-black text-slate-800 block mt-1">
                    ${detailLead.value.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Representative</span>
                  <span className="font-semibold text-slate-700 block mt-1">
                    {employees.find((e) => e.id === detailLead.assignedEmployeeId)?.name || 'Unassigned'}
                  </span>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Move Pipeline Stage</label>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {stages.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        moveLeadStage(detailLead.id, st);
                        setDetailLead({ ...detailLead, stage: st });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        detailLead.stage === st
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discovery Notes */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lead Notes</span>
                <p className="text-xs text-slate-600 mt-1.5 p-3 rounded-xl border border-slate-200 bg-amber-50/10 leading-relaxed font-semibold italic">
                  {detailLead.notes || 'No discovery notes recorded.'}
                </p>
              </div>

              {/* Audit history */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lead History Logs ({detailLead.history.length})</span>
                <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50 p-3 space-y-3">
                  {detailLead.history.map((hist, i) => (
                    <div key={i} className="flex gap-2 text-[11px] leading-relaxed">
                      <History className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-700">{hist.action}</span>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mt-0.5">
                          <span>By: {hist.user}</span>
                          <span>•</span>
                          <span>{hist.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
