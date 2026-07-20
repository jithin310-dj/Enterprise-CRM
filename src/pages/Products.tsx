/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Product } from '../types';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  QrCode,
  AlertTriangle,
  ArrowUpDown,
} from 'lucide-react';

export const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useCRM();

  // Search & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Form controls
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Software Licenses');
  const [price, setPrice] = useState(100);
  const [gst, setGst] = useState(18); // default percentage
  const [stock, setStock] = useState(100);
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');

  const categories = ['Software Licenses', 'On-premise Software', 'Hardware', 'Services'];

  const resetForm = () => {
    setName('');
    setCategory('Software Licenses');
    setPrice(100);
    setGst(18);
    setStock(100);
    setBarcode('');
    setDescription('');
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setBarcode(`SKU-${Math.floor(100000 + Math.random() * 900000)}`);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setGst(p.gst);
    setStock(p.stock);
    setBarcode(p.barcode);
    setDescription(p.description);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const payload = {
      name,
      category,
      price: Number(price),
      gst: Number(gst),
      stock: Number(stock),
      barcode,
      description,
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }

    setModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this product item from the active database?')) {
      deleteProduct(id);
    }
  };

  // Computations
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const lowStockItems = products.filter((p) => p.stock > 0 && p.stock <= 15).length;
  const outOfStockItems = products.filter((p) => p.stock === 0).length;

  return (
    <div id="products-page-container" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900">Product & Services Catalog</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage line item parameters, barcodes, default GST ratios, and stock counts.</p>
        </div>

        <button
          id="add-product-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors shrink-0 animate-in fade-in"
        >
          <Plus className="h-4 w-4" /> Add Product / Service
        </button>
      </div>

      {/* Inventory KPI Summary metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4.5 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Catalog Items</span>
            <span className="text-lg font-mono font-extrabold text-slate-800 block mt-0.5">{products.length} SKUs</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4.5 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Low Stock Alerts</span>
            <span className="text-lg font-mono font-extrabold text-amber-700 block mt-0.5">{lowStockItems} Items</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4.5 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Out of Stock Listings</span>
            <span className="text-lg font-mono font-extrabold text-rose-700 block mt-0.5">{outOfStockItems} Items</span>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="product-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items by name, barcode..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            id="product-category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory table */}
      <div className="border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Barcode / Sku</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4">Stock level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No catalog items match your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isService = p.category === 'Services';
                  const isOut = p.stock === 0 && !isService;
                  const isLow = p.stock > 0 && p.stock <= 15 && !isService;

                  return (
                    <tr key={p.id} id={`product-row-${p.id}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4.5">
                        <span className="font-bold text-slate-800 block leading-tight">{p.name}</span>
                        <span className="text-[10px] text-slate-400 block mt-1 font-medium">{p.description || 'No description provided.'}</span>
                      </td>

                      <td className="px-6 py-4.5 text-xs">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                          {p.category}
                        </span>
                      </td>

                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                          <QrCode className="h-3.5 w-3.5 opacity-50" />
                          <span>{p.barcode}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <div className="font-mono text-slate-800">
                          ${p.price.toLocaleString()}
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">+{p.gst}% GST</span>
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        {isService ? (
                          <span className="text-xs text-indigo-600 italic font-medium">Infinite (Service)</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-800">{p.stock}</span>
                            {isOut && (
                              <span className="inline-flex rounded-full bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-600 border border-rose-100">
                                OUT
                              </span>
                            )}
                            {isLow && (
                              <span className="inline-flex rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 border border-amber-100">
                                LOW
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`edit-product-${p.id}`}
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            id={`delete-product-${p.id}`}
                            onClick={() => handleDelete(p.id)}
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

      {/* Product edit modal */}
      {modalOpen && (
        <div id="product-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-sans text-base font-bold text-slate-800">
                {editingId ? 'Modify Catalog Item' : 'Add Item to Inventory Catalog'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 focus:outline-hidden">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Product / Service Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pro Support Retainer, SQL license"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Category Classification</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">SKU / Barcode Code</label>
                  <input
                    type="text"
                    required
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="e.g. CRM-CLD-101"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Unit Base Cost ($)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="100"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">GST Tax Rate (%)</label>
                  <select
                    value={gst}
                    onChange={(e) => setGst(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value={0}>0% (Exempt)</option>
                    <option value={5}>5% (Services)</option>
                    <option value={12}>12% (Hardware/SIP)</option>
                    <option value={18}>18% (Software/Cloud)</option>
                    <option value={28}>28% (Luxury items)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Initial Stock Count</label>
                  <input
                    type="number"
                    disabled={category === 'Services'}
                    required
                    value={category === 'Services' ? 0 : stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    placeholder="100"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-hidden disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Detailed Specifications</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key features, limitations or warranty periods..."
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
                  {editingId ? 'Modify Item' : 'Add Item to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
