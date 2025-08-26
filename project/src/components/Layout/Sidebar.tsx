import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3,
  MessageSquare,
  UserCog,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: `/${user?.role}` }
    ];

    switch (user?.role) {
      case 'customer':
        return [
          ...baseItems,
          { icon: Plus, label: 'New Complaint', path: '/customer/new-complaint' },
          { icon: FileText, label: 'My Complaints', path: '/customer/complaints' }
        ];
      
      case 'technician':
        return [
          ...baseItems,
          { icon: FileText, label: 'Assigned Complaints', path: '/technician/complaints' }
        ];
      
      case 'admin':
        return [
          ...baseItems,
          { icon: FileText, label: 'All Complaints', path: '/admin/complaints' },
          { icon: Users, label: 'Manage Technicians', path: '/admin/technicians' },
          { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
          { icon: UserCog, label: 'Create User', path: '/admin/create-user' }
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-amber-50/90 to-orange-50/90 backdrop-blur-lg border-r border-amber-200/50 z-40"
    >
      <div className="flex flex-col h-full">
        {/* Logo and User Info */}
        <div className="p-6 border-b border-amber-200/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">ComplaintDesk</h2>
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-medium rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-white/60 hover:shadow-md'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-amber-200/50">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;