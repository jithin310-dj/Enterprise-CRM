/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Candidate, Meeting } from '../types';
import {
  Briefcase,
  Users,
  Plus,
  Calendar,
  Check,
  X,
  Mail,
  Phone,
  Video,
  FileText,
  Clock,
} from 'lucide-react';

export const Recruitment: React.FC = () => {
  const { candidates, addCandidate, updateCandidate, deleteCandidate, addMeeting } = useCRM();

  const [activeTab, setActiveTab] = useState<'candidates' | 'openings'>('candidates');

  // Form controls
  const [modalOpen, setModalOpen] = useState(false);
  const [interviewModalCandidate, setInterviewModalCandidate] = useState<Candidate | null>(null);

  // Candidate creation fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [appliedRole, setAppliedRole] = useState('Senior Frontend Developer');
  const [notes, setNotes] = useState('');

  // Interview scheduling fields
  const [interviewDate, setInterviewDate] = useState('2026-07-20');
  const [interviewTime, setInterviewTime] = useState('11:00 AM');

  // Static Jobs Database
  const jobOpenings = [
    { id: '1', title: 'Senior React Architect', department: 'Engineering', status: 'Active', positions: 2 },
    { id: '2', title: 'Sales Account Executive', department: 'Sales', status: 'Active', positions: 3 },
    { id: '3', title: 'HR Associate Lead', department: 'HR', status: 'Active', positions: 1 },
    { id: '4', title: 'Senior Finance Accountant', department: 'Finance', status: 'Closed', positions: 0 },
  ];

  const handleOpenAdd = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAppliedRole('Senior Frontend Developer');
    setNotes('');
    setModalOpen(true);
  };

  const handleSaveCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addCandidate({
      name,
      email,
      phone,
      appliedRole,
      status: 'Applied',
      notes,
    });

    setModalOpen(false);
  };

  const handleUpdateStatus = (id: string, status: Candidate['status']) => {
    updateCandidate(id, { status });
  };

  const handleOpenScheduleInterview = (cand: Candidate) => {
    setInterviewModalCandidate(cand);
  };

  const handleSaveInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewModalCandidate) return;

    // 1. Add interactive meeting to cross-module calendar context
    addMeeting({
      title: `Interview: ${interviewModalCandidate.name} for ${interviewModalCandidate.appliedRole}`,
      description: `Technical Evaluation Screen. Resume notes: ${interviewModalCandidate.notes}`,
      date: interviewDate,
      time: interviewTime,
      duration: 45,
      participants: [interviewModalCandidate.name, 'HR Lead', 'Engineering Manager'],
    });

    // 2. Update status of candidate to Scheduled
    updateCandidate(interviewModalCandidate.id, { status: 'Interview' });
    setInterviewModalCandidate(null);
    alert(`Success: Scheduled Zoom Interview with ${interviewModalCandidate.name} on ${interviewDate} at ${interviewTime}. Added to Meetings Calendar.`);
  };

  return (
    <div id="recruitment-page-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Talent Acquisition</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage job openings, review candidate resumes, and coordinate calendar screenings.</p>
        </div>

        {/* Action Toggle Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-center shrink-0">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${activeTab === 'candidates' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Candidates Pool
          </button>
          <button
            onClick={() => setActiveTab('openings')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${activeTab === 'openings' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Job Board listings
          </button>
        </div>
      </div>

      {activeTab === 'candidates' ? (
        /* CANDIDATES DIRECTORY POOL */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-sans text-sm font-bold text-slate-800">Review Candidate Pipelines</h3>
            <button
              id="add-candidate-btn"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Plus className="h-4 w-4" /> Add Candidate
            </button>
          </div>

          {/* Grid Layout of Candidate Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                id={`candidate-card-${cand.id}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Status Banner Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                      {cand.appliedRole}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                        cand.status === 'Selected'
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : cand.status === 'Rejected'
                          ? 'bg-rose-50 border-rose-200 text-rose-700'
                          : cand.status === 'Interview'
                          ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}
                    >
                      {cand.status}
                    </span>
                  </div>

                  {/* Profile info */}
                  <div>
                    <h4 className="font-sans text-sm font-bold text-slate-800">{cand.name}</h4>
                    <div className="space-y-1 mt-2.5 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{cand.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{cand.phone || '--'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Resume logs */}
                  <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-3 text-xs leading-relaxed italic text-slate-500">
                    "{cand.notes || 'No review notes written.'}"
                  </div>
                </div>

                {/* Coordination buttons */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-1.5 text-[11px] font-bold">
                  {cand.status === 'Applied' && (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        id={`schedule-interview-${cand.id}`}
                        onClick={() => handleOpenScheduleInterview(cand)}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-1.5 text-slate-600 hover:bg-slate-50"
                      >
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" /> Schedule screen
                      </button>
                      <button
                        id={`reject-candidate-${cand.id}`}
                        onClick={() => handleUpdateStatus(cand.id, 'Rejected')}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Reject Candidate"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {cand.status === 'Interview' && (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        id={`select-candidate-${cand.id}`}
                        onClick={() => handleUpdateStatus(cand.id, 'Selected')}
                        className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-green-600 text-white py-1.5 hover:bg-green-700"
                      >
                        <Check className="h-3.5 w-3.5" /> Select hire
                      </button>
                      <button
                        id={`reject-candidate-int-${cand.id}`}
                        onClick={() => handleUpdateStatus(cand.id, 'Rejected')}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Reject Candidate"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {(cand.status === 'Selected' || cand.status === 'Rejected') && (
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider text-center w-full">
                      Decision Processed ({cand.status})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* JOB OPENINGS LIST */
        <div className="border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Openings Board</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Job Opening Role</th>
                  <th className="px-6 py-4">Department Division</th>
                  <th className="px-6 py-4">Target Positions</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {jobOpenings.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4.5 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200">
                        <Briefcase className="h-4.5 w-4.5" />
                      </div>
                      <span className="font-bold text-slate-800 block">{job.title}</span>
                    </td>
                    <td className="px-6 py-4.5 text-xs text-slate-500">{job.department}</td>
                    <td className="px-6 py-4.5 font-mono text-slate-800">{job.positions} Openings</td>
                    <td className="px-6 py-4.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                          job.status === 'Active'
                            ? 'bg-green-50 border-green-100 text-green-700'
                            : 'bg-slate-100 border-slate-250 text-slate-500'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW CANDIDATE APPLICATION MODAL */}
      {modalOpen && (
        <div id="candidate-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-sans text-base font-bold text-slate-800">Add Applicant Profile</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 focus:outline-hidden">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCandidate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rachel Green"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rachel@email.com"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-9090"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Target Role Applied</label>
                <select
                  value={appliedRole}
                  onChange={(e) => setAppliedRole(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Senior Frontend Developer">Senior Frontend Developer</option>
                  <option value="Senior React Architect">Senior React Architect</option>
                  <option value="Sales Account Executive">Sales Account Executive</option>
                  <option value="HR Associate Lead">HR Associate Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Initial Screening Summary / Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Summarize key details from resume, background check or certifications..."
                  rows={3}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs focus:outline-hidden"
                >
                  Post Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {interviewModalCandidate && (
        <div id="interview-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-sans text-sm font-bold text-slate-800">Schedule Interview Screen</h3>
              <button onClick={() => setInterviewModalCandidate(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInterview} className="p-6 space-y-4 text-xs font-semibold">
              <div className="rounded-lg bg-slate-50 border border-slate-150 p-3 flex gap-2">
                <Video className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 block">{interviewModalCandidate.name}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{interviewModalCandidate.appliedRole}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Meeting Date</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Meeting Time</label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="e.g. 02:30 PM"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 mt-2">
                <button
                  type="button"
                  onClick={() => setInterviewModalCandidate(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs text-white hover:bg-indigo-700 shadow-xs"
                >
                  Confirm & Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
