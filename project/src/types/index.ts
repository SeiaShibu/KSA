export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'technician' | 'admin';
  isActive?: boolean;
  createdAt?: string;
}

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'service' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: User;
  createdBy: User;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  notes?: Note[];
}

export interface Note {
  _id: string;
  content: string;
  addedBy: User;
  addedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface DashboardAnalytics {
  overview: {
    totalComplaints: number;
    openComplaints: number;
    inProgressComplaints: number;
    resolvedComplaints: number;
  };
  complaintsByCategory: Array<{ _id: string; count: number }>;
  complaintsByPriority: Array<{ _id: string; count: number }>;
  monthlyTrend: Array<{
    _id: { year: number; month: number };
    count: number;
  }>;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ComplaintFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
}

export interface CreateUserFormData {
  name: string;
  email: string;
  password: string;
  role: 'technician' | 'admin';
}