/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Employee, Role } from '../types';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Briefcase,
  Layers,
  FileText,
  DollarSign,
  User,
} from 'lucide-react';

export const HR: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useCRM();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // Form controls
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Employee');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [salary, setSalary] = useState(60000);
  const [joiningDate, setJoiningDate] = useState('2025-01-15');

  // Details popups
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);

  const departments = ['Engineering', 'Sales', 'HR', 'Finance', 'Operations'];
  const roles: Role[] = ['Super Admin', 'Admin', 'HR', 'Sales Manager', 'Sales Executive', 'Employee', 'Accountant'];

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('Employee');
    setDepartment('Engineering');
    setDesignation('Software Engineer');
    setSalary(60000);
    setJoiningDate('2025-01-15');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(emp.id);
    setName(emp.name);
    setEmail(emp.email);
    setRole(emp.role);
    setDepartment(emp.department);
    setDesignation(emp.designation);
    setSalary(emp.salary);
    setJoiningDate(emp.joiningDate);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !designation) return;

    const payload = {
      name,
      email,
      role,
      department,
      designation,
      salary: Number(salary),
      joiningDate,
      documents: editingId ? (employees.find(x => x.id === editingId)?.documents || []) : [],
    };

    if (editingId) {
      updateEmployee(editingId, payload);
    } else {
      addEmployee(payload);
    }

    setModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this employee from company directories? This will wipe associated credential definitions.')) {
      deleteEmployee(id);
    }
  };

  // Filtering
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;

    return matchesSearch && matchesDept;
  });

  return (
    <div id="hr-page-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Staffing & HR Portal</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage full-time payroll, roles, departments, designations and documents.</p>
        </div>

        <button
          id="add-employee-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Employee
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="employee-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search colleagues by name, designation, email..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            id="employee-dept-filter"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="All">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Table Grid */}
      <div className="border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department & Designation</th>
                <th className="px-6 py-4">System Role</th>
                <th className="px-6 py-4">Salary Struct</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No matching employee records located.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    id={`employee-row-${emp.id}`}
                    onClick={() => setViewEmployee(emp)}
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block leading-tight">{emp.name}</span>
                          <span className="text-xs text-slate-400 block mt-1 font-medium">{emp.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4.5">
                      <span className="text-slate-800 block">{emp.designation}</span>
                      <span className="text-xs text-slate-400 block mt-1 font-medium">{emp.department}</span>
                    </td>

                    <td className="px-6 py-4.5">
                      <span className="inline-flex rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-100">
                        {emp.role}
                      </span>
                    </td>

                    <td className="px-6 py-4.5 font-mono text-slate-800">
                      ${(emp.salary / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">${emp.salary.toLocaleString()}/yr</span>
                    </td>

                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`edit-employee-${emp.id}`}
                          onClick={(e) => handleOpenEdit(emp, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          id={`delete-employee-${emp.id}`}
                          onClick={(e) => handleDelete(emp.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* HR Modify & Add Employee Modal */}
      {modalOpen && (
        <div id="employee-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-sans text-base font-bold text-slate-800">
                {editingId ? 'Modify Staff Record' : 'Onboard New Staff Employee'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 focus:outline-hidden">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Colleague Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rachel Green"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Primary Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rachel@enterprise.com"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Department Block</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Designation Job Title</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Engineering Director"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Access Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Gross CTC Salary ($ / yr)</label>
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    placeholder="65000"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Date of Joining</label>
                  <input
                    type="date"
                    required
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 mt-3">
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
                  {editingId ? 'Modify Profile' : 'Onboard Colleague'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL VIEW MODAL */}
      {viewEmployee && (
        <div id="view-employee-modal" className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Top Info Header */}
            <div className="bg-indigo-950 px-6 py-6 text-white relative">
              <button
                onClick={() => setViewEmployee(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white font-extrabold text-base border border-white/20">
                  {viewEmployee.name.split(' ').map((x) => x[0]).join('')}
                </div>
                <div>
                  <h2 className="text-lg font-bold font-sans tracking-tight">{viewEmployee.name}</h2>
                  <p className="text-xs text-indigo-200 mt-1">{viewEmployee.designation}</p>
                </div>
              </div>
            </div>

            {/* Profile body parameters */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Primary Email</span>
                  <span className="font-semibold text-slate-700 block mt-1">{viewEmployee.email}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Department Division</span>
                  <span className="font-semibold text-slate-700 block mt-1">{viewEmployee.department}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Joining Date</span>
                  <span className="font-semibold text-slate-700 block mt-1">{viewEmployee.joiningDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Assigned Auth Role</span>
                  <span className="inline-flex rounded-md bg-indigo-50 border border-indigo-150 text-indigo-700 px-2 py-0.5 mt-1 font-bold">
                    {viewEmployee.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans font-semibold">Annual Package (CTC)</span>
                  <span className="font-mono text-sm font-black text-slate-800 block mt-1">
                    ${viewEmployee.salary.toLocaleString()} / year
                  </span>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Credentials & Verification ({viewEmployee.documents.length})</span>
                {viewEmployee.documents.length === 0 ? (
                  <p className="text-slate-400">No verification credentials loaded on company HR clouds.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {viewEmployee.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 border border-slate-200 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <FileText className="h-4 w-4 text-indigo-600" />
                        <span className="font-bold text-slate-600 truncate">{doc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
