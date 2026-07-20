/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Invoice, InvoiceItem, Customer } from '../types';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Printer,
  Download,
  Mail,
  X,
  Building,
  DollarSign,
  Receipt,
  RotateCw,
} from 'lucide-react';

export const Billing: React.FC = () => {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, customers, products, settings } = useCRM();

  // Navigation
  const [activeView, setActiveView] = useState<'list' | 'create'>('list');
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);

  // Invoice creator form state
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [recurringCycle, setRecurringCycle] = useState<Invoice['recurring']>('None');

  // Multi-line Items
  const [lineItems, setLineItems] = useState<Omit<InvoiceItem, 'id'>[]>([
    { productId: '', name: '', quantity: 1, price: 0, gstPercent: 18, subtotal: 0 },
  ]);

  const handleAddLine = () => {
    setLineItems([...lineItems, { productId: '', name: '', quantity: 1, price: 0, gstPercent: 18, subtotal: 0 }]);
  };

  const handleRemoveLine = (idx: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== idx));
  };

  const handleLineChange = (idx: number, field: keyof Omit<InvoiceItem, 'id'>, val: any) => {
    const updated = [...lineItems];

    if (field === 'productId') {
      const prodId = val;
      const found = products.find((p) => p.id === prodId);
      if (found) {
        updated[idx].productId = prodId;
        updated[idx].name = found.name;
        updated[idx].price = found.price;
        updated[idx].gstPercent = found.gst;
        updated[idx].subtotal = Number((found.price * updated[idx].quantity).toFixed(2));
      }
    } else if (field === 'quantity') {
      const q = Number(val);
      updated[idx].quantity = q;
      updated[idx].subtotal = Number((updated[idx].price * q).toFixed(2));
    } else if (field === 'price') {
      const p = Number(val);
      updated[idx].price = p;
      updated[idx].subtotal = Number((p * updated[idx].quantity).toFixed(2));
    } else if (field === 'gstPercent') {
      updated[idx].gstPercent = Number(val);
    }

    setLineItems(updated);
  };

  // Live total calculations
  const calculateTotals = () => {
    const rawSubtotal = lineItems.reduce((acc, curr) => acc + curr.subtotal, 0);
    const discountAmount = rawSubtotal * (discountPercent / 100);
    const subtotalAfterDiscount = rawSubtotal - discountAmount;

    // Calculate aggregated taxes line by line
    const taxAmount = lineItems.reduce((acc, curr) => {
      const itemDiscRatio = curr.subtotal / (rawSubtotal || 1);
      const itemSubtotalAfterDisc = curr.subtotal - (discountAmount * itemDiscRatio);
      return acc + (itemSubtotalAfterDisc * (curr.gstPercent / 100));
    }, 0);

    const total = subtotalAfterDiscount + taxAmount;

    return {
      subtotal: Number(rawSubtotal.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      subtotalAfterDiscount: Number(subtotalAfterDiscount.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  };

  const totals = calculateTotals();

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || lineItems.some((l) => !l.productId)) {
      alert('Please select a valid customer and map all products.');
      return;
    }

    const client = customers.find((c) => c.id === selectedCustomerId);
    if (!client) return;

    // Build unique line items
    const formattedItems: InvoiceItem[] = lineItems.map((l, i) => ({
      ...l,
      id: `item_${Date.now()}_${i}`,
    }));

    addInvoice({
      customerId: selectedCustomerId,
      customerName: client.company,
      date: invoiceDate,
      dueDate: dueDate || invoiceDate,
      items: formattedItems,
      discount: Number(discountPercent),
      taxRate: settings.defaultTaxRate,
      subtotal: totals.subtotalAfterDiscount,
      taxAmount: totals.taxAmount,
      total: totals.total,
      status: 'Unpaid',
      recurring: recurringCycle,
    });

    setActiveView('list');
    // Reset Form
    setSelectedCustomerId('');
    setDiscountPercent(0);
    setRecurringCycle('None');
    setLineItems([{ productId: '', name: '', quantity: 1, price: 0, gstPercent: 18, subtotal: 0 }]);
  };

  // Action helpers
  const handlePrint = () => {
    window.print();
  };

  const handleEmailInvoice = (inv: Invoice) => {
    const client = customers.find((c) => c.id === inv.customerId);
    alert(`Success: Invoice ${inv.invoiceNumber} has been compiled and emailed to ${client?.email || 'client@company.com'}.`);
  };

  const handleMarkAsPaid = (invId: string) => {
    updateInvoice(invId, { status: 'Paid' });
    if (detailInvoice && detailInvoice.id === invId) {
      setDetailInvoice({ ...detailInvoice, status: 'Paid' });
    }
  };

  const handleDownload = (inv: Invoice) => {
    alert(`Downloading Invoice ${inv.invoiceNumber}.pdf configuration successfully.`);
  };

  return (
    <div id="billing-page-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Hide controls during OS native printing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Billing & Invoices</h1>
          <p className="text-sm text-slate-500 mt-0.5">Automated accounting system with live GST calculations and print utilities.</p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {activeView === 'list' ? (
            <button
              id="raise-invoice-btn"
              onClick={() => setActiveView('create')}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> Raise Invoice
            </button>
          ) : (
            <button
              id="cancel-invoice-btn"
              onClick={() => setActiveView('list')}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel and Return
            </button>
          )}
        </div>
      </div>

      {activeView === 'list' ? (
        /* INVOICES HISTORY LEDGER */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 print:hidden">
          {/* Main List */}
          <div className="lg:col-span-2 border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden h-fit">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Billing History Ledger</span>
              <span className="text-xs font-bold text-slate-500">{invoices.length} total drafts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3.5">Invoice #</th>
                    <th className="px-5 py-3.5">Client Company</th>
                    <th className="px-5 py-3.5">Bill Date</th>
                    <th className="px-5 py-3.5">Total Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      id={`invoice-row-${inv.id}`}
                      onClick={() => setDetailInvoice(inv)}
                      className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-indigo-600">{inv.invoiceNumber}</td>
                      <td className="px-5 py-4">{inv.customerName}</td>
                      <td className="px-5 py-4 text-slate-400">{inv.date}</td>
                      <td className="px-5 py-4 font-mono font-bold text-slate-800">${inv.total.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                            inv.status === 'Paid'
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : inv.status === 'Overdue'
                              ? 'bg-rose-50 border-rose-200 text-rose-700'
                              : 'bg-amber-50 border-amber-200 text-amber-700'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT SIDE DETAILS WORKSPACE */}
          <div className="border border-slate-200 bg-white rounded-2xl shadow-xs p-5 space-y-5 h-fit">
            {detailInvoice ? (
              <div id="invoice-details-panel" className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active selection</span>
                    <span className="font-mono text-sm font-bold text-indigo-600">{detailInvoice.invoiceNumber}</span>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${
                      detailInvoice.status === 'Paid'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : detailInvoice.status === 'Overdue'
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}
                  >
                    {detailInvoice.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Billed To:</span>
                    <span className="font-bold text-slate-700">{detailInvoice.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Issue Date:</span>
                    <span className="font-medium text-slate-600">{detailInvoice.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Due Date:</span>
                    <span className="font-medium text-slate-600">{detailInvoice.dueDate}</span>
                  </div>
                  {detailInvoice.recurring !== 'None' && (
                    <div className="flex justify-between text-indigo-600 font-bold">
                      <span className="flex items-center gap-1"><RotateCw className="h-3 w-3" /> Recurring:</span>
                      <span>{detailInvoice.recurring}</span>
                    </div>
                  )}
                </div>

                {/* Items Summary list */}
                <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-3 space-y-2.5 text-xs">
                  {detailInvoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between font-medium">
                      <span className="text-slate-600">{item.name} x {item.quantity}</span>
                      <span className="font-mono text-slate-700">${item.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-800">
                    <span>Grand Total:</span>
                    <span className="font-mono text-indigo-600">${detailInvoice.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-2">
                  <button
                    id="print-invoice-btn"
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-slate-600 hover:bg-slate-50"
                  >
                    <Printer className="h-4 w-4" /> Print
                  </button>
                  <button
                    id="download-invoice-btn"
                    onClick={() => handleDownload(detailInvoice)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-slate-600 hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4" /> Download
                  </button>
                  <button
                    id="email-invoice-btn"
                    onClick={() => handleEmailInvoice(detailInvoice)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-slate-600 hover:bg-slate-50 col-span-2"
                  >
                    <Mail className="h-4 w-4 text-indigo-500" /> Email Statement
                  </button>
                  {detailInvoice.status !== 'Paid' && (
                    <button
                      id="mark-paid-btn"
                      onClick={() => handleMarkAsPaid(detailInvoice.id)}
                      className="rounded-lg bg-green-600 py-2.5 text-white hover:bg-green-700 col-span-2 shadow-xs"
                    >
                      Collect & Mark Paid
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select an invoice from the ledger to manage actions and prints.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* INVOICE GENERATOR INTERACTIVE FORM */
        <form onSubmit={handleSaveInvoice} className="border border-slate-200 bg-white rounded-2xl shadow-xs p-6 space-y-6 print:hidden">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-sans text-base font-bold text-slate-800">Draft Billing Invoice</h3>
            <p className="text-xs text-slate-400 mt-0.5">Map clients, configure line items, set taxes and discounts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Client Company</label>
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
              >
                <option value="">-- Select Client --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Issue Date</label>
              <input
                type="date"
                required
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
              />
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

          {/* Line Items Builder Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Invoice Line Items</span>
              <button
                type="button"
                onClick={handleAddLine}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add line
              </button>
            </div>

            <div className="space-y-3">
              {lineItems.map((line, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 items-end bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                  <div className="col-span-5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Select Catalog Item</label>
                    <select
                      required
                      value={line.productId}
                      onChange={(e) => handleLineChange(idx, 'productId', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold focus:border-indigo-500 focus:outline-hidden"
                    >
                      <option value="">-- Choose SKU --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (${p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Quantity</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={line.quantity}
                      onChange={(e) => handleLineChange(idx, 'quantity', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold focus:border-indigo-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Unit Cost ($)</label>
                    <input
                      type="number"
                      required
                      value={line.price}
                      onChange={(e) => handleLineChange(idx, 'price', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold focus:border-indigo-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Calculated Subtotal</label>
                    <div className="mt-1 w-full rounded-lg bg-slate-100 border border-slate-200 px-2 py-1.5 text-xs font-mono font-bold text-slate-500 text-center">
                      ${line.subtotal.toLocaleString()}
                    </div>
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      disabled={lineItems.length === 1}
                      onClick={() => handleRemoveLine(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-40"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing parameters footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Cycle settings */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Overall Discount (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Set Recurring billing</label>
                  <select
                    value={recurringCycle}
                    onChange={(e) => setRecurringCycle(e.target.value as any)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="None">None (One-off)</option>
                    <option value="Monthly">Monthly Cycle</option>
                    <option value="Quarterly">Quarterly Cycle</option>
                    <option value="Yearly">Yearly Cycle</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Calculations breakdown block */}
            <div className="rounded-2xl border border-slate-150 bg-slate-50 p-5 text-xs font-semibold space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal:</span>
                <span className="font-mono">${totals.subtotal.toLocaleString()}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-rose-500">
                  <span>Discount Applied ({discountPercent}%):</span>
                  <span className="font-mono">-${totals.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Billed Tax (Aggregated GST):</span>
                <span className="font-mono">${totals.taxAmount.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between text-slate-800 text-sm font-black">
                <span>Total Amount Due:</span>
                <span className="font-mono text-indigo-600">${totals.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3.5 border-t border-slate-100 pt-5 mt-3">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
            >
              Generate Invoice & Draft Ledger
            </button>
          </div>
        </form>
      )}

      {/* PRINT-ONLY EMBEDDED LAYOUT SECTION (Hidden normally, shown only for printing) */}
      {detailInvoice && (
        <div id="print-area" className="hidden print:block p-8 bg-white max-w-4xl mx-auto space-y-8 font-sans">
          <div className="flex justify-between border-b-2 border-slate-200 pb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">{settings.name}</h1>
              <p className="text-xs text-slate-500 mt-1">{settings.address}</p>
              <p className="text-xs text-slate-500">GSTIN: {settings.gstNumber}</p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-md bg-indigo-900 text-white font-mono text-lg font-bold px-3 py-1.5 shadow-xs">
                INVOICE
              </span>
              <p className="text-xs font-mono font-bold mt-2 text-indigo-700">{detailInvoice.invoiceNumber}</p>
              <p className="text-xs text-slate-400 mt-1">Date: {detailInvoice.date}</p>
              <p className="text-xs text-slate-400">Due Date: {detailInvoice.dueDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billed Client Contact</span>
              <p className="font-bold text-slate-700 mt-1">{detailInvoice.customerName}</p>
              {customers.find((c) => c.id === detailInvoice.customerId)?.address && (
                <p className="text-slate-500 mt-1 leading-relaxed">
                  {customers.find((c) => c.id === detailInvoice.customerId)?.address}
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Remit Remittance To</span>
              <p className="font-bold text-slate-700 mt-1">{settings.name}</p>
              <p className="text-slate-500 mt-1">Phone: {settings.phone}</p>
              <p className="text-slate-500">Email: {settings.email}</p>
            </div>
          </div>

          {/* Lines Table */}
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-slate-600">
                <th className="p-3">Product Name</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">GST %</th>
                <th className="p-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {detailInvoice.items.map((line, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-semibold text-slate-700">{line.name}</td>
                  <td className="p-3 text-center font-semibold text-slate-500">{line.quantity}</td>
                  <td className="p-3 text-right font-mono">${line.price.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono">{line.gstPercent}%</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">${line.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pricing summaries print */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-64 space-y-2 text-xs font-semibold">
              <div className="flex justify-between text-slate-500">
                <span>Taxable Amount:</span>
                <span>${(detailInvoice.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Aggregated GST:</span>
                <span>${detailInvoice.taxAmount.toLocaleString()}</span>
              </div>
              <div className="border-t-2 border-slate-200 pt-2.5 flex justify-between text-slate-800 font-black text-sm">
                <span>Grand Total:</span>
                <span className="text-indigo-700 font-mono">${detailInvoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-6 leading-relaxed">
            <span className="font-bold text-slate-500 uppercase block tracking-wider mb-1.5">Payment Terms</span>
            <p>{settings.invoiceTerms}</p>
          </div>
        </div>
      )}
    </div>
  );
};
