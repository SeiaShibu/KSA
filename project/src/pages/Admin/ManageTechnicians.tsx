import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Mail } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import { usersAPI } from '../../services/api';
import { User } from '../../types';
import toast from 'react-hot-toast';

const ManageTechnicians: React.FC = () => {
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll({ role: 'technician' });
      setTechnicians(response.users);
    } catch (error: any) {
      toast.error('Failed to load technicians');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await usersAPI.toggleStatus(id);
      await loadTechnicians();
      toast.success('Technician status updated');
    } catch (error: any) {
      toast.error('Failed to update technician status');
    }
  };

  return (
    <DashboardLayout title="Manage Technicians">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-amber-600 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">Technicians</h2>
                <p className="text-gray-600">Manage technician accounts and permissions</p>
              </div>
            </div>
            <Button onClick={() => window.location.href = '/admin/create-user'}>
              Add Technician
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-400 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading technicians...</p>
            </div>
          ) : technicians.length > 0 ? (
            <div className="space-y-4">
              {technicians.map((technician) => (
                <motion.div
                  key={technician.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{technician.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{technician.email}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Joined: {technician.createdAt ? new Date(technician.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge variant={technician.isActive ? 'success' : 'danger'}>
                        {technician.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      
                      <Button
                        onClick={() => handleToggleStatus(technician.id)}
                        variant={technician.isActive ? 'danger' : 'success'}
                        className="flex items-center"
                      >
                        {technician.isActive ? (
                          <>
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No technicians found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first technician account</p>
              <Button onClick={() => window.location.href = '/admin/create-user'}>
                Add First Technician
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default ManageTechnicians;