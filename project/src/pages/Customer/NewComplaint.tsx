import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Send, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Select from '../../components/UI/Select';
import { useComplaints } from '../../hooks/useComplaints';
import { ComplaintFormData } from '../../types';

const schema = yup.object({
  title: yup.string().required('Title is required').min(10, 'Title must be at least 10 characters'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
  category: yup.string().required('Category is required'),
  priority: yup.string().required('Priority is required'),
});

const categoryOptions = [
  { value: '', label: 'Select a category' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'billing', label: 'Billing Issue' },
  { value: 'service', label: 'Service Issue' },
  { value: 'general', label: 'General Inquiry' }
];

const priorityOptions = [
  { value: '', label: 'Select priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const NewComplaint: React.FC = () => {
  const navigate = useNavigate();
  const { createComplaint } = useComplaints();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ComplaintFormData>({
    resolver: yupResolver(schema)
  });

  const description = watch('description');

  const onSubmit = async (data: ComplaintFormData) => {
    try {
      setIsSubmitting(true);
      await createComplaint(data);
      navigate('/customer/complaints');
    } catch (error) {
      // Error handled by useComplaints hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Submit New Complaint">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl flex items-center justify-center mr-4">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">New Complaint</h2>
                <p className="text-gray-600">Describe your issue and we'll help you resolve it</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                {...register('title')}
                label="Complaint Title"
                placeholder="Brief summary of your issue"
                error={errors.title?.message}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  {...register('category')}
                  label="Category"
                  options={categoryOptions}
                  error={errors.category?.message}
                  required
                />

                <Select
                  {...register('priority')}
                  label="Priority"
                  options={priorityOptions}
                  error={errors.priority?.message}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description')}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200"
                  placeholder="Provide detailed information about your issue..."
                />
                <div className="flex justify-between items-center">
                  {errors.description && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 ml-auto">
                    {description?.length || 0} characters
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/80 rounded-xl p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">Tips for Better Resolution</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Be specific about when the issue started</li>
                      <li>• Include any error messages you've seen</li>
                      <li>• Mention steps you've already tried</li>
                      <li>• Provide relevant account or reference numbers</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/customer')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="flex-1"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit Complaint
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default NewComplaint;