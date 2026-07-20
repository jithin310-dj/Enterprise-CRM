/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';
import { UserRole } from '../types';
import { ShieldAlert, LogIn, UserPlus, KeyRound } from 'lucide-react';

export const Auth: React.FC = () => {
  const { currentUser, login, register } = useCRM();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Super Admin');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, role);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    register(name, email, role);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  // Presets for easy exploration
  const rolePresets = [
    { name: 'Sarah Jenkins', role: 'Super Admin' as UserRole, email: 'admin@enterprise.com' },
    { name: 'John Doe', role: 'Sales Executive' as UserRole, email: 'john.sales@enterprise.com' },
    { name: 'David Foster', role: 'HR' as UserRole, email: 'david.hr@enterprise.com' },
    { name: 'Rohan Sharma', role: 'Accountant' as UserRole, email: 'rohan.acc@enterprise.com' },
  ];

  return (
    <div id="auth-root" className="min-h-screen w-screen flex bg-slate-50 font-sans">
      {/* Left panel - Form */}
      <div className="w-full lg:w-[48%] flex items-center justify-center p-8 md:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800">
              Enterprise <span className="text-indigo-600">CRM</span>
            </span>
          </div>

          {isForgot ? (
            /* Forgot Password Panel */
            <div className="animate-in fade-in duration-200">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</h2>
              <p className="mt-2 text-sm text-slate-500">
                Provide your email address to receive a password recovery link.
              </p>

              {forgotSent ? (
                <div className="mt-6 rounded-xl bg-green-50 p-4 border border-green-200 text-sm text-green-800">
                  A password reset link has been dispatched to <strong>{forgotEmail}</strong>. Please check your inbox.
                  <button
                    onClick={() => {
                      setIsForgot(false);
                      setForgotSent(false);
                    }}
                    className="block font-bold text-indigo-600 mt-3 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={handleForgotSubmit}>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Email address</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. name@company.com"
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    <KeyRound className="h-4 w-4" /> Send Recovery Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgot(false)}
                    className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Cancel and Return
                  </button>
                </form>
              )}
            </div>
          ) : isLogin ? (
            /* Login Form */
            <div className="animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Access your enterprise directory, customers, and pipelines.
                </p>
              </div>

              <form className="mt-6 space-y-4.5" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
                    <button
                      type="button"
                      onClick={() => setIsForgot(true)}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Simulated Login Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="Super Admin">Super Admin (Access Everything)</option>
                    <option value="Admin">Admin</option>
                    <option value="HR">HR Specialist</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Employee">Employee (Self Portal)</option>
                    <option value="Accountant">Accountant (Billing & Payroll)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
                >
                  <LogIn className="h-4 w-4" /> Sign In
                </button>
              </form>

              {/* Preset shortcuts for evaluations */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3.5">
                  Sandbox Fast Entry Taps
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {rolePresets.map((p) => (
                    <button
                      key={p.role}
                      onClick={() => {
                        setEmail(p.email);
                        setPassword('supersecret123');
                        setRole(p.role);
                        login(p.email, p.role);
                      }}
                      className="flex flex-col items-start p-2.5 rounded-xl border border-slate-200 text-left hover:border-indigo-500 hover:bg-indigo-50/10 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-800">{p.name}</span>
                      <span className="text-[10px] text-indigo-600 mt-0.5">{p.role}</span>
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-slate-500">
                Don't have an employee profile?{' '}
                <button onClick={() => setIsLogin(false)} className="font-semibold text-indigo-600 hover:underline">
                  Register as employee
                </button>
              </p>
            </div>
          ) : (
            /* Register Form */
            <div className="animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Register employee profile</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Self-onboard into the enterprise management ledger.
                </p>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleRegisterSubmit}>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Meera Nair"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. meera@company.com"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Primary Designation Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="HR">HR Specialist</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Employee">Employee (Self Portal)</option>
                    <option value="Accountant">Accountant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Create Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" /> Create Profile & Login
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500">
                Already registered?{' '}
                <button onClick={() => setIsLogin(true)} className="font-semibold text-indigo-600 hover:underline">
                  Sign in here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right panel - Dynamic SaaS Graphic Hero */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-900 p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Background visual shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
        <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-2 text-indigo-300 font-medium text-xs tracking-widest uppercase">
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          Continuous Ledger Service Active
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
            Integrated B2B SaaS Customer & HR Platform
          </h1>
          <p className="text-slate-300 text-base leading-relaxed max-w-lg">
            Manage your sales funnel, generate dynamic GST compliant invoices, track attendance clocking, approve payroll disbursements, and dispatch scheduled event notes in one unified interface.
          </p>

          <div className="flex gap-4 items-center bg-white/5 border border-white/10 p-4 rounded-xl max-w-md">
            <div className="h-10 w-10 rounded-lg bg-indigo-600/50 flex items-center justify-center font-bold font-mono">
              ★
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-300">TRUSTED BY THE ENTERPRISE</div>
              <div className="text-xs text-slate-300 mt-0.5">Automated accounting metrics updated live.</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          © 2026 Enterprise Solutions Corp. Compliance checked.
        </div>
      </div>
    </div>
  );
};
