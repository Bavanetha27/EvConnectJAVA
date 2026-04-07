import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogIn, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(credentials.email, credentials.password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] w-full flex bg-white overflow-hidden">
            {/* Left side Image/Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden text-white flex-col justify-end p-10 xl:p-16">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                        alt="Corporate Brainstorming Event" 
                        className="object-cover w-full h-full opacity-50 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="relative z-10 max-w-lg mb-4"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/20">
                        <Sparkles size={16} className="text-secondary" />
                        <span className="text-sm font-medium tracking-wide">Premium Event Management</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                        Powering seamless <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Communities</span>.
                    </h2>
                    <p className="text-base text-gray-300 font-light">
                        Log in to coordinate your teams, discover advanced analytics, and manage your upcoming schedule beautifully.
                    </p>
                </motion.div>
            </div>

            {/* Right side Form Panel */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative overflow-hidden bg-gray-50/50">
                {/* Accent blurs */}
                <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-primary/20 rounded-full filter blur-[100px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 bg-accent/20 rounded-full filter blur-[100px]"></div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="w-full max-w-md relative z-10 my-auto"
                >
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
                        <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        name="email" 
                                        type="email" 
                                        required
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white/60 focus:bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm shadow-sm"
                                        placeholder="Enter your email" 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        name="password" 
                                        type="password" 
                                        required
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white/60 focus:bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all sm:text-sm shadow-sm"
                                        placeholder="Enter your password" 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">Remember me</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-primary hover:text-secondary transition-colors">Forgot password?</a>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gray-900 hover:bg-primary shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
                        >
                            {loading ? 'Authenticating...' : 'Sign in to account'}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-primary hover:text-secondary transition-colors">
                            Sign up for free
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
