import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'USER' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData.username, formData.email, formData.password, formData.role);
            toast.success('Registration successful! Please sign in.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] w-full flex bg-white flex-row-reverse overflow-hidden">
            {/* Right side Branding Panel (Reversed for variation from login) */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-indigo-900 text-white flex-col justify-center p-10 xl:p-16">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                        alt="High Tech Registration Business Workflow" 
                        className="object-cover w-full h-full opacity-40 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent"></div>
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="relative z-10 max-w-lg mb-4 mt-auto"
                >
                    <h2 className="text-3xl xl:text-5xl font-extrabold mb-4 xl:mb-6 leading-tight">
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-yellow-300">Movement</span>.
                    </h2>
                    <p className="text-base xl:text-lg text-indigo-100 font-light mb-6">
                        Whether you're organizing massive conferences or simply looking to join local meetups, EvConnect provides the absolute best platform for engagement.
                    </p>
                    
                    <div className="flex gap-4 items-center">
                        <div className="flex -space-x-3">
                            <img className="w-10 h-10 rounded-full border-2 border-primary" src="https://i.pravatar.cc/100?img=1" alt="Face 1" />
                            <img className="w-10 h-10 rounded-full border-2 border-primary" src="https://i.pravatar.cc/100?img=2" alt="Face 2" />
                            <img className="w-10 h-10 rounded-full border-2 border-primary" src="https://i.pravatar.cc/100?img=3" alt="Face 3" />
                            <div className="w-10 h-10 rounded-full border-2 border-primary bg-white text-primary font-bold flex justify-center items-center text-xs">+2k</div>
                        </div>
                        <p className="text-sm font-medium text-indigo-200">Organizers trusting us</p>
                    </div>
                </motion.div>
            </div>

            {/* Left side Form Panel */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative overflow-hidden bg-gray-50/50">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="w-full max-w-md relative z-10 my-auto"
                >
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1.5">Create an account</h1>
                        <p className="text-gray-500 text-sm">Join EvConnect and find your community today.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Grouped Username & Email dynamically on wider screens */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input 
                                        name="username" 
                                        type="text" 
                                        required
                                        className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white/60 focus:bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm shadow-sm"
                                        placeholder="Username" 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input 
                                        name="email" 
                                        type="email" 
                                        required
                                        className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white/60 focus:bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm shadow-sm"
                                        placeholder="Email address" 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    name="password" 
                                    type="password" 
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white/60 focus:bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm shadow-sm"
                                    placeholder="Create a strong password" 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Account Type</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <ShieldCheck className="h-5 w-5 text-gray-400" />
                                </div>
                                <select 
                                    name="role" 
                                    value={formData.role} 
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white focus:bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm shadow-sm appearance-none"
                                >
                                    <option value="USER">Participant (Attendee)</option>
                                    <option value="ORGANIZER">Event Organizer</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-secondary shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                <UserPlus className="mr-2 h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:text-secondary transition-colors">
                            Sign in here
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
