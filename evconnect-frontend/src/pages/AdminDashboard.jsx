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
    Hash,
    Flag
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
    const [allReports, setAllReports] = useState([]);

    // Modal State
    const [selectedTeam, setSelectedTeam] = useState(null);

    const [stats, setStats] = useState({
        totalEvents: 0,
        totalUsers: 0,
        totalTeams: 0,
        totalRegistrations: 0,
        totalReports: 0
    });

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination States
    const [pages, setPages] = useState({
        events: 0,
        users: 0,
        teams: 0,
        reports: 0
    });
    const [totalPages, setTotalPages] = useState({
        events: 1,
        users: 1,
        teams: 1,
        reports: 1
    });

    const pageSize = 10;

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!user) return; // Wait until user is loaded

            setLoading(true);
            try {
                // We'll fetch stats separately or from the first page responses
                const [eventsRes, usersRes, teamsRes, regRes, reportsRes] = await Promise.all([
                    api.get(`/events/paged?page=${pages.events}&size=${pageSize}`),
                    api.get(`/users/paged?page=${pages.users}&size=${pageSize}`),
                    api.get(`/teams/paged?page=${pages.teams}&size=${pageSize}`),
                    api.get('/registrations'), // Keeping registrations as is for stats
                    api.get('/reports') // Keeping reports as is for now
                ]);

                setAllEvents(eventsRes.data.content);
                setAllUsers(usersRes.data.content);
                setAllTeams(teamsRes.data.content);
                setAllRegistrations(regRes.data);
                setAllReports(reportsRes.data);

                setTotalPages({
                    events: eventsRes.data.totalPages,
                    users: usersRes.data.totalPages,
                    teams: teamsRes.data.totalPages,
                    reports: 1
                });

                setStats({
                    totalEvents: eventsRes.data.totalElements,
                    totalUsers: usersRes.data.totalElements,
                    totalTeams: teamsRes.data.totalElements,
                    totalRegistrations: regRes.data.length,
                    totalReports: reportsRes.data.length
                });
            } catch (err) {
                toast.error('Failed to load administrative data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, [pages]); // Re-fetch when page changes

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("CRITICAL: Are you sure you want to PERMANENTLY delete this event?")) return;
        try {
            await api.delete(`/events/${id}`);
            toast.success("Event permanently purged");
            setAllEvents(allEvents.filter(e => e.id !== id));
            setStats(prev => ({ ...prev, totalEvents: prev.totalEvents - 1 }));
            // Also cleanup reports for this event in UI
            const remainingReports = allReports.filter(r => r.eventId !== id);
            setAllReports(remainingReports);
            setStats(prev => ({ ...prev, totalReports: remainingReports.length }));
        } catch (err) {
            toast.error("Administrative failure: Could not delete event");
        }
    };

    const handleDismissReport = async (id) => {
        try {
            await api.delete(`/reports/${id}`);
            toast.success("Report dismissed successfully");
            setAllReports(allReports.filter(r => r.id !== id));
            setStats(prev => ({ ...prev, totalReports: prev.totalReports - 1 }));
        } catch (err) {
            toast.error("Failed to dismiss report");
        }
    };

    const getEventName = (eventId) => {
        return allEvents.find(e => e.id === eventId)?.title || "Unknown Event";
    };

    const getUserName = (userId) => {
        return allUsers.find(u => u.id === userId)?.username || "Unknown User";
    };

    const getEventOrganizer = (eventId) => {
        const event = allEvents.find(e => e.id === eventId);
        if (!event) return null;
        return allUsers.find(u => u.id === event.organizerId);
    };

    const isNewOrganization = (userId) => {
        if (!userId) return false;
        try {
            const timestamp = parseInt(userId.substring(0, 8), 16) * 1000;
            const userDate = new Date(timestamp);
            const now = new Date();
            const daysDiff = (now - userDate) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7;
        } catch (e) { return false; }
    };

    const filteredData = () => {
        const term = searchTerm.toLowerCase();
        if (activeTab === 'events' || activeTab === 'overview') {
            return allEvents.filter(e => e.title.toLowerCase().includes(term) || e.location.toLowerCase().includes(term));
        } else if (activeTab === 'users') {
            return allUsers.filter(u => u.username.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.role.toLowerCase().includes(term));
        } else if (activeTab === 'teams') {
            return allTeams.filter(t => t.name.toLowerCase().includes(term) || getEventName(t.eventId).toLowerCase().includes(term));
        } else if (activeTab === 'reports') {
            return allReports.filter(r => r.reason.toLowerCase().includes(term) || getEventName(r.eventId).toLowerCase().includes(term));
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
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
        >
            <Icon size={18} /> {label}
        </button>
    );

    const TeamMembersModal = ({ team, onClose }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-gray-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">{team.name}</h3>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">
                            {team.eventName}
                        </p>
                    </div>
                    <div className="bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
                        <span className="text-[10px] font-black text-gray-400 uppercase block">Code</span>
                        <span className="text-sm font-mono font-black text-gray-700">{team.teamCode}</span>
                    </div>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Team Roster</p>
                    {team.members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {member.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">
                                    {member.username}
                                    {member.id === team.leaderId && <span className="ml-2 text-[9px] bg-primary text-white px-1.5 py-0.5 rounded uppercase font-black">Leader</span>}
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono">UID: {member.id.substring(0, 8)}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg"
                >
                    Close
                </button>
            </motion.div>
        </motion.div>
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
                        <StatCard label="Reports" value={stats.totalReports} icon={Flag} color="bg-red-600" />
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 bg-white sticky top-0 z-20 overflow-x-auto">
                            <TabButton id="overview" label="Overview" icon={LayoutDashboard} />
                            <TabButton id="events" label="Manage Events" icon={Calendar} />
                            <TabButton id="users" label="User Directory" icon={Users} />
                            <TabButton id="teams" label="Team Directory" icon={Briefcase} />
                            <TabButton id="reports" label="Reports" icon={Flag} />
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
                                                                <div className="text-xs text-gray-400 font-mono">ID: {event.id.substring(0, 8)}</div>
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
                                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' :
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
                                                                <button
                                                                    onClick={() => setSelectedTeam(t)}
                                                                    className="font-bold text-gray-900 hover:text-primary transition-colors text-left"
                                                                >
                                                                    {t.name}
                                                                </button>
                                                                <div className="text-xs text-gray-400 font-mono">Team ID: {t.id.substring(0, 8)}</div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                                {t.eventName || "Unknown Event"}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                                {t.leaderName || "Unknown Leader"}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <span className="font-bold text-primary">{t.members?.length || 0}</span> Members
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ----- REPORTS TABLE ----- */}
                                    {activeTab === 'reports' && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                                        <th className="px-6 py-4">Report Details</th>
                                                        <th className="px-6 py-4">Event & Organizer</th>
                                                        <th className="px-6 py-4">Reporter</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {filteredData().map(r => {
                                                        const organizer = getEventOrganizer(r.eventId);
                                                        const isNewOrg = isNewOrganization(organizer?.id);

                                                        return (
                                                            <tr key={r.id} className="hover:bg-red-50/20 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={r.reason}>
                                                                        {r.reason}
                                                                    </div>
                                                                    <div className="text-xs text-gray-400 mt-1">
                                                                        {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="font-bold text-gray-900">{r.eventName || "Unknown Event"}</div>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-xs text-gray-500">Event ID: {r.eventId.substring(0, 8)}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                                    {r.username || "Unknown User"}
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <div className="flex justify-end gap-2">
                                                                        <button
                                                                            onClick={() => handleDismissReport(r.id)}
                                                                            className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                                        >
                                                                            Dismiss
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteEvent(r.eventId)}
                                                                            className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                                                                        >
                                                                            Delete Event
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
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

                                    {/* Pagination Controls */}
                                    {['events', 'users', 'teams'].includes(activeTab) && totalPages[activeTab] > 1 && (
                                        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
                                            <div className="text-sm text-gray-500">
                                                Page <span className="font-bold text-gray-900">{pages[activeTab] + 1}</span> of <span className="font-bold text-gray-900">{totalPages[activeTab]}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    disabled={pages[activeTab] === 0}
                                                    onClick={() => setPages(prev => ({ ...prev, [activeTab]: prev[activeTab] - 1 }))}
                                                    className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    disabled={pages[activeTab] >= totalPages[activeTab] - 1}
                                                    onClick={() => setPages(prev => ({ ...prev, [activeTab]: prev[activeTab] + 1 }))}
                                                    className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {selectedTeam && (
                    <TeamMembersModal
                        team={selectedTeam}
                        onClose={() => setSelectedTeam(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
