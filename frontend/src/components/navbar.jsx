import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, BookOpen, FileText, ClipboardList, Calendar, GraduationCap, Settings, LogOut, X, CreditCard, Bell, Headphones } from 'lucide-react';

export default function Navbar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const profileButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route matches the item route
  const isActiveRoute = (route) => {
    return location.pathname === route || (route === '/dashboard' && location.pathname === '/');
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const sidebarItems = [
    { icon: User, label: 'User Profile', colorClass: 'text-blue-500', route: '/profile' },
    { icon: BookOpen, label: 'Academic', colorClass: 'text-green-500', route: '/dashboard' },
    { icon: Bell, label: 'Announcement', colorClass: 'text-purple-500', route: '/notice-board' },
    { icon: CreditCard, label: 'Fee Management', colorClass: 'text-orange-500', route: '/fee-management' },
    { icon: FileText, label: 'Examination', colorClass: 'text-yellow-500', route: '/examination' },
    { icon: ClipboardList, label: 'Assignment', colorClass: 'text-red-500', route: '/assignment' },
    { icon: Calendar, label: 'Attendance', colorClass: 'text-purple-500', route: '/attendance' },
    { icon: GraduationCap, label: 'Results', colorClass: 'text-cyan-500', route: '/results' },
    { icon: Headphones, label: 'Helpdesk', colorClass: 'text-pink-500', route: '/helpdesk' },
    { icon: Settings, label: 'Settings', colorClass: 'text-gray-500', route: '/settings' },
    { icon: LogOut, label: 'Logout', colorClass: 'text-red-600', route: '/login' },
  ];

  // Animation variants
  const sidebarVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const menuItemVariants = {
    hidden: { 
      x: 50, 
      opacity: 0 
    },
    visible: (index) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: index * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    })
  };

  const profileAvatarVariants = {
    hidden: { 
      scale: 0, 
      rotate: -180 
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  const headerVariants = {
    hidden: { 
      y: -50, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="flex items-center justify-between px-8 py-2 bg-gray-50 h-16 shadow-lg relative z-50"
      >
        {/* Logo */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
          className="flex items-center"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 cursor-pointer" onClick={() => navigate('/')}
          >
            <span className="text-white font-bold text-xl">BW</span>
          </motion.div>
          <span className="font-bold text-xl text-gray-800">Byte walkers</span>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
          className="flex-1 flex justify-center"
        >
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' }}
            type="text"
            placeholder="Search..."
            className="w-80 px-4 py-2 rounded-full border border-gray-300 outline-none text-sm transition-all duration-200 focus:border-blue-400"
          />
        </motion.div>

        {/* Profile Button */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 25 }}
        >
          <motion.button 
            ref={profileButtonRef}
            onClick={toggleSidebar}
            whileHover={{ scale: 1.1, backgroundColor: 'rgb(229, 231, 235)' }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              backgroundColor: isSidebarOpen ? 'rgb(229, 231, 235)' : 'transparent',
              rotate: isSidebarOpen ? 180 : 0
            }}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-200"
          >
            <User size={24} className="text-gray-800" />
          </motion.button>
        </motion.div>
      </motion.nav>

      {/* Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black bg-opacity-30 z-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            ref={sidebarRef}
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 right-0 w-80 h-screen bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Sidebar Header */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={headerVariants}
              className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50"
            >
              <h2 className="text-xl font-bold text-gray-800">
                Dashboard Menu
              </h2>
              <motion.button
                onClick={toggleSidebar}
                whileHover={{ scale: 1.1, backgroundColor: 'rgb(229, 231, 235)', rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
              >
                <X size={20} className="text-gray-600" />
              </motion.button>
            </motion.div>

            {/* User Info Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
              className="p-6 border-b border-gray-200 text-center"
            >
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={profileAvatarVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center cursor-pointer"
              >
                <User size={40} className="text-white" />
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg font-bold text-gray-800 mb-2"
              >
                Student Name
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 text-sm"
              >
                Roll No: 12345
              </motion.p>
            </motion.div>

            {/* Menu Items */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="py-4"
            >
              {sidebarItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.button
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={menuItemVariants}
                    whileHover={{ 
                      backgroundColor: 'rgb(248, 249, 250)',
                      x: 10,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-6 py-4 cursor-pointer flex items-center text-base text-left transition-colors duration-200 ${
                      isActiveRoute(item.route) 
                        ? 'bg-green-100 text-green-800 border-r-4 border-green-500' 
                        : 'bg-transparent hover:bg-gray-50 text-gray-800'
                    }`}
                    onClick={() => {
                      console.log(`Clicked on ${item.label}`);
                      navigate(item.route);
                      setSidebarOpen(false);
                    }}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="w-6 h-6 mr-4 flex items-center justify-center"
                    >
                      <IconComponent size={20} className={item.colorClass} />
                    </motion.div>
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="px-6 py-4 border-t border-gray-200 mt-auto bg-gray-50"
            >
              <p className="text-xs text-gray-600 text-center">
                © 2025 ERP by AK
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}