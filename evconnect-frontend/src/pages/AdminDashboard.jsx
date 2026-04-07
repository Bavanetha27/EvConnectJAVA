import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
    LayoutDashboard, 
    Calendar, 
    Users, 
    ShieldCheck, 
    PlusCircle, 
    Trash2, 
    Settings, 
    Activity, 
    Loader2, 
    Globe, 
    TrendingUp, 
    Search,
    AlertTriangle,
    Eye,
    Briefcase,
    Mail,
    UserCircle,
    Hash
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    
    // Data States
    const [allEvents, setAllEvents] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allTeams, setAllTeams] = useState([]);
    const [allRegistrations, setAllRegistrations] = useState([]);
    
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalUsers: 0,
        totalTeams: 0,
        totalRegistrations: 0
    });
    
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAdminData = async () => {
            setLoading(true);
            try {
                const [eventsRes, usersRes, teamsRes, regRes] = await Promise.all([
                    api.get('/events'),
                    api.get('/users'),
                    api.get('/teams'),
                    api.get('/registrations')
                ]);
                
                setAllEvents(eventsRes.data);
                setAllUsers(usersRes.data);
                setAllTeams(teamsRes.data);
                setAllRegistrations(regRes.data);
                
                setStats({
                    totalEvents: eventsRes.data.length,
                    totalUsers: usersRes.data.length,
                    totalTeams: teamsRes.data.length,
                    totalRegistrations: regRes.data.length
                });
            } catch (err) {
                toast.error('Failed to load administrative data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const handleDeleteEvent = async (id) => {
        if(!window.confirm("CRITICAL: Are you sure you want to PERMANENTLY delete this event?")) return;
        try {
            await api.delete(`/events/${id}`);
            toast.success("Event permanently purged");
            setAllEvents(allEvents.filter(e => e.id !== id));
            setStats(prev => ({ ...prev, totalEvents: prev.totalEvents - 1 }));
        } catch (err) {
            toast.error("Administrative failure: Could not delete event");
        }
    };

    const getEventName = (eventId) => {
        return allEvents.find(e => e.id === eventId)?.title || "Unknown Event";
    };

    const getUserName = (userId) => {
        return allUsers.find(u => u.id === userId)?.username || "Unknown User";
    };

    const filteredData = () => {
        const term = searchTerm.toLowerCase();
        if (activeTab === 'events' || activeTab === 'overview') {
            return allEvents.filter(e => e.title.toLowerCase().includes(term) || e.location.toLowerCase().includes(term));
        } else if (activeTab === 'users') {
            return allUsers.filter(u => u.username.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.role.toLowerCase().includes(term));
        } else if (activeTab === 'teams') {
            return allTeams.filter(t => t.name.toLowerCase().includes(term) || getEventName(t.eventId).toLowerCase().includes(term));
        }
        return [];
    };

    const StatCard = ({ label, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                    <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-90`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
            </div>
        </div>
    );

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => { setActiveTab(id); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 ${
                activeTab === id 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
        >
            <Icon size={18} /> {label}
        </button>
    );

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-primary mb-4" size={48} />
            <p className="text-gray-500 font-medium animate-pulse">Initializing Command Center...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="bg-primary text-white p-2 rounded-lg">
                        <ShieldCheck size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Admin Control Panel</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">{user?.username}</p>
                        <p className="text-xs text-primary font-bold uppercase tracking-widest">Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-primary font-bold">
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                </div>
            </header>

            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard label="Total Events" value={stats.totalEvents} icon={Calendar} color="bg-blue-600" />
                        <StatCard label="Global Users" value={stats.totalUsers} icon={Users} color="bg-purple-600" />
                        <StatCard label="Active Teams" value={stats.totalTeams} icon={Activity} color="bg-emerald-600" />
                        <StatCard label="Registrations" value={stats.totalRegistrations} icon={Hash} color="bg-amber-600" />
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 bg-white sticky top-0 z-20 overflow-x-auto">
                            <TabButton id="overview" label="Overview" icon={LayoutDashboard} />
                            <TabButton id="events" label="Manage Events" icon={Calendar} />
                            <TabButton id="users" label="User Directory" icon={Users} />
                            <TabButton id="teams" label="Team Directory" icon={Briefcase} />
                        </div>

                        {/* Search & Content Area */}
                        <div className="p-6 flex-grow flex flex-col">
                            <div className="mb-6 flex justify-between items-center">
                                <div className="relative w-full max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder={`Search ${activeTab}...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-grow"
                                >
                                    {/* ----- OVERVIEW / EVENTS TABLE ----- */}
                                    {(activeTab === 'overview' || activeTab === 'events') && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                                        <th className="px-6 py-4">Event Identity</th>
                                                        <th className="px-6 py-4">Category</th>
                                                        <th className="px-6 py-4">Location</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {filteredData().map(event => (
                                                        <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="font-bold text-gray-900">{event.title}</div>
                                                                <div className="text-xs text-gray-400 font-mono">ID: {event.id.substring(0,8)}</div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase rounded border border-gray-200">
                                                                    {event.category || 'General'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-600">{event.location}</td>
                                                            <td className="px-6 py-4">
                                                                <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100">ACTIVE</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Link to={`/events/${event.id}`} className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg">
                                                                        <Eye size={18} />
                                                                    </Link>
                                                                    <button 
                                                                        onClick={() => handleDeleteEvent(event.id)}
                                                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors hover:bg-red-50 rounded-lg"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ----- USERS TABLE ----- */}
                                    {activeTab === 'users' && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                                        <th className="px-6 py-4">User</th>
                                                        <th className="px-6 py-4">Role</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Access</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {filteredData().map(u => (
                                                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                                        {u.username.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-gray-900">{u.username}</div>
                                                                        <div className="text-xs text-gray-500">{u.email}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                                    u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 
                                                                    u.role === 'ORGANIZER' ? 'bg-amber-100 text-amber-700' : 
                                                                    'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                    {u.role}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-1.5 text-green-600 text-[10px] font-bold">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div> VERIFIED
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <span className="text-xs text-gray-400 italic">View Only</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ----- TEAMS TABLE ----- */}
                                    {activeTab === 'teams' && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                                        <th className="px-6 py-4">Team Details</th>
                                                        <th className="px-6 py-4">Linked Event</th>
                                                        <th className="px-6 py-4">Leader</th>
                                                        <th className="px-6 py-4 text-right">Size</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {filteredData().map(t => (
                                                        <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="font-bold text-gray-900">{t.name}</div>
                                                                <div className="text-xs text-gray-400 font-mono">Team ID: {t.id.substring(0,8)}</div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                                {getEventName(t.eventId)}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                                {getUserName(t.leaderId)}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <span className="font-bold text-primary">{t.memberIds.length}</span> Members
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {filteredData().length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                            <AlertTriangle size={48} className="mb-4 opacity-20" />
                                            <p className="font-bold">No results found in {activeTab}</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
