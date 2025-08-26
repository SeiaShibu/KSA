import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Select from '../../components/UI/Select';
import Badge from '../../components/UI/Badge';
import { useComplaints } from '../../hooks/useComplaints';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' }
];

const priorityOptions = [
  { value: 'all', label: 'All Priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const AssignedComplaints: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { complaints, loading, loadComplaints, updateComplaintStatus, total } = useComplaints({
    autoLoad: false
  });

  useEffect(() => {
    loadComplaints({
      status: statusFilter === 'all' ? undefined : statusFilter,
      priority: priorityFilter === 'all' ? undefined : priorityFilter,
    });
  }, [statusFilter, priorityFilter]);

  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    await updateComplaintStatus(complaintId, newStatus);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'warning';
      case 'in-progress': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'low': return 'default';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'urgent': return 'danger';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout title="Assigned Complaints">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Filter Complaints</h3>
            <p className="text-sm text-gray-600">{total} complaints assigned</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
            <Select
              label="Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={priorityOptions}
            />
          </div>
        </Card>
      </motion.div>

      {/* Complaints List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-400 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading complaints...</p>
            </div>
          ) : complaints.length > 0 ? (
            <div className="space-y-6">
              {complaints.map((complaint) => (
                <motion.div
                  key={complaint._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
                        <Badge variant={getPriorityBadgeVariant(complaint.priority)}>
                          {complaint.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{complaint.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span>Customer: {complaint.createdBy.name}</span>
                        <span>Category: {complaint.category}</span>
                        <span>Created: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <Badge variant={getStatusBadgeVariant(complaint.status)}>
                        {complaint.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                    {complaint.status === 'open' && (
                      <Button
                        onClick={() => handleStatusChange(complaint._id, 'in-progress')}
                        className="flex items-center"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Start Working
                      </Button>
                    )}
                    {complaint.status === 'in-progress' && (
                      <Button
                        onClick={() => handleStatusChange(complaint._id, 'resolved')}
                        variant="success"
                        className="flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Resolved
                      </Button>
                    )}
                    <Button variant="secondary" className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No complaints assigned</h3>
              <p className="text-gray-500">
                {statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'Try adjusting your filters to see more results'
                  : 'You don\'t have any assigned complaints at the moment'
                }
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default AssignedComplaints;