
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-ndis-blue flex items-center justify-center">
              <span className="text-white font-bold">NS</span>
            </div>
            <span className="font-bold text-xl text-ndis-blue">Nomni Support</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-gray-600 hover:text-ndis-blue transition-colors">
              About
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-ndis-blue transition-colors">
              Services
            </Link>
            <Link to="/plans" className="text-gray-600 hover:text-ndis-blue transition-colors">
              Pricing
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-ndis-blue transition-colors">
              Contact
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')} 
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/profile')} 
                  className="flex items-center gap-2"
                >
                  <User size={16} />
                  Profile
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="bg-ndis-blue hover:bg-blue-600"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-6 shadow-md animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/about" 
              onClick={closeMenu}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-ndis-blue rounded-md transition-colors"
            >
              About
            </Link>
            <Link 
              to="/services" 
              onClick={closeMenu}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-ndis-blue rounded-md transition-colors"
            >
              Services
            </Link>
            <Link 
              to="/plans" 
              onClick={closeMenu}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-ndis-blue rounded-md transition-colors"
            >
              Pricing
            </Link>
            <Link 
              to="/contact" 
              onClick={closeMenu}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-ndis-blue rounded-md transition-colors"
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={closeMenu}
                  className="px-3 py-2 flex items-center gap-2 text-gray-600 hover:bg-gray-100 hover:text-ndis-blue rounded-md transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  onClick={closeMenu}
                  className="px-3 py-2 flex items-center gap-2 text-gray-600 hover:bg-gray-100 hover:text-ndis-blue rounded-md transition-colors"
                >
                  <User size={16} />
                  Profile
                </Link>
                <button 
                  onClick={() => { handleLogout(); closeMenu(); }} 
                  className="px-3 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => { navigate('/login'); closeMenu(); }}
                  className="w-full"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => { navigate('/signup'); closeMenu(); }}
                  className="w-full bg-ndis-blue hover:bg-blue-600"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

