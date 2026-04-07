import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Redirect if already logged in as admin
    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            navigate('/admin');
        }
    }, [user, navigate]);

    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(credentials.email, credentials.password);
            
            // Check if the user is actually an admin after logging in
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser.role !== 'ADMIN') {
                toast.error('Access denied. Admin privileges required.');
                // We might want to logout or just show error
                return;
            }
            
            toast.success('Welcome back, Administrator!');
            navigate('/admin');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-accent p-0.5 mb-6 shadow-2xl shadow-primary/20">
                        <div className="w-full h-full bg-gray-900 rounded-[14px] flex items-center justify-center">
                            <Shield className="text-white" size={40} strokeWidth={1.5} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Admin Portal</h1>
                    <p className="text-gray-400">Restricted access for system administrators only.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    name="email" 
                                    type="email" 
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="admin@evconnect.com" 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Security Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input 
                                    name="password" 
                                    type="password" 
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="••••••••" 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-secondary shadow-lg shadow-primary/20 transition-all disabled:opacity-50 group"
                        >
                            {loading ? 'Verifying Credentials...' : 'Authenticate'}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-xs text-amber-200/70 leading-relaxed">
                            Every login attempt is logged. Unauthorized access is strictly prohibited and monitored.
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/admin/signup" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Need an admin account? <span className="text-primary">Request Access</span>
                    </Link>
                </div>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-xs text-gray-600 hover:text-gray-400 uppercase tracking-widest font-bold transition-colors">
                        &larr; Back to Public Site
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
