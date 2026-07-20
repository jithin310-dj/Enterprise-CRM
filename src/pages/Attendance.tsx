/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useCRM } from '../context/CRMContext';
import { Attendance as AttendanceType } from '../types';
import {
  Clock,
  Play,
  Square,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
} from 'lucide-react';

export const Attendance: React.FC = () => {
  const { attendance, addAttendance, updateAttendance, employees, currentUser } = useCRM();

  const [timeStr, setTimeStr] = useState('09:00:00 AM');
  const [punching, setPunching] = useState(false);
  const [activePunch, setActivePunch] = useState<AttendanceType | null>(null);

  // Search/Filters (for HR / Admins)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Present' | 'Absent' | 'Late'>('All');

  // Check if current user is Admin/HR
  const isHR = currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin' || currentUser?.role === 'HR';

  // Local clock runner
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Look for current user's attendance punch for today: July 15, 2026
  useEffect(() => {
    if (currentUser) {
      const todayPunch = attendance.find(
        (a) => a.employeeId === currentUser.id && a.date === '2026-07-15'
      );
      if (todayPunch) {
        setActivePunch(todayPunch);
        if (todayPunch.clockOut === '--') {
          setPunching(true);
        } else {
          setPunching(false);
        }
      }
    }
  }, [attendance, currentUser]);

  const handleClockIn = () => {
    if (!currentUser) return;

    // Determine Status based on current time (simulated boundary: after 09:15 AM is Late)
    const now = new Date();
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);
    const calculatedStatus = isLate ? 'Late' : 'Present';

    const payload = {
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      date: '2026-07-15',
      clockIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clockOut: '--',
      status: calculatedStatus as any,
      workHours: 0,
    };

    addAttendance(payload);
    setPunching(true);
  };

  const handleClockOut = () => {
    if (!activePunch) return;

    // Simulate 8 hours of work
    updateAttendance(activePunch.id, {
      clockOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      workHours: 8.5,
    });
    setPunching(false);
  };

  // Filter computations
  const filteredAttendance = attendance.filter((a) => {
    // Role filter: regular employees can only inspect their own attendance history
    const matchesUserScope = isHR || a.employeeId === currentUser?.id;

    const matchesSearch = a.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;

    return matchesUserScope && matchesSearch && matchesStatus;
  });

  return (
    <div id="attendance-page-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Attendance & Timesheets</h1>
        <p className="text-sm text-slate-500 mt-0.5">Check-in, track hours, and monitor corporate attendance records.</p>
      </div>

      {/* Clocking Punch Widget block */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Punch controls */}
        <div className="border border-slate-200 bg-white rounded-2xl shadow-xs p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enterprise Punch Card</span>
            <div className="font-mono text-2xl font-black text-indigo-600 tracking-wider">
              {timeStr}
            </div>
            <div className="text-[11px] font-bold text-slate-500 flex items-center justify-center md:justify-start gap-1">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" /> July 15, 2026 (Wednesday)
            </div>
          </div>

          <div className="space-y-2">
            {!punching ? (
              <button
                id="clock-in-btn"
                onClick={handleClockIn}
                disabled={activePunch && activePunch.clockOut !== '--'}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4 fill-white" /> Clock In / punch arrival
              </button>
            ) : (
              <button
                id="clock-out-btn"
                onClick={handleClockOut}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white hover:bg-rose-700 shadow-sm transition-colors"
              >
                <Square className="h-3.5 w-3.5 fill-white" /> Clock Out / departure
              </button>
            )}

            {activePunch && (
              <div className="rounded-lg bg-indigo-50/50 border border-indigo-100 p-2.5 text-center text-[10px] text-indigo-800 font-semibold leading-relaxed">
                Status: Marked <span className="font-bold">{activePunch.status}</span>. Punch-In time: {activePunch.clockIn}
                {activePunch.clockOut !== '--' && ` • Punch-Out time: ${activePunch.clockOut}`}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Tip / Rules block */}
        <div className="border border-slate-200 bg-white rounded-2xl shadow-xs p-5 flex gap-3 text-xs text-slate-500 md:col-span-2">
          <MapPin className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
          <div className="space-y-1.5 leading-relaxed font-semibold">
            <span className="font-bold text-slate-700 uppercase block tracking-wider mb-1">Punch parameters</span>
            <p>1. Office shift timings commence at 09:00 AM UTC.</p>
            <p>2. Punch-ins recorded after 09:15 AM are automatically flagged as "Late arrival".</p>
            <p>3. Standard work cycle registers 8.5 billable working hours. Ensure you punch out at day end to compute cumulative net payroll variables correctly.</p>
          </div>
        </div>
      </div>

      {/* Corporate Records Roster (Filtered by Role) */}
      <div className="border border-slate-200 bg-white rounded-2xl shadow-xs p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h3 className="font-sans text-sm font-bold text-slate-800">
            {isHR ? 'Master Corporate Roster' : 'My Punch Log Records'}
          </h3>

          {/* Quick filters (Only for Admin/HR) */}
          {isHR && (
            <div className="flex flex-col md:flex-row items-center gap-2 shrink-0 w-full md:w-auto">
              <input
                id="attendance-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff..."
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-hidden w-full md:w-36"
              />
              <select
                id="attendance-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold focus:outline-hidden w-full md:w-auto"
              >
                <option value="All">All statuses</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late arrivals</option>
              </select>
            </div>
          )}
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Staff Colleague</th>
                <th className="px-5 py-3">Calendar Date</th>
                <th className="px-5 py-3">Punch-In</th>
                <th className="px-5 py-3">Punch-Out</th>
                <th className="px-5 py-3">Work hours</th>
                <th className="px-5 py-3">Status Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No punch sheet listings logged under current criteria.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((log) => (
                  <tr key={log.id} id={`attendance-row-${log.id}`} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 font-bold text-slate-800">{log.employeeName}</td>
                    <td className="px-5 py-3.5 text-slate-400">{log.date}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-600">{log.clockIn}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-600">{log.clockOut}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-600">{log.workHours ? `${log.workHours} hrs` : '--'}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                          log.status === 'Present'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : log.status === 'Late'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-rose-50 border-rose-200 text-rose-700'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
