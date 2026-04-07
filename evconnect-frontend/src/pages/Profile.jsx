import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
    User, 
    Mail, 
    Lock, 
    Shield, 
    Save, 
    Key, 
    UserCircle, 
    ChevronRight,
    Camera,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || ''
    });
    
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username,
                email: user.email
            });
        }
    }, [user]);

    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    const updateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/users/me', profileData);
            setUser({ ...user, ...res.data });
            localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }));
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('New passwords do not match');
        }
        
        setUpdatingPassword(true);
        try {
            await api.post('/users/me/password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password changed successfully');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setUpdatingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
                    <p className="text-gray-500">Manage your profile information and security preferences.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Brief Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="relative mb-6 group">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shadow-xl">
                                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-primary overflow-hidden">
                                        <User size={64} strokeWidth={1} />
                                    </div>
                                </div>
                                <button className="absolute bottom-0 right-0 p-2.5 bg-gray-900 text-white rounded-full border-4 border-white hover:bg-primary transition-colors shadow-lg">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user?.username}</h2>
                            <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
                            <div className="w-full pt-6 border-t border-gray-50">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    user?.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' :
                                    user?.role === 'ORGANIZER' ? 'bg-amber-100 text-amber-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    <Shield size={12} className="mr-1.5" /> {user?.role}
                                </span>
                            </div>
                        </section>

                        <section className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold mb-2 flex items-center gap-2">
                                    <Shield size={18} className="text-primary" /> Security Tip
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Use a unique password and enable 2FA where possible to keep your EvConnect account secure.
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                        </section>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Info Form */}
                        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <UserCircle size={20} className="text-primary" /> Personal Information
                                </h3>
                            </div>
                            <form onSubmit={updateProfile} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User size={18} className="text-gray-400" />
                                            </div>
                                            <input 
                                                name="username"
                                                type="text" 
                                                value={profileData.username}
                                                onChange={handleProfileChange}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail size={18} className="text-gray-400" />
                                            </div>
                                            <input 
                                                name="email"
                                                type="email" 
                                                value={profileData.email}
                                                onChange={handleProfileChange}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-primary transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Password Change Form */}
                        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Key size={20} className="text-accent" /> Password Management
                                </h3>
                            </div>
                            <form onSubmit={changePassword} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-gray-400" />
                                        </div>
                                        <input 
                                            name="oldPassword"
                                            type="password" 
                                            required
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Key size={18} className="text-gray-400" />
                                            </div>
                                            <input 
                                                name="newPassword"
                                                type="password" 
                                                required
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock size={18} className="text-gray-400" />
                                            </div>
                                            <input 
                                                name="confirmPassword"
                                                type="password" 
                                                required
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        type="submit" 
                                        disabled={updatingPassword}
                                        className="flex items-center gap-2 px-8 py-3 bg-accent/10 text-accent font-bold rounded-xl hover:bg-accent hover:text-white transition-all disabled:opacity-50"
                                    >
                                        {updatingPassword ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
