import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UserPlus, Users } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Select from '../../components/UI/Select';
import { usersAPI } from '../../services/api';
import { CreateUserFormData } from '../../types';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().required('Role is required').oneOf(['technician', 'admin'], 'Invalid role'),
});

const roleOptions = [
  { value: '', label: 'Select a role' },
  { value: 'technician', label: 'Technician' },
  { value: 'admin', label: 'Administrator' }
];

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateUserFormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setIsSubmitting(true);
      await usersAPI.create(data);
      toast.success('User created successfully');
      reset();
      navigate('/admin/technicians');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Create New User">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl flex items-center justify-center mr-4">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Create New User</h2>
                <p className="text-gray-600">Add a new technician or administrator</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                {...register('name')}
                label="Full Name"
                placeholder="Enter full name"
                error={errors.name?.message}
                required
              />

              <Input
                {...register('email')}
                type="email"
                label="Email Address"
                placeholder="Enter email address"
                error={errors.email?.message}
                required
              />

              <Input
                {...register('password')}
                type="password"
                label="Password"
                placeholder="Enter password (minimum 6 characters)"
                error={errors.password?.message}
                required
              />

              <Select
                {...register('role')}
                label="User Role"
                options={roleOptions}
                error={errors.role?.message}
                required
              />

              {/* Role Descriptions */}
              <div className="bg-amber-50/80 rounded-xl p-4">
                <h4 className="font-medium text-amber-800 mb-3">Role Descriptions:</h4>
                <div className="space-y-2 text-sm text-amber-700">
                  <div className="flex items-start">
                    <Users className="w-4 h-4 mr-2 mt-0.5 text-amber-600" />
                    <div>
                      <strong>Technician:</strong> Can view and manage assigned complaints, update complaint status, and add notes.
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-4 h-4 mr-2 mt-0.5 text-amber-600" />
                    <div>
                      <strong>Administrator:</strong> Full system access including user management, complaint assignment, and analytics.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/admin')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="flex-1"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create User
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CreateUser;