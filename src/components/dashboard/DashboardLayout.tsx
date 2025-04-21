
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  User, 
  Calendar, 
  DollarSign, 
  Users, 
  Settings, 
  Menu, 
  X,
  MessageSquare,
  Search,
  Bell,
  ClipboardCheck
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading, userRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Determine sidebar menus based on user role
  const getNavItems = () => {
    const commonItems = [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: User, label: 'Profile', path: '/profile' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const roleItems = {
      'participant': [
        { icon: Search, label: 'Find Support', path: '/find-support' },
        { icon: Calendar, label: 'My Schedule', path: '/schedule' },
        { icon: ClipboardCheck, label: 'My Goals', path: '/goals' },
      ],
      'caregiver': [
        { icon: Users, label: 'Participants', path: '/participants' },
        { icon: Calendar, label: 'Schedule', path: '/schedule' },
        { icon: MessageSquare, label: 'Messages', path: '/messages' },
      ],
      'support-worker': [
        { icon: Calendar, label: 'My Shifts', path: '/shifts' },
        { icon: Users, label: 'My Clients', path: '/clients' },
        { icon: DollarSign, label: 'Payments', path: '/payments' },
      ],
      'service-provider': [
        { icon: Users, label: 'Clients', path: '/clients' },
        { icon: Calendar, label: 'Bookings', path: '/bookings' },
        { icon: DollarSign, label: 'Revenue', path: '/revenue' },
      ],
      'admin': [
        { icon: Users, label: 'Users', path: '/users' },
        { icon: DollarSign, label: 'Subscriptions', path: '/subscriptions' },
        { icon: ClipboardCheck, label: 'Reports', path: '/reports' },
      ],
    };

    return [...(roleItems[userRole || 'participant'] || []), ...commonItems];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <Button 
            onClick={toggleSidebar} 
            size="icon" 
            variant="ghost"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-ndis-blue flex items-center justify-center">
              <span className="text-white font-bold text-xs">AS</span>
            </div>
            <span className="font-bold text-lg text-ndis-blue">AccessSupport</span>
          </Link>
          
          <Button 
            size="icon" 
            variant="ghost"
          >
            <Bell size={20} />
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-ndis-blue flex items-center justify-center">
              <span className="text-white font-bold">AS</span>
            </div>
            <span className="font-bold text-xl text-ndis-blue">AccessSupport</span>
          </Link>
        </div>
        
        {/* User info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={currentUser?.profilePicture} />
              <AvatarFallback className="bg-ndis-light-blue text-white">
                {currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 capitalize">
                {userRole?.replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={`
                flex items-center gap-2 p-3 rounded-lg w-full text-left
                ${location.pathname === item.path
                  ? 'bg-ndis-blue text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
