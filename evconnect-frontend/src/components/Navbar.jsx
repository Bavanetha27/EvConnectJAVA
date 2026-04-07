import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Calendar, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setProfileDropdownOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
    ];

    if (user) {
        if (user.role === 'ADMIN') {
            navLinks.push({ name: 'Admin Portal', path: '/admin' });
        } else {
            navLinks.push({ name: 'Dashboard', path: '/dashboard' });
        }
    }

    return (
        <header 
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-2xl font-extrabold text-gray-900 tracking-tight hidden sm:block">
                            EvConnect
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                            return (
                                <Link 
                                    key={link.name} 
                                    to={link.path}
                                    className={`relative text-sm font-semibold transition-colors duration-200 ${
                                        isActive ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full" layoutId="underline" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Authentication / User Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center gap-2 focus:outline-none group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                                        <User size={20} />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 select-none">
                                        {user.username}
                                    </span>
                                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {profileDropdownOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 origin-top-right"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                                <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    {user.role}
                                                </span>
                                            </div>
                                            <div className="py-1 border-b border-gray-50">
                                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors font-medium">
                                                    My Profile
                                                </Link>
                                                {user.role !== 'ADMIN' && (
                                                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                                                        Dashboard
                                                    </Link>
                                                )}
                                                {user.role === 'ADMIN' && (
                                                    <Link to="/admin" className="block px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                                                        Admin Portal
                                                    </Link>
                                                )}
                                                <button 
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                                >
                                                    <LogOut size={16} /> Sign out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
                                    Sign in
                                </Link>
                                <Link to="/register" className="text-sm font-semibold text-white bg-gray-900 hover:bg-primary px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95">
                                    Create account
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center">
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-100 bg-white shadow-xl overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`block px-3 py-3 rounded-md text-base font-medium ${
                                        location.pathname === link.path 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user && (
                                <Link
                                    to="/profile"
                                    className={`block px-3 py-3 rounded-md text-base font-medium ${
                                        location.pathname === '/profile' 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    My Profile
                                </Link>
                            )}
                        </div>
                        
                        <div className="pt-4 pb-6 border-t border-gray-100">
                            {user ? (
                                <div className="px-5">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div className="text-base font-medium text-gray-800">{user.username}</div>
                                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <LogOut size={20} /> Sign out
                                    </button>
                                </div>
                            ) : (
                                <div className="px-5 flex flex-col gap-3">
                                    <Link 
                                        to="/register"
                                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-secondary"
                                    >
                                        Sign up free
                                    </Link>
                                    <Link 
                                        to="/login"
                                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
