import { useState, useEffect } from 'react';
import { complaintsAPI } from '../services/api';
import { Complaint } from '../types';
import toast from 'react-hot-toast';

interface UseComplaintsOptions {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  autoLoad?: boolean;
}

export const useComplaints = (options: UseComplaintsOptions = {}) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(options.page || 1);
  const [total, setTotal] = useState(0);

  const loadComplaints = async (params?: UseComplaintsOptions) => {
    try {
      setLoading(true);
      const response = await complaintsAPI.getAll({
        page: params?.page || currentPage,
        limit: params?.limit || options.limit || 10,
        status: params?.status || options.status,
        priority: params?.priority || options.priority,
      });
      
      setComplaints(response.complaints);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setTotal(response.total);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const createComplaint = async (data: {
    title: string;
    description: string;
    category: string;
    priority: string;
  }) => {
    try {
      setLoading(true);
      const response = await complaintsAPI.create(data);
      toast.success('Complaint created successfully');
      await loadComplaints();
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create complaint');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (id: string, status: string) => {
    try {
      await complaintsAPI.updateStatus(id, status);
      toast.success('Status updated successfully');
      await loadComplaints();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const assignComplaint = async (id: string, technicianId: string) => {
    try {
      await complaintsAPI.assign(id, technicianId);
      toast.success('Complaint assigned successfully');
      await loadComplaints();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to assign complaint');
    }
  };

  useEffect(() => {
    if (options.autoLoad !== false) {
      loadComplaints();
    }
  }, []);

  return {
    complaints,
    loading,
    totalPages,
    currentPage,
    total,
    loadComplaints,
    createComplaint,
    updateComplaintStatus,
    assignComplaint,
    setCurrentPage
  };
};