/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'HR'
  | 'Sales Manager'
  | 'Sales Executive'
  | 'Employee'
  | 'Accountant';

export type Role = UserRole;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  photoUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  gstNumber: string;
  phone: string;
  email: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Prospect';
  assignedEmployeeId: string;
  notes: string;
  documents: string[];
}

export type LeadStage = 'New' | 'Contacted' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';

export interface LeadHistoryItem {
  date: string;
  action: string;
  user: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  value: number;
  phone: string;
  email: string;
  stage: LeadStage;
  assignedEmployeeId: string;
  notes: string;
  history: LeadHistoryItem[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  gst: number; // percentage
  stock: number;
  barcode: string;
  description: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  gstPercent: number;
  subtotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  discount: number; // percentage
  taxRate: number; // additional CGST/SGST if applicable or aggregated
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  recurring: 'None' | 'Monthly' | 'Quarterly' | 'Yearly';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  experience: string; // e.g. "3 Years"
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  status: 'Active' | 'Inactive';
  documents: string[];
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string; // HH:MM
  checkOut?: string; // HH:MM
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
  workingHours?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: 'Sick' | 'Casual' | 'Earned' | 'Maternity' | 'Unpaid';
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export interface Task {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed';
  deadline: string;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  deadline: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // in minutes
  organizerId: string;
  participants: string[]; // names or ids
  notes: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface JobPost {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  status: 'Active' | 'Closed';
  description: string;
}

export interface Applicant {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hiring' | 'Rejected';
  interviewDate?: string;
  interviewTime?: string;
  notes?: string;
}

export interface CompanySettings {
  name: string;
  gstNumber: string;
  phone: string;
  email: string;
  address: string;
  invoicePrefix: string;
  invoiceTerms: string;
  defaultTaxRate: number;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  basicSalary: number;
  allowance: number;
  deduction: number;
  netSalary: number;
  status: 'Paid';
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedRole: string;
  status: 'Applied' | 'Interview' | 'Selected' | 'Rejected';
  notes?: string;
}

