/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Task } from '../types';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  X,
  Search,
  Filter,
  Clock,
  AlertCircle,
  User,
} from 'lucide-react';

export const Tasks: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, employees } = useCRM();

  // Search/Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  // Form controls
  const [modalOpen, setModalOpen] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  const handleOpenAdd = () => {
    setTitle('');
    setAssignedEmployeeId(employees[0]?.id || '');
    setPriority('Medium');
    setDueDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    addTask({
      title,
      assignedEmployeeId,
      priority,
      status: 'Pending',
      dueDate,
      description,
    });

    setModalOpen(false);
  };

  const handleToggleStatus = (id: string, currentStatus: Task['status']) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    updateTask(id, { status: nextStatus });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Wipe this task from the agenda?')) {
      deleteTask(id);
    }
  };

  // Computations
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;

  return (
    <div id="tasks-page-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Task Boards</h1>
          <p className="text-sm text-slate-500 mt-0.5">Delegate objectives, check-off completed projects, and inspect delivery schedules.</p>
        </div>

        <button
          id="add-task-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" /> Delegate Task
        </button>
      </div>

      {/* Stats row */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center gap-3.5 max-w-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold">
          <CheckSquare className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unresolved Tasks</span>
          <span className="text-lg font-mono font-extrabold text-slate-800 block mt-0.5">{pendingCount} Pending</span>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="task-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search objectives by title or description..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            id="task-priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Urgency</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task Rows List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
            No pending tasks found matching criteria. Clear filters or add a new task card!
          </div>
        ) : (
          filteredTasks.map((t) => {
            const assignee = employees.find((e) => e.id === t.assignedEmployeeId);
            const isCompleted = t.status === 'Completed';

            return (
              <div
                key={t.id}
                id={`task-item-${t.id}`}
                className={`rounded-2xl border bg-white p-4.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isCompleted ? 'border-slate-150 bg-slate-50/50 opacity-70' : 'border-slate-200'
                }`}
              >
                {/* Checkbox and Text */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    id={`toggle-task-${t.id}`}
                    type="button"
                    onClick={() => handleToggleStatus(t.id, t.status)}
                    className="text-indigo-600 hover:text-indigo-800 shrink-0 mt-0.5 focus:outline-hidden"
                  >
                    {isCompleted ? (
                      <CheckSquare className="h-5.5 w-5.5" />
                    ) : (
                      <Square className="h-5.5 w-5.5 text-slate-300 hover:text-indigo-600" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h4
                      className={`font-sans text-sm font-bold text-slate-800 truncate leading-snug ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {t.title}
                    </h4>
                    {t.description && (
                      <p className="text-xs text-slate-400 mt-1 font-medium truncate max-w-xl">
                        {t.description}
                      </p>
                    )}

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-3.5 mt-2 text-[10px] font-bold text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-300" />
                        <span>Due: {t.dueDate}</span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500 font-semibold">
                        <User className="h-3 w-3 text-slate-400" />
                        <span>By: {assignee ? assignee.name : 'Unassigned'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Priority badges & trash */}
                <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold border uppercase tracking-wider ${
                      t.priority === 'High'
                        ? 'bg-rose-50 border-rose-100 text-rose-700'
                        : t.priority === 'Medium'
                        ? 'bg-amber-50 border-amber-100 text-amber-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    {t.priority}
                  </span>

                  <button
                    id={`delete-task-${t.id}`}
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE TASK MODAL */}
      {modalOpen && (
        <div id="task-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-sans text-base font-bold text-slate-800">Delegate Corporate Task</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 focus:outline-hidden">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Task Title / Target</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Audit GST invoices for Q2"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Assign To</label>
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

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Urgency Priority</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(['High', 'Medium', 'Low'] as Task['priority'][]).map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setPriority(pr)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        priority === pr
                          ? pr === 'High'
                            ? 'bg-rose-500 border-rose-600 text-white shadow-xs'
                            : pr === 'Medium'
                            ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                            : 'bg-indigo-600 border-indigo-700 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Task description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key deliverables, steps or expectations..."
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
                  Delegate Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
