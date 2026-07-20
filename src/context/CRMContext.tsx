/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Customer,
  Lead,
  LeadStage,
  Product,
  Invoice,
  Employee,
  Attendance,
  LeaveRequest,
  Task,
  Project,
  Meeting,
  Notification,
  JobPost,
  Applicant,
  CompanySettings,
  Candidate,
} from '../types';

interface CRMContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, role: UserRole) => void;
  register: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, cust: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'history'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveLeadStage: (id: string, stage: LeadStage) => void;

  products: Product[];
  addProduct: (prod: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, prod: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  attendance: Attendance[];
  clockIn: (employeeId: string, name: string) => void;
  clockOut: (employeeId: string) => void;
  addAttendanceRecord: (att: Omit<Attendance, 'id'>) => void;

  leaves: LeaveRequest[];
  addLeaveRequest: (leave: Omit<LeaveRequest, 'id' | 'status'>) => void;
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected') => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, status: Task['status']) => void;

  projects: Project[];
  meetings: Meeting[];
  addMeeting: (meet: Omit<Meeting, 'id'>) => void;

  notifications: Notification[];
  addNotification: (title: string, message: string, type: Notification['type']) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  jobPosts: JobPost[];
  addJobPost: (post: Omit<JobPost, 'id'>) => void;
  applicants: Applicant[];
  addApplicant: (app: Omit<Applicant, 'id' | 'status'>) => void;
  updateApplicantStatus: (id: string, status: Applicant['status'], details?: { date?: string; time?: string; notes?: string }) => void;

  candidates: Candidate[];
  addCandidate: (cand: Omit<Candidate, 'id'>) => void;
  updateCandidate: (id: string, cand: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;

  settings: CompanySettings;
  updateSettings: (sets: Partial<CompanySettings>) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('crm_current_user');
    if (saved) return JSON.parse(saved);
    // Default to Super Admin so that the initial experience has full access
    const defaultUser: User = {
      id: 'emp_1',
      email: 'admin@enterprise.com',
      name: 'Sarah Jenkins',
      role: 'Super Admin',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    };
    localStorage.setItem('crm_current_user', JSON.stringify(defaultUser));
    return defaultUser;
  });

  // State collections loaded from localStorage or seeded with realistic Enterprise data
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('crm_customers');
    if (saved) return JSON.parse(saved);
    const seed: Customer[] = [
      {
        id: 'cust_1',
        name: 'John Doe',
        company: 'Acme Corporation',
        gstNumber: '27AAAAA1111A1Z1',
        phone: '+1 555-0199',
        email: 'johndoe@acme.com',
        address: '123 Business Rd, Suite 100, Metropolis',
        status: 'Active',
        assignedEmployeeId: 'emp_2',
        notes: 'Interested in buying enterprise cloud systems. Primary point of contact is John.',
        documents: ['SLA_Draft_2026.pdf', 'Company_Profile.pdf'],
      },
      {
        id: 'cust_2',
        name: 'Marcus Sterling',
        company: 'Apex Industries',
        gstNumber: '27BBBBB2222B2Z2',
        phone: '+1 555-0248',
        email: 'marcus@apexind.com',
        address: '456 Innovation Way, Tech Park, Silicon Valley',
        status: 'Active',
        assignedEmployeeId: 'emp_2',
        notes: 'Enquired about customized ERP modules. Monthly support active.',
        documents: ['NDA_Signed_Apex.pdf'],
      },
      {
        id: 'cust_3',
        name: 'Elena Rostova',
        company: 'Vanguard Global',
        gstNumber: '27CCCCC3333C3Z3',
        phone: '+1 555-0371',
        email: 'elena@vanguard.org',
        address: '789 Financial Row, Floor 22, New York',
        status: 'Prospect',
        assignedEmployeeId: 'emp_3',
        notes: 'Initial negotiation phase. Demanded a 15% discount for long term contract.',
        documents: [],
      },
      {
        id: 'cust_4',
        name: 'David Kim',
        company: 'Nova retail',
        gstNumber: '27DDDDD4444D4Z4',
        phone: '+1 555-0422',
        email: 'david.kim@novaretail.io',
        address: '101 Commerce Blvd, Los Angeles',
        status: 'Inactive',
        assignedEmployeeId: 'emp_3',
        notes: 'Lead frozen. Shifted systems in-house. To be retargeted next quarter.',
        documents: [],
      },
    ];
    localStorage.setItem('crm_customers', JSON.stringify(seed));
    return seed;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('crm_leads');
    if (saved) return JSON.parse(saved);
    const seed: Lead[] = [
      {
        id: 'lead_1',
        name: 'Samantha Vance',
        company: 'Vance Logistics',
        value: 12500,
        phone: '+1 555-9011',
        email: 'samantha@vancelogistics.com',
        stage: 'New',
        assignedEmployeeId: 'emp_2',
        notes: 'Inbound lead via website form. Needs a customized logistics CRM module.',
        history: [{ date: '2026-07-10', action: 'Lead Created', user: 'System' }],
      },
      {
        id: 'lead_2',
        name: 'Richard Branson',
        company: 'Virgin Orbit Tech',
        value: 48000,
        phone: '+1 555-9022',
        email: 'richard@virginorbit.co',
        stage: 'Contacted',
        assignedEmployeeId: 'emp_2',
        notes: 'Had a quick phone discovery call. Client wants fully localized data storage solutions.',
        history: [
          { date: '2026-07-08', action: 'Lead Created', user: 'System' },
          { date: '2026-07-09', action: 'Phone Discovery Done', user: 'Sales Executive (emp_2)' },
        ],
      },
      {
        id: 'lead_3',
        name: 'Arjun Mehta',
        company: 'Indus Ventures',
        value: 30000,
        phone: '+1 555-9033',
        email: 'arjun@indusv.in',
        stage: 'Proposal Sent',
        assignedEmployeeId: 'emp_3',
        notes: 'Full technical and financial quote submitted on 12th July.',
        history: [
          { date: '2026-07-05', action: 'Lead Created', user: 'System' },
          { date: '2026-07-06', action: 'Contact Established', user: 'Sales Manager (emp_3)' },
          { date: '2026-07-12', action: 'Proposal Emailed', user: 'Sales Manager (emp_3)' },
        ],
      },
      {
        id: 'lead_4',
        name: 'Clara Oswald',
        company: 'Time Dynamics LLC',
        value: 75000,
        phone: '+1 555-9044',
        email: 'clara@timedynamics.org',
        stage: 'Negotiation',
        assignedEmployeeId: 'emp_3',
        notes: 'Price objection. Attempting to lock contract for 3 years at 10% lower cost.',
        history: [
          { date: '2026-07-01', action: 'Lead Created', user: 'System' },
          { date: '2026-07-03', action: 'Meeting Held', user: 'Sales Manager (emp_3)' },
          { date: '2026-07-14', action: 'Entered Contract Negotiation', user: 'Sales Manager (emp_3)' },
        ],
      },
      {
        id: 'lead_5',
        name: 'Bruce Wayne',
        company: 'Wayne Enterprises',
        value: 120000,
        phone: '+1 555-1000',
        email: 'bruce@wayne.corp',
        stage: 'Won',
        assignedEmployeeId: 'emp_2',
        notes: 'Deal closed successfully! Initial payment received.',
        history: [
          { date: '2026-06-20', action: 'Lead Created', user: 'System' },
          { date: '2026-06-25', action: 'Proposal Emailed', user: 'Sales Executive (emp_2)' },
          { date: '2026-07-14', action: 'Deal Finalized & Invoice Raised', user: 'Sales Executive (emp_2)' },
        ],
      },
    ];
    localStorage.setItem('crm_leads', JSON.stringify(seed));
    return seed;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('crm_products');
    if (saved) return JSON.parse(saved);
    const seed: Product[] = [
      {
        id: 'prod_1',
        name: 'Cloud CRM License (Annual)',
        category: 'Software Licenses',
        price: 1200,
        gst: 18,
        stock: 9999,
        barcode: 'CRM-CLD-ANN-01',
        description: 'Single user enterprise license for cloud-hosted CRM services.',
      },
      {
        id: 'prod_2',
        name: 'HR Automation Core (One-time)',
        category: 'On-premise Software',
        price: 4500,
        gst: 18,
        stock: 50,
        barcode: 'HRA-ONP-ONE-02',
        description: 'Full self-hosted HR management system with clocking and payroll automation.',
      },
      {
        id: 'prod_3',
        name: 'Support & Maintenance Retainer (Monthly)',
        category: 'Services',
        price: 350,
        gst: 18,
        stock: 9999,
        barcode: 'SRV-SUP-RET-03',
        description: '24/7 dedicated support desk access with 2 hour SLA.',
      },
      {
        id: 'prod_4',
        name: 'Enterprise Telephony Gateway Hub',
        category: 'Hardware',
        price: 1500,
        gst: 12,
        stock: 12,
        barcode: 'HDW-TEL-GTW-04',
        description: 'Physical SIP gateway for integrated call recording and automated dialing.',
      },
    ];
    localStorage.setItem('crm_products', JSON.stringify(seed));
    return seed;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('crm_invoices');
    if (saved) return JSON.parse(saved);
    const seed: Invoice[] = [
      {
        id: 'inv_1',
        invoiceNumber: 'INV-2026-0001',
        customerId: 'cust_1',
        customerName: 'Acme Corporation',
        date: '2026-07-01',
        dueDate: '2026-07-31',
        items: [
          { id: 'item_1', productId: 'prod_1', name: 'Cloud CRM License (Annual)', quantity: 10, price: 1200, gstPercent: 18, subtotal: 12000 },
          { id: 'item_2', productId: 'prod_3', name: 'Support & Maintenance Retainer (Monthly)', quantity: 2, price: 350, gstPercent: 18, subtotal: 700 },
        ],
        discount: 5, // 5% discount
        taxRate: 18,
        subtotal: 12065, // (12700 - 5% discount)
        taxAmount: 2171.7, // 18% of subtotal
        total: 14236.7,
        status: 'Paid',
        recurring: 'None',
      },
      {
        id: 'inv_2',
        invoiceNumber: 'INV-2026-0002',
        customerId: 'cust_2',
        customerName: 'Apex Industries',
        date: '2026-07-05',
        dueDate: '2026-08-05',
        items: [
          { id: 'item_3', productId: 'prod_2', name: 'HR Automation Core (One-time)', quantity: 1, price: 4500, gstPercent: 18, subtotal: 4500 },
        ],
        discount: 0,
        taxRate: 18,
        subtotal: 4500,
        taxAmount: 810,
        total: 5310,
        status: 'Unpaid',
        recurring: 'None',
      },
      {
        id: 'inv_3',
        invoiceNumber: 'INV-2026-0003',
        customerId: 'cust_1',
        customerName: 'Acme Corporation',
        date: '2026-06-15',
        dueDate: '2026-07-15',
        items: [
          { id: 'item_4', productId: 'prod_4', name: 'Enterprise Telephony Gateway Hub', quantity: 1, price: 1500, gstPercent: 12, subtotal: 1500 },
        ],
        discount: 10,
        taxRate: 12,
        subtotal: 1350,
        taxAmount: 162,
        total: 1512,
        status: 'Paid',
        recurring: 'None',
      },
      {
        id: 'inv_4',
        invoiceNumber: 'INV-2026-0004',
        customerId: 'cust_3',
        customerName: 'Vanguard Global',
        date: '2026-07-10',
        dueDate: '2026-07-25',
        items: [
          { id: 'item_5', productId: 'prod_1', name: 'Cloud CRM License (Annual)', quantity: 3, price: 1200, gstPercent: 18, subtotal: 3600 },
        ],
        discount: 0,
        taxRate: 18,
        subtotal: 3600,
        taxAmount: 648,
        total: 4248,
        status: 'Overdue',
        recurring: 'Monthly',
      },
    ];
    localStorage.setItem('crm_invoices', JSON.stringify(seed));
    return seed;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('crm_employees');
    if (saved) return JSON.parse(saved);
    const seed: Employee[] = [
      {
        id: 'emp_1',
        name: 'Sarah Jenkins',
        email: 'admin@enterprise.com',
        department: 'Management',
        designation: 'CEO / Super Admin',
        salary: 15000,
        joiningDate: '2024-01-10',
        experience: '8 Years',
        emergencyContact: { name: 'Mark Jenkins', relation: 'Spouse', phone: '+1 555-7766' },
        status: 'Active',
        documents: ['Contract.pdf'],
      },
      {
        id: 'emp_2',
        name: 'John Doe',
        email: 'john.sales@enterprise.com',
        department: 'Sales',
        designation: 'Sales Executive',
        salary: 4500,
        joiningDate: '2025-03-01',
        experience: '2 Years',
        emergencyContact: { name: 'Mary Doe', relation: 'Mother', phone: '+1 555-2233' },
        status: 'Active',
        documents: ['John_Offer.pdf'],
      },
      {
        id: 'emp_3',
        name: 'Meera Nair',
        email: 'meera.mgr@enterprise.com',
        department: 'Sales',
        designation: 'Sales Manager',
        salary: 7200,
        joiningDate: '2024-08-15',
        experience: '5 Years',
        emergencyContact: { name: 'K. Nair', relation: 'Father', phone: '+1 555-8899' },
        status: 'Active',
        documents: ['Contract_Meera.pdf'],
      },
      {
        id: 'emp_4',
        name: 'David Foster',
        email: 'david.hr@enterprise.com',
        department: 'HR',
        designation: 'HR Specialist',
        salary: 5000,
        joiningDate: '2024-11-01',
        experience: '4 Years',
        emergencyContact: { name: 'Cynthia Foster', relation: 'Sister', phone: '+1 555-3344' },
        status: 'Active',
        documents: [],
      },
      {
        id: 'emp_5',
        name: 'Rohan Sharma',
        email: 'rohan.acc@enterprise.com',
        department: 'Finance',
        designation: 'Lead Accountant',
        salary: 6000,
        joiningDate: '2025-01-20',
        experience: '3 Years',
        emergencyContact: { name: 'Anita Sharma', relation: 'Wife', phone: '+1 555-4455' },
        status: 'Active',
        documents: [],
      },
      {
        id: 'emp_6',
        name: 'Alex Mercer',
        email: 'alex.emp@enterprise.com',
        department: 'Operations',
        designation: 'Full Stack Engineer',
        salary: 5500,
        joiningDate: '2025-05-10',
        experience: '3 Years',
        emergencyContact: { name: 'Karen Mercer', relation: 'Mother', phone: '+1 555-1122' },
        status: 'Active',
        documents: [],
      },
    ];
    localStorage.setItem('crm_employees', JSON.stringify(seed));
    return seed;
  });

  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem('crm_attendance');
    if (saved) return JSON.parse(saved);
    const seed: Attendance[] = [
      { id: 'att_1', employeeId: 'emp_1', employeeName: 'Sarah Jenkins', date: '2026-07-14', checkIn: '08:45', checkOut: '17:30', status: 'Present', workingHours: 8.75 },
      { id: 'att_2', employeeId: 'emp_2', employeeName: 'John Doe', date: '2026-07-14', checkIn: '09:15', checkOut: '18:00', status: 'Present', workingHours: 8.75 },
      { id: 'att_3', employeeId: 'emp_3', employeeName: 'Meera Nair', date: '2026-07-14', checkIn: '08:50', checkOut: '17:15', status: 'Present', workingHours: 8.41 },
      { id: 'att_4', employeeId: 'emp_4', employeeName: 'David Foster', date: '2026-07-14', checkIn: '09:40', checkOut: '18:10', status: 'Late', workingHours: 8.5 },
      { id: 'att_5', employeeId: 'emp_5', employeeName: 'Rohan Sharma', date: '2026-07-14', checkIn: '08:55', checkOut: '17:00', status: 'Present', workingHours: 8.08 },
      // Today (2026-07-15) preloaded checkins (no checkout yet for some)
      { id: 'att_6', employeeId: 'emp_1', employeeName: 'Sarah Jenkins', date: '2026-07-15', checkIn: '08:30', status: 'Present' },
      { id: 'att_7', employeeId: 'emp_3', employeeName: 'Meera Nair', date: '2026-07-15', checkIn: '08:45', status: 'Present' },
      { id: 'att_8', employeeId: 'emp_5', employeeName: 'Rohan Sharma', date: '2026-07-15', checkIn: '08:50', status: 'Present' },
      { id: 'att_9', employeeId: 'emp_4', employeeName: 'David Foster', date: '2026-07-15', checkIn: '09:35', status: 'Late' }, // David is late today too
    ];
    localStorage.setItem('crm_attendance', JSON.stringify(seed));
    return seed;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('crm_leaves');
    if (saved) return JSON.parse(saved);
    const seed: LeaveRequest[] = [
      { id: 'leave_1', employeeId: 'emp_2', employeeName: 'John Doe', startDate: '2026-07-20', endDate: '2026-07-22', type: 'Casual', status: 'Pending', reason: 'Family function back home.' },
      { id: 'leave_2', employeeId: 'emp_6', employeeName: 'Alex Mercer', startDate: '2026-07-12', endDate: '2026-07-13', type: 'Sick', status: 'Approved', reason: 'Severe viral fever and cold.' },
      { id: 'leave_3', employeeId: 'emp_3', employeeName: 'Meera Nair', startDate: '2026-08-01', endDate: '2026-08-05', type: 'Earned', status: 'Approved', reason: 'Annual summer trip.' },
    ];
    localStorage.setItem('crm_leaves', JSON.stringify(seed));
    return seed;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('crm_tasks');
    if (saved) return JSON.parse(saved);
    const seed: Task[] = [
      {
        id: 'task_1',
        projectId: 'proj_1',
        projectName: 'ERP Migration',
        title: 'Map client data models',
        description: 'Analyze legacy system tables and construct high fidelity import configurations.',
        priority: 'High',
        status: 'In Progress',
        deadline: '2026-07-20',
        assignedEmployeeId: 'emp_6',
        assignedEmployeeName: 'Alex Mercer',
        subtasks: [
          { id: 'sub_1', title: 'Collect schema documents', completed: true },
          { id: 'sub_2', title: 'Write transformation maps', completed: false },
        ],
      },
      {
        id: 'task_2',
        projectId: 'proj_1',
        projectName: 'ERP Migration',
        title: 'Review backup policies',
        description: 'Verify snapshots and backup intervals conform to client SLA definitions.',
        priority: 'Medium',
        status: 'To Do',
        deadline: '2026-07-25',
        assignedEmployeeId: 'emp_6',
        assignedEmployeeName: 'Alex Mercer',
        subtasks: [],
      },
      {
        id: 'task_3',
        projectId: 'proj_2',
        projectName: 'Q3 Product Sales Strategy',
        title: 'Draft proposal for Acme Corp',
        description: 'Draft fully loaded quotation including premium 24/7 service hubs.',
        priority: 'High',
        status: 'In Review',
        deadline: '2026-07-18',
        assignedEmployeeId: 'emp_2',
        assignedEmployeeName: 'John Doe',
        subtasks: [
          { id: 'sub_3', title: 'Gather hardware quotes', completed: true },
          { id: 'sub_4', title: 'Get legal signoff on SLA terms', completed: true },
        ],
      },
      {
        id: 'task_4',
        projectId: 'proj_2',
        projectName: 'Q3 Product Sales Strategy',
        title: 'Lead prospecting workshop',
        description: 'Coordinate with sales reps to align CRM pipelines for next month target.',
        priority: 'Low',
        status: 'Completed',
        deadline: '2026-07-12',
        assignedEmployeeId: 'emp_3',
        assignedEmployeeName: 'Meera Nair',
        subtasks: [],
      },
    ];
    localStorage.setItem('crm_tasks', JSON.stringify(seed));
    return seed;
  });

  const [projects] = useState<Project[]>([
    { id: 'proj_1', name: 'ERP Migration', description: 'Upgrading the core ERP software to Cloud Version 10.', status: 'In Progress', deadline: '2026-09-30' },
    { id: 'proj_2', name: 'Q3 Product Sales Strategy', description: 'Reaching new markets in the Retail sector with localized hubs.', status: 'In Progress', deadline: '2026-08-31' },
  ]);

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('crm_meetings');
    if (saved) return JSON.parse(saved);
    const seed: Meeting[] = [
      { id: 'meet_1', title: 'Acme Contract Review', description: 'Final round of negotiations on pricing adjustments.', date: '2026-07-15', time: '11:00', duration: 45, organizerId: 'emp_3', participants: ['Sarah Jenkins', 'Meera Nair', 'John Doe'], notes: 'Prepare the contract document and price slider sheet.' },
      { id: 'meet_2', title: 'Weekly Core Standup', description: 'Department sync and blocker check.', date: '2026-07-16', time: '09:30', duration: 30, organizerId: 'emp_1', participants: ['Everyone'], notes: 'Make sure tasks board is completely updated before the call.' },
      { id: 'meet_3', title: 'Apex ERP Demo', description: 'Walk through customized dashboard screens.', date: '2026-07-18', time: '14:00', duration: 60, organizerId: 'emp_6', participants: ['Alex Mercer', 'Meera Nair'], notes: 'Deliver functional demo environment login details.' },
    ];
    localStorage.setItem('crm_meetings', JSON.stringify(seed));
    return seed;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('crm_notifications');
    if (saved) return JSON.parse(saved);
    const seed: Notification[] = [
      { id: 'not_1', title: 'New Lead Assigned', message: 'Samantha Vance has been assigned to Sales Team.', date: '2026-07-15 08:30', read: false, type: 'info' },
      { id: 'not_2', title: 'Pending Leave Request', message: 'John Doe has submitted a Casual Leave request.', date: '2026-07-14 16:45', read: false, type: 'warning' },
      { id: 'not_3', title: 'Invoice Paid', message: 'INV-2026-0001 for Acme Corporation has been marked as PAID ($14,236.70).', date: '2026-07-14 11:15', read: true, type: 'success' },
    ];
    localStorage.setItem('crm_notifications', JSON.stringify(seed));
    return seed;
  });

  const [jobPosts, setJobPosts] = useState<JobPost[]>(() => {
    const saved = localStorage.getItem('crm_job_posts');
    if (saved) return JSON.parse(saved);
    const seed: JobPost[] = [
      { id: 'job_1', title: 'Senior Sales Consultant', department: 'Sales', location: 'Metropolis (Hybrid)', type: 'Full-time', status: 'Active', description: 'Looking for a seasoned representative with 5+ years experience in B2B SaaS CRM solutions.' },
      { id: 'job_2', title: 'Full Stack Developer', department: 'Operations', location: 'Remote', type: 'Full-time', status: 'Active', description: 'Experienced with React, Node.js, Express, and cloud databases.' },
    ];
    localStorage.setItem('crm_job_posts', JSON.stringify(seed));
    return seed;
  });

  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    const saved = localStorage.getItem('crm_applicants');
    if (saved) return JSON.parse(saved);
    const seed: Applicant[] = [
      { id: 'app_1', jobId: 'job_1', jobTitle: 'Senior Sales Consultant', name: 'Robert Downey', email: 'robert@tony.corp', phone: '+1 555-4040', status: 'Applied' },
      { id: 'app_2', jobId: 'job_1', jobTitle: 'Senior Sales Consultant', name: 'Gwyneth Paltrow', email: 'gwyneth@goop.io', phone: '+1 555-5050', status: 'Interview', interviewDate: '2026-07-17', interviewTime: '10:00', notes: 'Excellent communication. Background matches our B2B pricing model.' },
      { id: 'app_3', jobId: 'job_2', jobTitle: 'Full Stack Developer', name: 'Peter Parker', email: 'peter@dailybugle.net', phone: '+1 555-6161', status: 'Screening' },
    ];
    localStorage.setItem('crm_applicants', JSON.stringify(seed));
    return seed;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('crm_candidates');
    if (saved) return JSON.parse(saved);
    const seed: Candidate[] = [
      {
        id: 'cand_1',
        name: 'Tony Stark',
        email: 'tony@starkindustries.com',
        phone: '+1 555-3000',
        appliedRole: 'Senior React Architect',
        status: 'Interview',
        notes: 'Highly experienced developer. Knows TypeScript and quantum systems.'
      },
      {
        id: 'cand_2',
        name: 'Steve Rogers',
        email: 'steve@shield.gov',
        phone: '+1 555-1941',
        appliedRole: 'Sales Account Executive',
        status: 'Applied',
        notes: 'Excellent leadership and persuasion skills. Outstanding fitness.'
      },
      {
        id: 'cand_3',
        name: 'Natasha Romanoff',
        email: 'natasha@redroom.org',
        phone: '+1 555-2012',
        appliedRole: 'HR Associate Lead',
        status: 'Selected',
        notes: 'Great at screening applicants and reading people.'
      }
    ];
    localStorage.setItem('crm_candidates', JSON.stringify(seed));
    return seed;
  });

  const [settings, setSettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('crm_settings');
    if (saved) return JSON.parse(saved);
    const seed: CompanySettings = {
      name: 'Enterprise Solution Corp',
      gstNumber: '27ENTER1010A1ZX',
      phone: '+1 800-555-0100',
      email: 'finance@enterprisesolutions.com',
      address: '500 Corporate Parkway, Hub Tower, Dallas, TX',
      invoicePrefix: 'INV-2026-',
      invoiceTerms: 'Payment due within 30 days of invoice date. 1.5% interest accrued per month for overdue payments.',
      defaultTaxRate: 18,
    };
    localStorage.setItem('crm_settings', JSON.stringify(seed));
    return seed;
  });

  // Sync state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('crm_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('crm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('crm_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('crm_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('crm_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('crm_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('crm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('crm_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('crm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('crm_job_posts', JSON.stringify(jobPosts));
  }, [jobPosts]);

  useEffect(() => {
    localStorage.setItem('crm_applicants', JSON.stringify(applicants));
  }, [applicants]);

  useEffect(() => {
    localStorage.setItem('crm_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('crm_candidates', JSON.stringify(candidates));
  }, [candidates]);

  // Auth Functions
  const login = (email: string, role: UserRole) => {
    // Find matching employee or make custom
    const match = employees.find((e) => e.email.toLowerCase() === email.toLowerCase());
    const user: User = {
      id: match?.id || `emp_${Date.now()}`,
      email,
      name: match?.name || email.split('@')[0].toUpperCase(),
      role: role,
      photoUrl: match ? undefined : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    setCurrentUser(user);
    localStorage.setItem('crm_current_user', JSON.stringify(user));
    addNotification('Login Successful', `Welcome back, ${user.name}! You logged in as ${role}.`, 'success');
  };

  const register = (name: string, email: string, role: UserRole) => {
    const newEmpId = `emp_${Date.now()}`;
    const newEmployee: Employee = {
      id: newEmpId,
      name,
      email,
      department: role === 'HR' ? 'HR' : role.startsWith('Sales') ? 'Sales' : 'Operations',
      designation: role,
      salary: 5000,
      joiningDate: new Date().toISOString().split('T')[0],
      experience: 'Entry Level',
      emergencyContact: { name: 'Emergency Contact', relation: 'Relative', phone: '+1 555-0000' },
      status: 'Active',
      documents: [],
    };
    setEmployees((prev) => [...prev, newEmployee]);

    const user: User = {
      id: newEmpId,
      email,
      name,
      role,
    };
    setCurrentUser(user);
    localStorage.setItem('crm_current_user', JSON.stringify(user));
    addNotification('Registration Complete', `User account created successfully as ${role}.`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('crm_current_user');
  };

  const switchRole = (role: UserRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    setCurrentUser(updated);
    localStorage.setItem('crm_current_user', JSON.stringify(updated));
    addNotification('Role Switched', `Active view transitioned to ${role}.`, 'info');
  };

  // Customers CRUD
  const addCustomer = (cust: Omit<Customer, 'id'>) => {
    const newCust: Customer = { ...cust, id: `cust_${Date.now()}` };
    setCustomers((prev) => [newCust, ...prev]);
    addNotification('Customer Added', `${cust.name} (${cust.company}) registered successfully.`, 'success');
  };

  const updateCustomer = (id: string, cust: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...cust } : c)));
    addNotification('Customer Updated', 'Customer record saved.', 'info');
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    addNotification('Customer Deleted', 'Customer has been removed.', 'warning');
  };

  // Leads CRUD
  const addLead = (lead: Omit<Lead, 'id' | 'history'>) => {
    const newLead: Lead = {
      ...lead,
      id: `lead_${Date.now()}`,
      history: [{ date: new Date().toISOString().split('T')[0], action: 'Lead Created', user: currentUser?.name || 'System' }],
    };
    setLeads((prev) => [newLead, ...prev]);
    addNotification('Lead Added', `Lead pipeline created for ${lead.name} (${lead.company}).`, 'success');
  };

  const updateLead = (id: string, lead: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...lead } : l)));
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    addNotification('Lead Removed', 'Lead record deleted.', 'warning');
  };

  const moveLeadStage = (id: string, stage: LeadStage) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const updatedHistory = [
            ...l.history,
            { date: new Date().toISOString().split('T')[0], action: `Moved Stage to: ${stage}`, user: currentUser?.name || 'User' },
          ];
          return { ...l, stage, history: updatedHistory };
        }
        return l;
      })
    );
    addNotification('Pipeline Updated', `Lead status updated to ${stage}.`, 'success');
  };

  // Products CRUD
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newProd: Product = { ...prod, id: `prod_${Date.now()}` };
    setProducts((prev) => [...prev, newProd]);
    addNotification('Product Added', `${prod.name} added to catalog.`, 'success');
  };

  const updateProduct = (id: string, prod: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...prod } : p)));
    addNotification('Product Updated', 'Product catalog updated.', 'info');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addNotification('Product Removed', 'Product removed from list.', 'warning');
  };

  // Invoices CRUD
  const addInvoice = (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const code = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `${settings.invoicePrefix}${code}`;
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv_${Date.now()}`,
      invoiceNumber,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    addNotification('Invoice Raised', `Invoice ${invoiceNumber} created for ${invoice.customerName}.`, 'success');
  };

  const updateInvoice = (id: string, invoice: Partial<Invoice>) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, ...invoice } : i)));
    addNotification('Invoice Updated', 'Billing statement saved.', 'info');
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    addNotification('Invoice Cancelled', 'Billing statement removed.', 'warning');
  };

  // Employees CRUD
  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmp: Employee = { ...emp, id: `emp_${Date.now()}` };
    setEmployees((prev) => [...prev, newEmp]);
    addNotification('Employee Added', `${emp.name} added to HR Database.`, 'success');
  };

  const updateEmployee = (id: string, emp: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...emp } : e)));
    addNotification('Employee Updated', 'HR Record synchronized.', 'info');
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    addNotification('Employee Deactivated', 'HR record removed.', 'warning');
  };

  // Attendance Clocking
  const clockIn = (employeeId: string, name: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const checkInTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);

    const newRecord: Attendance = {
      id: `att_${Date.now()}`,
      employeeId,
      employeeName: name,
      date: today,
      checkIn: checkInTime,
      status: isLate ? 'Late' : 'Present',
    };
    setAttendance((prev) => [newRecord, ...prev]);
    addNotification('Clock In Successful', `Logged in at ${checkInTime}. Status: ${isLate ? 'Late' : 'Present'}.`, isLate ? 'warning' : 'success');
  };

  const clockOut = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const checkOutTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setAttendance((prev) =>
      prev.map((att) => {
        if (att.employeeId === employeeId && att.date === today) {
          // calculate hours
          const [inH, inM] = att.checkIn.split(':').map(Number);
          const outH = now.getHours();
          const outM = now.getMinutes();
          const hrs = outH - inH + (outM - inM) / 60;
          return {
            ...att,
            checkOut: checkOutTime,
            workingHours: Number(hrs.toFixed(2)),
          };
        }
        return att;
      })
    );
    addNotification('Clock Out Successful', `Logged out at ${checkOutTime}. Thank you!`, 'success');
  };

  const addAttendanceRecord = (att: Omit<Attendance, 'id'>) => {
    const newRecord: Attendance = { ...att, id: `att_${Date.now()}` };
    setAttendance((prev) => [newRecord, ...prev]);
  };

  // Leave Management
  const addLeaveRequest = (leave: Omit<LeaveRequest, 'id' | 'status'>) => {
    const newLeave: LeaveRequest = { ...leave, id: `leave_${Date.now()}`, status: 'Pending' };
    setLeaves((prev) => [newLeave, ...prev]);
    addNotification('Leave Request Submitted', `Request from ${leave.employeeName} is pending HR review.`, 'info');
  };

  const updateLeaveStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaves((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          // If approved, create dynamic absence on matching dates
          if (status === 'Approved') {
            const today = new Date().toISOString().split('T')[0];
            const newAtt: Attendance = {
              id: `att_leave_${Date.now()}`,
              employeeId: l.employeeId,
              employeeName: l.employeeName,
              date: today,
              checkIn: '--:--',
              checkOut: '--:--',
              status: 'On Leave',
              workingHours: 0,
            };
            setAttendance((prevAtt) => [newAtt, ...prevAtt]);
          }
          return { ...l, status };
        }
        return l;
      })
    );
    addNotification('Leave Status Changed', `Request has been ${status}.`, status === 'Approved' ? 'success' : 'error');
  };

  // Tasks CRM Board
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: `task_${Date.now()}` };
    setTasks((prev) => [newTask, ...prev]);
    addNotification('Task Assigned', `New task "${task.title}" assigned to ${task.assignedEmployeeName}.`, 'success');
  };

  const updateTask = (id: string, task: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...task } : t)));
    addNotification('Task Updated', 'Task checklist customized.', 'info');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addNotification('Task Deleted', 'Task removed.', 'warning');
  };

  const moveTaskStatus = (id: string, status: Task['status']) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    addNotification('Task Progress Moved', `Task moved to ${status}.`, 'info');
  };

  // Meetings
  const addMeeting = (meet: Omit<Meeting, 'id'>) => {
    const newMeet: Meeting = { ...meet, id: `meet_${Date.now()}` };
    setMeetings((prev) => [...prev, newMeet]);
    addNotification('Meeting Scheduled', `"${meet.title}" is set for ${meet.date} at ${meet.time}.`, 'success');
  };

  // Notifications
  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newNot: Notification = {
      id: `not_${Date.now()}`,
      title,
      message,
      date: nowStr,
      read: false,
      type,
    };
    setNotifications((prev) => [newNot, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Recruitment
  const addJobPost = (post: Omit<JobPost, 'id'>) => {
    const newPost: JobPost = { ...post, id: `job_${Date.now()}` };
    setJobPosts((prev) => [...prev, newPost]);
    addNotification('Job Opening Created', `Recruitment started for "${post.title}".`, 'success');
  };

  const addApplicant = (app: Omit<Applicant, 'id' | 'status'>) => {
    const newApp: Applicant = { ...app, id: `app_${Date.now()}`, status: 'Applied' };
    setApplicants((prev) => [...prev, newApp]);
    addNotification('Application Logged', `Logged application from ${app.name} for ${app.jobTitle}.`, 'info');
  };

  const updateApplicantStatus = (id: string, status: Applicant['status'], details?: { date?: string; time?: string; notes?: string }) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const notesStr = details?.notes ? ` | Notes: ${details.notes}` : '';
          addNotification('Applicant Stage Advanced', `${app.name} has been moved to ${status}.${notesStr}`, 'success');
          return {
            ...app,
            status,
            interviewDate: details?.date || app.interviewDate,
            interviewTime: details?.time || app.interviewTime,
            notes: details?.notes || app.notes,
          };
        }
        return app;
      })
    );
  };

  // Candidates CRUD
  const addCandidate = (cand: Omit<Candidate, 'id'>) => {
    const newCand: Candidate = { ...cand, id: `cand_${Date.now()}` };
    setCandidates((prev) => [newCand, ...prev]);
    addNotification('Candidate Registered', `${cand.name} added to candidates pool.`, 'success');
  };

  const updateCandidate = (id: string, cand: Partial<Candidate>) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, ...cand } : c)));
    addNotification('Candidate Updated', 'Candidate profile updated.', 'info');
  };

  const deleteCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    addNotification('Candidate Removed', 'Candidate removed from pool.', 'warning');
  };

  // Company Settings
  const updateSettings = (sets: Partial<CompanySettings>) => {
    setSettings((prev) => ({ ...prev, ...sets }));
    addNotification('Company Settings Saved', 'Billing parameters updated.', 'success');
  };

  return (
    <CRMContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
        switchRole,

        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,

        leads,
        addLead,
        updateLead,
        deleteLead,
        moveLeadStage,

        products,
        addProduct,
        updateProduct,
        deleteProduct,

        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,

        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,

        attendance,
        clockIn,
        clockOut,
        addAttendanceRecord,

        leaves,
        addLeaveRequest,
        updateLeaveStatus,

        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,

        projects,
        meetings,
        addMeeting,

        notifications,
        addNotification,
        markNotificationAsRead,
        clearNotifications,

        jobPosts,
        addJobPost,
        applicants,
        addApplicant,
        updateApplicantStatus,

        settings,
        updateSettings,

        candidates,
        addCandidate,
        updateCandidate,
        deleteCandidate,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
