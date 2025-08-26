import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { useComplaints } from '../../hooks/useComplaints';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { complaints, loading, loadComplaints } = useComplaints({ limit: 5 });
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    if (complaints) {
      setStats({
        total: complaints.length,
        open: complaints.filter(c => c.status === 'open').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length
      });
    }
  }, [complaints]);

  const statsCards = [
    { title: 'Total Complaints', value: stats.total, icon: FileText, color: 'from-blue-400 to-blue-500' },
    { title: 'Open', value: stats.open, icon: Clock, color: 'from-orange-400 to-orange-500' },
    { title: 'In Progress', value: stats.inProgress, icon: Clock, color: 'from-yellow-400 to-yellow-500' },
    { title: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'from-green-400 to-green-500' }
  ];

  return (
    <DashboardLayout title={`Welcome back, ${user?.name}!`}>
      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-amber-400 to-orange-400 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
              <p className="text-amber-100 mb-4">Submit a new complaint and we'll help you resolve it quickly.</p>
              <Link to="/customer/new-complaint">
                <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Plus className="w-5 h-5 mr-2" />
                  New Complaint
                </Button>
              </Link>
            </div>
            <Plus className="w-24 h-24 text-white/20" />
          </div>
        </Card>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Complaints */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Complaints</h2>
            <Link to="/customer/complaints">
              <Button variant="secondary" className="text-sm">
                View All
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-400 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading complaints...</p>
            </div>
          ) : complaints.length > 0 ? (
            <div className="space-y-4">
              {complaints.slice(0, 5).map((complaint) => (
                <div key={complaint._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{complaint.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      complaint.status === 'open' ? 'bg-orange-100 text-orange-800' :
                      complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {complaint.description.length > 100 
                      ? `${complaint.description.substring(0, 100)}...`
                      : complaint.description
                    }
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Category: {complaint.category}</span>
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No complaints yet</p>
              <Link to="/customer/new-complaint">
                <Button>
                  <Plus className="w-5 h-5 mr-2" />
                  Submit Your First Complaint
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;