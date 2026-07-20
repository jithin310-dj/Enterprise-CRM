/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import {
  Building,
  CreditCard,
  User,
  Settings as SettingsIcon,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, currentUser } = useCRM();

  // Tab control
  const [activeTab, setActiveTab] = useState<'company' | 'billing' | 'personal'>('company');

  // Form Fields
  const [name, setName] = useState(settings.name);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [gstNumber, setGstNumber] = useState(settings.gstNumber);

  // Billing Fields
  const [currency, setCurrency] = useState(settings.currency);
  const [defaultTaxRate, setDefaultTaxRate] = useState(settings.defaultTaxRate);
  const [invoiceTerms, setInvoiceTerms] = useState(settings.invoiceTerms);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      name,
      address,
      phone,
      email,
      gstNumber,
      currency,
      defaultTaxRate: Number(defaultTaxRate),
      invoiceTerms,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="settings-page-container" className="max-w-3xl space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">System Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Configure enterprise tax codes, billing details, and personal workspace preferences.</p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-150 px-3 py-1.5 text-xs font-bold text-emerald-700 animate-in fade-in zoom-in-95 duration-150">
            <CheckCircle2 className="h-4 w-4" /> Parameters saved successfully!
          </span>
        )}
      </div>

      {/* Settings Grid Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation panel */}
        <div className="md:col-span-1 flex flex-row md:flex-col bg-slate-50 border border-slate-200 p-1.5 rounded-2xl md:space-y-1 text-xs font-bold select-none h-fit">
          <button
            type="button"
            onClick={() => setActiveTab('company')}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all w-full justify-center md:justify-start ${
              activeTab === 'company' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Building className="h-4.5 w-4.5" /> Company Config
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all w-full justify-center md:justify-start ${
              activeTab === 'billing' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <CreditCard className="h-4.5 w-4.5" /> Billing Specs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all w-full justify-center md:justify-start ${
              activeTab === 'personal' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <User className="h-4.5 w-4.5" /> My Identity
          </button>
        </div>

        {/* Content Workspace Form */}
        <form onSubmit={handleSubmit} className="md:col-span-3 border border-slate-200 bg-white rounded-2xl shadow-xs p-6 space-y-6">
          {activeTab === 'company' && (
            <div id="settings-company-tab" className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-sans text-sm font-bold text-slate-800">Company Profile Parameters</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Configure properties used on corporate invoice headers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Registered Trade Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Enterprise Pvt. Ltd."
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Support Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="billing@acme.com"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Support Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0100"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">GST Registration Code</label>
                  <input
                    type="text"
                    required
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    placeholder="e.g. 27AAAAA1111A1Z1"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Registered Office Address</label>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Corporate headquarters location coordinates"
                    rows={3}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div id="settings-billing-tab" className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-sans text-sm font-bold text-slate-800">Billing & Remittance Specifications</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Control currency formatting prefixes, default tax thresholds and payment terms.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Standard Currency code</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="USD">USD ($) United States Dollar</option>
                    <option value="INR">INR (₹) Indian Rupee</option>
                    <option value="EUR">EUR (€) Euro Currency</option>
                    <option value="GBP">GBP (£) Great British Pound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Default Base Tax (%)</label>
                  <input
                    type="number"
                    required
                    value={defaultTaxRate}
                    onChange={(e) => setDefaultTaxRate(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Remittance invoice terms</label>
                  <textarea
                    required
                    value={invoiceTerms}
                    onChange={(e) => setInvoiceTerms(e.target.value)}
                    placeholder="Enter default invoice footer agreements..."
                    rows={4}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personal' && (
            <div id="settings-personal-tab" className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-sans text-sm font-bold text-slate-800">Corporate Identity Verification</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium font-semibold">Verify current user system attributes and security parameters.</p>
              </div>

              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-slate-400">Identity Name:</span>
                  <span className="text-slate-700">{currentUser?.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-slate-400">Account Username:</span>
                  <span className="text-slate-700 font-mono">{currentUser?.username}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-slate-400">Clearance Access Level:</span>
                  <span className="inline-flex rounded-md bg-indigo-50 text-indigo-700 border border-indigo-150 px-2.5 py-0.5 font-extrabold uppercase text-[10px]">
                    {currentUser?.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons (Only company and billing are editable) */}
          {activeTab !== 'personal' && (
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4.5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm focus:outline-hidden"
              >
                <Save className="h-4 w-4" /> Save Configuration
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
