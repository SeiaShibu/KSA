import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import { useComplaints } from '../../hooks/useComplaints';
import { useAuth } from '../../context/AuthContext';

const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const { complaints, loading, loadComplaints } = useComplaints({ limit: 5 });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    if (complaints) {
      setStats({
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'open').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length,
        urgent: complaints.filter(c => c.priority === 'urgent').length
      });
    }
  }, [complaints]);

  const statsCards = [
    { title: 'Assigned Cases', value: stats.total, icon: FileText, color: 'from-blue-400 to-blue-500' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'from-orange-400 to-orange-500' },
    { title: 'In Progress', value: stats.inProgress, icon: Clock, color: 'from-yellow-400 to-yellow-500' },
    { title: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'from-green-400 to-green-500' },
    { title: 'Urgent Cases', value: stats.urgent, icon: AlertTriangle, color: 'from-red-400 to-red-500' }
  ];

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
    <DashboardLayout title={`Welcome, ${user?.name}!`}>
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <div className="text-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Assignments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Assignments</h2>
            <a href="/technician/complaints" className="text-amber-600 hover:text-amber-700 font-medium">
              View All →
            </a>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-400 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading assignments...</p>
            </div>
          ) : complaints.length > 0 ? (
            <div className="space-y-4">
              {complaints.slice(0, 5).map((complaint) => (
                <div key={complaint._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{complaint.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {complaint.description.length > 100 
                          ? `${complaint.description.substring(0, 100)}...`
                          : complaint.description
                        }
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By: {complaint.createdBy.name}</span>
                        <span>Category: {complaint.category}</span>
                        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Badge variant={getStatusBadgeVariant(complaint.status)}>
                        {complaint.status.replace('-', ' ')}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(complaint.priority)}>
                        {complaint.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No assignments yet</p>
            </div>
          )}
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default TechnicianDashboard;