import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Users, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import { complaintsAPI } from '../../services/api';
import { DashboardAnalytics } from '../../types';
import toast from 'react-hot-toast';

const COLORS = ['#FBA600', '#F97316', '#EF4444', '#10B981'];

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await complaintsAPI.getAnalytics();
        setAnalytics(data);
      } catch (error: any) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-400 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="text-center py-8">
          <p className="text-gray-600">Failed to load analytics data</p>
        </div>
      </DashboardLayout>
    );
  }

  const statsCards = [
    { 
      title: 'Total Complaints', 
      value: analytics.overview.totalComplaints, 
      icon: FileText, 
      color: 'from-blue-400 to-blue-500',
      change: '+12%'
    },
    { 
      title: 'Open Cases', 
      value: analytics.overview.openComplaints, 
      icon: Clock, 
      color: 'from-orange-400 to-orange-500',
      change: '-5%'
    },
    { 
      title: 'In Progress', 
      value: analytics.overview.inProgressComplaints, 
      icon: AlertTriangle, 
      color: 'from-yellow-400 to-yellow-500',
      change: '+8%'
    },
    { 
      title: 'Resolved', 
      value: analytics.overview.resolvedComplaints, 
      icon: CheckCircle, 
      color: 'from-green-400 to-green-500',
      change: '+15%'
    }
  ];

  const categoryData = analytics.complaintsByCategory.map(item => ({
    name: item._id,
    value: item.count
  }));

  const priorityData = analytics.complaintsByPriority.map(item => ({
    name: item._id,
    value: item.count
  }));

  const monthlyData = analytics.monthlyTrend.map(item => ({
    month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
    complaints: item.count
  }));

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Statistics Cards */}
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
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Complaints by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaints by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Complaints by Priority */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaints by Priority</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Complaints Trend</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="complaints" fill="#FBA600" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;