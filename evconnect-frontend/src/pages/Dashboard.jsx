import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Calendar, XCircle, PlusCircle, Users, Activity, Loader2, MapPin, Trash2, Tag, CheckSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tickets');
    
    // Data States
    const [registrations, setRegistrations] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [teams, setTeams] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form States
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '', category: 'Technology' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        if (user.role === 'ADMIN') {
            navigate('/admin');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch user specific registrations and teams and all global events
                const [regRes, teamsRes, eventsRes] = await Promise.all([
                    api.get('/registrations/me'),
                    api.get('/teams/me'),
                    api.get('/events')
                ]);
                
                setRegistrations(regRes.data);
                setTeams(teamsRes.data);
                setAllEvents(eventsRes.data);
                
                // Set authored events if applicable
                if (user.role === 'ORGANIZER' || user.role === 'ADMIN') {
                    const authored = eventsRes.data.filter(e => e.organizerId === user.id || user.role === 'ADMIN');
                    setMyEvents(authored);
                }
            } catch (err) {
                toast.error('Failed to synchronize dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, navigate]);

    const getEventName = (eventId) => {
        return allEvents.find(e => e.id === eventId)?.title || `Event #${eventId.substring(0,5)}`;
    };

    const handleCancelRegistration = async (id) => {
        try {
            await api.delete(`/registrations/${id}`);
            toast.success("Ticket cancelled successfully");
            setRegistrations(registrations.filter(r => r.id !== id));
        } catch (err) {
            toast.error("Error cancelling registration");
        }
    };

    const handleDeleteEvent = async (id) => {
        if(!window.confirm("Are you sure you want to delete this event permanently?")) return;
        try {
            await api.delete(`/events/${id}`);
            toast.success("Event permanently deleted");
            setMyEvents(myEvents.filter(e => e.id !== id));
        } catch (err) {
            toast.error("Error deleting event");
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.post('/events', {
                ...formData,
                date: new Date(formData.date).toISOString() // Convert to valid ISO string for Spring Boot
            });
            toast.success("Event broadcasted successfully!");
            setMyEvents([res.data, ...myEvents]);
            setShowCreateForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: 'Technology' });
            setActiveTab('organizer');
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create event");
        } finally {
            setSubmitting(false);
        }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => { setActiveTab(id); setShowCreateForm(false); }}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 ${
                activeTab === id 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
        >
            <Icon size={18} /> {label}
        </button>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-gray-900 pb-24 pt-12 px-4 sm:px-6 lg:px-8 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center p-1 shadow-xl">
                        <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                            <span className="text-3xl font-extrabold text-white">{user?.username.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user?.username}</h1>
                        <p className="text-gray-400 font-medium tracking-wide flex items-center gap-2">
                            <ShieldCheck size={16} /> {user?.role} Account
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="-mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
                    
                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-100 overflow-x-auto bg-white sticky top-0 z-20">
                        <TabButton id="tickets" label="My Tickets" icon={Calendar} />
                        <TabButton id="teams" label="My Teams" icon={Users} />
                        {(user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
                            <TabButton id="organizer" label="Organizer Hub" icon={Activity} />
                        )}
                    </div>

                    {/* Tab Contents */}
                    <div className="p-8 flex-grow bg-gray-50/30">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab + (showCreateForm ? 'form' : 'list')}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* ---- TICKETS TAB ---- */}
                                {activeTab === 'tickets' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900">Digital Tickets</h2>
                                            <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">
                                                {registrations.length} Active
                                            </span>
                                        </div>
                                        
                                        {registrations.length === 0 ? (
                                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                                <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                                <p className="text-gray-500 font-medium">You haven't reserved any tickets yet.</p>
                                                <Link to="/events" className="mt-4 inline-flex items-center font-semibold text-primary hover:text-secondary p-2">
                                                    Discover Events &rarr;
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {registrations.map(reg => (
                                                    <div key={reg.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
                                                        <h4 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2 line-clamp-1">
                                                            <CheckSquare size={18} className="text-green-500 shrink-0" /> <span className="truncate">{getEventName(reg.eventId)}</span>
                                                        </h4>
                                                        <p className="text-sm text-gray-500 mb-6 bg-gray-50 px-3 py-1.5 rounded-lg font-mono">
                                                            Reg ID: {reg.id.substring(0,8)}
                                                        </p>
                                                        
                                                        <div className="mt-auto flex justify-between items-end border-t border-gray-100 pt-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {reg.status}
                                                            </span>
                                                            <button 
                                                                onClick={() => handleCancelRegistration(reg.id)}
                                                                className="text-red-500 text-sm font-semibold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex gap-1 items-center"
                                                            >
                                                                <XCircle size={16} /> Void
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ---- TEAMS TAB ---- */}
                                {activeTab === 'teams' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900">My Network Teams</h2>
                                        </div>
                                        {teams.length === 0 ? (
                                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                                <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                                <p className="text-gray-500 font-medium">You aren't part of any community teams.</p>
                                                <p className="text-sm text-gray-400 mt-2">Go to an Event's page to join or create teams!</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {teams.map(team => (
                                                    <div key={team.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{team.name}</h4>
                                                                <span className="text-xs font-mono text-gray-400">Team #{team.id.substring(0,6)} <span className="text-indigo-500 font-semibold">{team.leaderId === user?.id ? '(Leader)' : '(Member)'}</span></span>
                                                            </div>
                                                            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md">
                                                                {team.members?.length || 0} Members
                                                            </span>
                                                        </div>

                                                        {/* Team creation and addition has been migrated to the standalone Event Details page */}

                                                        <div className="bg-gray-50 p-4 rounded-xl mt-auto border border-gray-100">
                                                            <p className="text-sm text-gray-600 font-medium flex items-center gap-2 mb-2 line-clamp-1 truncate">
                                                                <Tag size={14} className="text-gray-400 shrink-0" /> Linked to {getEventName(team.eventId)}
                                                            </p>
                                                            <Link to={`/events/${team.eventId}`} className="text-sm font-bold text-primary hover:text-secondary">
                                                                Visit Event Directory &rarr;
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ---- ORGANIZER HUB TAB ---- */}
                                {activeTab === 'organizer' && (
                                    <div className="space-y-6">
                                        {showCreateForm ? (
                                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                                        <PlusCircle className="text-primary" /> Create New Event
                                                    </h2>
                                                    <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-gray-600 font-medium text-sm px-4 py-2 hover:bg-gray-50 rounded-lg">
                                                        Cancel
                                                    </button>
                                                </div>
                                                
                                                <form onSubmit={handleCreateEvent} className="space-y-6 max-w-3xl">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="col-span-full">
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
                                                            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="e.g. Global Tech Summit 2026"/>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Date and Time</label>
                                                            <input type="datetime-local" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"/>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                                            <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="e.g. San Francisco, CA"/>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Event Category</label>
                                                            <select 
                                                                required 
                                                                value={formData.category} 
                                                                onChange={e => setFormData({...formData, category: e.target.value})} 
                                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow bg-white"
                                                            >
                                                                <option value="Technology">Technology</option>
                                                                <option value="Networking">Networking</option>
                                                                <option value="Workshop">Workshop</option>
                                                                <option value="Music">Music</option>
                                                                <option value="Sports">Sports</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-span-full">
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                                            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="Detailed description of your beautiful event..."></textarea>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end pt-4">
                                                        <button disabled={submitting} type="submit" className="bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50">
                                                            {submitting ? 'Publishing...' : 'Publish Event Application'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-center mb-6">
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-gray-900">Authored Events</h2>
                                                        <p className="text-gray-500 font-medium mt-1">Manage events you've created.</p>
                                                    </div>
                                                    <button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-full hover:bg-primary transition-colors hover:shadow-lg font-semibold text-sm">
                                                        <PlusCircle size={18} /> New Broadcast
                                                    </button>
                                                </div>

                                                {myEvents.length === 0 ? (
                                                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                                        <Activity className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                                        <p className="text-gray-500 font-medium">You haven't authored any events yet.</p>
                                                    </div>
                                                ) : (
                                                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Event details</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date Scheduled</th>
                                                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-100">
                                                                {myEvents.map(event => (
                                                                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                                                        <td className="px-6 py-4">
                                                                            <div className="font-bold text-gray-900">{event.title}</div>
                                                                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                                                <MapPin size={12} /> {event.location}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                                                            {new Date(event.date).toLocaleDateString()}
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                                            <Link to={`/events/${event.id}`} className="text-primary hover:text-secondary font-bold mr-4">View</Link>
                                                                            <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 inline-flex">
                                                                                <Trash2 size={16} /> Delete
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            
            {/* Mock Dashboard Footer Padding */}
            <div className="h-12 w-full"></div>
        </div>
    );
};

// Simple ShieldCheck icon shim
const ShieldCheck = ({size}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
);

export default Dashboard;
