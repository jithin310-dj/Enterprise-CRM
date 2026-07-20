/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Meeting } from '../types';
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  X,
  ExternalLink,
  Trash2,
  AlertCircle,
} from 'lucide-react';

export const Meetings: React.FC = () => {
  const { meetings, addMeeting, deleteMeeting } = useCRM();

  // Form controls
  const [modalOpen, setModalOpen] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-07-15');
  const [time, setTime] = useState('10:00 AM');
  const [duration, setDuration] = useState(30);
  const [participantInput, setParticipantInput] = useState('');
  const [meetLink, setMeetLink] = useState('');

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setDate('2026-07-15');
    setTime('10:00 AM');
    setDuration(30);
    setParticipantInput('');

    // Pre-seed a beautiful simulated Google Meet code!
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const genPart = (len: number) => Array.from({ length: len }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    setMeetLink(`https://meet.google.com/${genPart(3)}-${genPart(4)}-${genPart(3)}`);

    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    // Compile participants from comma delimited input
    const participantsList = participantInput
      ? participantInput.split(',').map((x) => x.trim()).filter(Boolean)
      : ['Product Lead', 'Core Team'];

    addMeeting({
      title,
      description,
      date,
      time,
      duration: Number(duration),
      participants: participantsList,
      link: meetLink,
    });

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Cancel this scheduled corporate event? Invitees will receive email warnings.')) {
      deleteMeeting(id);
    }
  };

  return (
    <div id="meetings-page-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Meeting Schedules</h1>
          <p className="text-sm text-slate-500 mt-0.5">Organize video screenings, standups, or investor boards with virtual room coordinates.</p>
        </div>

        <button
          id="add-meeting-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" /> Schedule Conference
        </button>
      </div>

      {/* Grid List of Meetings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {meetings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 col-span-full">
            No meetings scheduled on active calendars. Click "Schedule Conference" to register one!
          </div>
        ) : (
          meetings.map((meet) => (
            <div
              key={meet.id}
              id={`meeting-card-${meet.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                {/* Header title */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Video className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-sans text-xs font-bold text-slate-800 leading-snug truncate" title={meet.title}>
                      {meet.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold leading-relaxed truncate">
                      {meet.description || 'No description added.'}
                    </p>
                  </div>
                </div>

                {/* Date / Time blocks */}
                <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-3 grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span>{meet.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{meet.time} ({meet.duration}m)</span>
                  </div>
                </div>

                {/* Invitees lists */}
                <div className="space-y-1 text-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Confirmed Invitees</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {meet.participants.map((person, idx) => (
                      <span key={idx} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 border border-slate-150">
                        {person}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer row */}
              <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between gap-2 text-xs font-bold">
                {meet.link ? (
                  <a
                    href={meet.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Join Meet Room <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="text-slate-400 text-[10px]">No link loaded</span>
                )}

                <button
                  id={`delete-meeting-${meet.id}`}
                  onClick={() => handleDelete(meet.id)}
                  className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Cancel Conference"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE MEETING MODAL */}
      {modalOpen && (
        <div id="meeting-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-sans text-base font-bold text-slate-800">Schedule Conference Room</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 focus:outline-hidden">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Conference Topic</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sales Pipeline Retrospective"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Brief Agenda Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Review client proposals and pipeline bottlenecks"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Duration (m)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                    <option value={90}>90 mins</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Time</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Invitees (comma separated)</label>
                  <input
                    type="text"
                    value={participantInput}
                    onChange={(e) => setParticipantInput(e.target.value)}
                    placeholder="Alan, Bob, Clara"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Auto-allocated Meeting Room</label>
                <input
                  type="text"
                  required
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-xs text-indigo-600 focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs text-white hover:bg-indigo-700 shadow-xs focus:outline-hidden"
                >
                  Schedule Conference
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
