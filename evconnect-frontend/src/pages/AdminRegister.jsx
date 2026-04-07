import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield, User, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminRegister = () => {
    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // Redirect if already logged in as admin
    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            navigate('/admin');
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            // Forcing role to ADMIN
            await register(formData.username, formData.email, formData.password, 'ADMIN');
            toast.success('Admin account requested! Please login.');
            navigate('/admin/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 overflow-hidden relative py-12 px-4">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px] -ml-40 -mt-40"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] -mr-40 -mb-40"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 mb-5">
                        <Shield className="text-primary" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Enrollment</h1>
                    <p className="text-gray-400">Initialize your administrative credentials.</p>
                </div>

                <div className="bg-white p-1 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gray-900/95 backdrop-blur-xl rounded-[calc(1.5rem-4px)] p-8 sm:p-10">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Display Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input 
                                        name="username" 
                                        type="text" 
                                        required
                                        className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                        placeholder="Full Name" 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-2">Admin Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input 
                                        name="email" 
                                        type="email" 
                                        required
                                        className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                        placeholder="admin@evconnect.com" 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 mb-2">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input 
                                            name="password" 
                                            type="password" 
                                            required
                                            className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            placeholder="••••••••" 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 mb-2">Confirm</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input 
                                            name="confirmPassword" 
                                            type="password" 
                                            required
                                            className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            placeholder="••••••••" 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="flex items-center gap-3 mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                    <CheckCircle2 className="text-primary shrink-0" size={20} />
                                    <p className="text-xs text-gray-400 leading-tight">
                                        By registering, you acknowledge your role as a system operator and agree to maintain platform integrity.
                                    </p>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-4 px-4 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-xl shadow-primary/20 transition-all disabled:opacity-50 group hover:shadow-primary/30"
                                >
                                    {loading ? 'Processing Enrollment...' : 'Register as Administrator'}
                                    {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    Already have an admin account?{' '}
                    <Link to="/admin/login" className="font-bold text-white hover:text-primary transition-colors">
                        Sign in here
                    </Link>
                </div>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-xs text-gray-600 hover:text-gray-400 uppercase tracking-widest font-bold transition-colors">
                        &larr; Return to Homepage
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminRegister;
