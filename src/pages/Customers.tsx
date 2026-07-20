/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Customer } from '../types';
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Trash2,
  X,
  FileText,
  UserCheck,
  Mail,
  Phone,
  Building,
} from 'lucide-react';

export const Customers: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, employees } = useCRM();

  // Search/Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Prospect'>('All');

  // Form Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<Customer['status']>('Active');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('');
  const [notes, setNotes] = useState('');

  // View Details Modal
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);

  // Form resets
  const resetForm = () => {
    setName('');
    setCompany('');
    setGstNumber('');
    setPhone('');
    setEmail('');
    setAddress('');
    setStatus('Active');
    setAssignedEmployeeId(employees[0]?.id || '');
    setNotes('');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Customer, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent row click triggers
    setEditingId(c.id);
    setName(c.name);
    setCompany(c.company);
    setGstNumber(c.gstNumber);
    setPhone(c.phone);
    setEmail(c.email);
    setAddress(c.address);
    setStatus(c.status);
    setAssignedEmployeeId(c.assignedEmployeeId);
    setNotes(c.notes);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email) return;

    const payload = {
      name,
      company,
      gstNumber,
      phone,
      email,
      address,
      status,
      assignedEmployeeId,
      notes,
      documents: editingId ? (customers.find(c => c.id === editingId)?.documents || []) : [],
    };

    if (editingId) {
      updateCustomer(editingId, payload);
    } else {
      addCustomer(payload);
    }

    setModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this customer record?')) {
      deleteCustomer(id);
    }
  };

  // Filter & Search computation
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Dynamic CSV compilation and trigger download
  const handleExportCSV = () => {
    const headers = ['Client Name', 'Company Name', 'GSTIN', 'Phone Number', 'Email', 'Billing Address', 'Status', 'Notes'];
    const rows = filteredCustomers.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.company.replace(/"/g, '""')}"`,
      `"${c.gstNumber}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.address.replace(/"/g, '""')}"`,
      c.status,
      `"${c.notes.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', 'Enterprise_CRM_Customers.csv');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  return (
    <div id="customers-page-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Customer Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage accounts, contact logs, tax parameters and invoices.</p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button
            id="add-customer-btn"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* Filter / Search bars */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="customer-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search accounts by name, company, email..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-hidden transition-all"
          />
        </div>

        {/* Status Dropdowns */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            id="customer-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="All">All Accounts</option>
            <option value="Active">Active Status</option>
            <option value="Inactive">Inactive Status</option>
            <option value="Prospect">Prospect Stage</option>
          </select>
        </div>
      </div>

      {/* Directory Table Grid */}
      <div className="border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Account Profile</th>
                <th className="px-6 py-4">GSTIN Tax Registration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Representative</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No active client accounts match your search/filter parameters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const rep = employees.find((e) => e.id === c.assignedEmployeeId);

                  return (
                    <tr
                      key={c.id}
                      id={`customer-row-${c.id}`}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => setViewCustomer(c)}
                    >
                      <td className="px-6 py-4.5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 shrink-0">
                            <Building className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 block leading-tight">{c.name}</span>
                            <span className="text-xs text-slate-400 block mt-1">{c.company}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4.5 font-mono text-xs font-semibold text-slate-600">
                        {c.gstNumber || '-- Not Set --'}
                      </td>

                      <td className="px-6 py-4.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                            c.status === 'Active'
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : c.status === 'Prospect'
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="px-6 py-4.5 text-xs text-slate-500 font-semibold">
                        {rep ? rep.name : 'Unassigned'}
                      </td>

                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            id={`edit-customer-${c.id}`}
                            onClick={(e) => handleOpenEdit(c, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            id={`delete-customer-${c.id}`}
                            onClick={(e) => handleDelete(c.id, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Drawer Modal */}
      {modalOpen && (
        <div id="customer-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-sans text-base font-bold text-slate-800">
                {editingId ? 'Modify Client Properties' : 'Register New Client Account'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 focus:outline-hidden">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Client Contact Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Company / Organization</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">GSTIN Number (Optional)</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    placeholder="e.g. 27AAAAA1111A1Z1"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Commercial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="Active">Active Client</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Prospect">Leads Pipeline Prospect</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0100"
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
                    placeholder="john@acme.com"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Billing Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, Suite, City, Zip"
                  rows={2}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Account Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key pointers, business context, demands"
                  rows={3}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 focus:outline-hidden"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs focus:outline-hidden"
                >
                  {editingId ? 'Apply Changes' : 'Register Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* READ DETAILS POPUP MODAL */}
      {viewCustomer && (
        <div id="view-customer-modal" className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Title banner */}
            <div className="bg-indigo-900 px-6 py-6 text-white relative">
              <button
                onClick={() => setViewCustomer(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-sans tracking-tight leading-none">{viewCustomer.name}</h2>
                  <p className="text-xs text-indigo-200 mt-1.5">{viewCustomer.company}</p>
                </div>
              </div>
            </div>

            {/* Information tabs */}
            <div className="p-6 space-y-5.5 max-h-[70vh] overflow-y-auto">
              {/* Core contacts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5 text-xs">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <a href={`mailto:${viewCustomer.email}`} className="text-slate-700 font-semibold hover:underline block mt-0.5">{viewCustomer.email}</a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                    <a href={`tel:${viewCustomer.phone}`} className="text-slate-700 font-semibold hover:underline block mt-0.5">{viewCustomer.phone || '--'}</a>
                  </div>
                </div>
              </div>

              {/* GSTIN & Address */}
              <div className="space-y-3.5">
                <div className="text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GST Tax registration code</span>
                  <span className="font-mono text-slate-700 font-semibold block mt-1 bg-slate-50 border border-slate-100 p-2 rounded-lg">{viewCustomer.gstNumber || '-- Not Set --'}</span>
                </div>

                <div className="text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Billing Address</span>
                  <p className="text-slate-600 mt-1 bg-slate-50 border border-slate-100 p-2.5 rounded-lg leading-relaxed">{viewCustomer.address || '-- Not Set --'}</p>
                </div>
              </div>

              {/* Assignment & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Staff Rep</span>
                  <span className="font-semibold text-slate-700 block mt-1">
                    {employees.find((e) => e.id === viewCustomer.assignedEmployeeId)?.name || 'Unassigned'}
                  </span>
                </div>

                <div className="text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Commercial Tier</span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold border mt-1.5 ${
                      viewCustomer.status === 'Active'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : viewCustomer.status === 'Prospect'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    {viewCustomer.status}
                  </span>
                </div>
              </div>

              {/* Account Notes */}
              <div className="text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Activity Notes & Reminders</span>
                <p className="text-slate-600 mt-1.5 p-3 rounded-xl border border-slate-200 bg-amber-50/10 leading-relaxed italic">{viewCustomer.notes || 'No account logs recorded.'}</p>
              </div>

              {/* Document Attachments */}
              <div className="text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Document Repository ({viewCustomer.documents.length})</span>
                {viewCustomer.documents.length === 0 ? (
                  <p className="text-slate-400 mt-1">No attachments loaded in client cloud repository.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {viewCustomer.documents.map((docName, i) => (
                      <div key={i} className="flex items-center gap-2 border border-slate-200 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <FileText className="h-4 w-4 text-indigo-600" />
                        <span className="text-[11px] font-bold text-slate-600 truncate">{docName}</span>
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
