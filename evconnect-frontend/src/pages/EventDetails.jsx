import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
    Calendar, 
    MapPin, 
    ArrowLeft, 
    Users, 
    CheckCircle, 
    PlusCircle, 
    UserPlus, 
    AlertCircle, 
    Lock, 
    Trash2, 
    UserMinus,
    RefreshCw,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [teams, setTeams] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    
    // Team management states
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [teamCode, setTeamCode] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const isRegistered = registrations.some(r => r.userId === user?.id && r.eventId === id && r.status === 'CONFIRMED');
    const myTeam = teams.find(t => t.members?.some(m => m.id === user?.id));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, teamsRes, regRes] = await Promise.all([
                    api.get(`/events/${id}`),
                    api.get(`/teams/event/${id}`),
                    api.get('/registrations/me')
                ]);
                setEvent(eventRes.data);
                setTeams(teamsRes.data);
                setRegistrations(regRes.data);
            } catch (err) {
                toast.error("Error loading event resources");
                navigate('/events');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleRegister = async () => {
        if (!user) {
            toast.info("Please login to register");
            navigate('/login');
            return;
        }
        setRegistering(true);
        try {
            await api.post(`/registrations/${id}`);
            toast.success("Successfully registered for event!");
            // Refresh registrations
            const regRes = await api.get('/registrations/me');
            setRegistrations(regRes.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Already registered or error occurred");
        } finally {
            setRegistering(false);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!isRegistered) {
            toast.warning("You must register for the event before creating a team");
            return;
        }
        setActionLoading(true);
        try {
            const res = await api.post('/teams', { name: teamName, eventId: id });
            setTeams([...teams, res.data]);
            toast.success("Team created successfully!");
            setShowCreateForm(false);
            setTeamName('');
        } catch (err) {
            toast.error(err.response?.data?.message || "Error creating team");
        } finally {
            setActionLoading(false);
        }
    };

    const handleJoinByCode = async (e) => {
        e.preventDefault();
        if (!isRegistered) {
            toast.warning("You must register for the event before joining a team");
            return;
        }
        setActionLoading(true);
        try {
            const res = await api.post('/teams/join-code', { teamCode });
            setTeams(teams.some(t => t.id === res.data.id) 
                ? teams.map(t => t.id === res.data.id ? res.data : t)
                : [...teams, res.data]
            );
            toast.success("Successfully joined the team!");
            setShowJoinForm(false);
            setTeamCode('');
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid code or already in a team");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveMember = async (teamId, memberId) => {
        if (!window.confirm("Remove this member from the team?")) return;
        try {
            const res = await api.delete(`/teams/${teamId}/members/${memberId}`);
            setTeams(teams.map(t => t.id === teamId ? res.data : t));
            toast.success("Member removed successfully");
        } catch (err) {
            toast.error("Failed to remove member");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-gray-500 font-medium">Synchronizing Event Data...</p>
                </div>
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Hero Section */}
            <div className="bg-gray-900 pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                         className="object-cover w-full h-full opacity-30 mix-blend-overlay" alt="Event Cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <button onClick={() => navigate('/events')} className="inline-flex items-center text-sm font-bold text-gray-300 hover:text-white transition-colors mb-10 bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20">
                        <ArrowLeft className="mr-2 h-4 w-4" /> All Events
                    </button>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl mb-8">
                            {event.title}
                        </h1>
                        <div className="flex flex-wrap gap-4 items-center">
                            <span className="px-4 py-2 rounded-xl bg-primary/20 text-indigo-200 border border-primary/30 font-bold text-sm">
                                {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 border border-white/10 font-medium text-sm flex items-center gap-2">
                                <MapPin size={16} /> {event.location}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Left Column: Description & Teams */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Event Details Card */}
                        <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <AlertCircle className="text-primary" size={28} /> About Event
                            </h3>
                            <div className="prose max-w-none text-gray-600 leading-relaxed text-lg">
                                {event.description}
                            </div>
                        </section>

                        {/* Team Coordination Section */}
                        <section className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <Users className="text-accent" size={28} /> Team Collaboration
                                    </h3>
                                    <p className="text-gray-500 mt-1">One team per user. Join by code or create your own.</p>
                                </div>
                            </div>

                            {/* Team Action Buttons */}
                            {!myTeam && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => { setShowCreateForm(true); setShowJoinForm(false); }}
                                        className="flex items-center justify-center gap-3 p-6 bg-white border-2 border-dashed border-gray-200 rounded-3xl hover:border-primary hover:bg-primary/5 transition-all group"
                                    >
                                        <PlusCircle size={24} className="text-primary group-hover:scale-110 transition-transform" />
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900">Create New Team</p>
                                            <p className="text-xs text-gray-500">Be the leader of your squad</p>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => { setShowJoinForm(true); setShowCreateForm(false); }}
                                        className="flex items-center justify-center gap-3 p-6 bg-white border-2 border-dashed border-gray-200 rounded-3xl hover:border-accent hover:bg-accent/5 transition-all group"
                                    >
                                        <Lock size={24} className="text-accent group-hover:rotate-12 transition-transform" />
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900">Join with Code</p>
                                            <p className="text-xs text-gray-500">Enter a 6-digit team code</p>
                                        </div>
                                    </button>
                                </div>
                            )}

                            {/* Conditional Forms */}
                            <AnimatePresence>
                                {showCreateForm && !myTeam && (
                                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-4">
                                            <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                                        </div>
                                        <h4 className="text-lg font-bold mb-6">Create Your Team</h4>
                                        <form onSubmit={handleCreateTeam} className="flex flex-col sm:flex-row gap-4">
                                            <input 
                                                required 
                                                autoFocus
                                                placeholder="Enter a creative team name..." 
                                                value={teamName}
                                                onChange={(e) => setTeamName(e.target.value)}
                                                className="flex-1 px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-lg"
                                            />
                                            <button 
                                                disabled={actionLoading}
                                                className="bg-primary hover:bg-secondary text-white font-black py-4 px-10 rounded-2xl shadow-lg transition-all disabled:opacity-50"
                                            >
                                                {actionLoading ? 'Initializing...' : 'Form Team'}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}

                                {showJoinForm && !myTeam && (
                                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white p-8 rounded-3xl border border-accent/30 shadow-xl overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-4">
                                            <button onClick={() => setShowJoinForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                                        </div>
                                        <h4 className="text-lg font-bold mb-6">Join a Team</h4>
                                        <form onSubmit={handleJoinByCode} className="flex flex-col sm:flex-row gap-4">
                                            <input 
                                                required 
                                                autoFocus
                                                maxLength={6}
                                                placeholder="Enter 6-digit Code (e.g. ABC123)" 
                                                value={teamCode}
                                                onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                                                className="flex-1 px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all text-lg tracking-[0.5em] font-mono text-center"
                                            />
                                            <button 
                                                disabled={actionLoading}
                                                className="bg-accent hover:bg-accent/80 text-white font-black py-4 px-10 rounded-2xl shadow-lg transition-all disabled:opacity-50"
                                            >
                                                {actionLoading ? 'Verifying...' : 'Join Now'}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Teams Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {teams.map((team) => {
                                    const isMyTeam = team.members?.some(m => m.id === user?.id);
                                    const isLeader = team.leaderId === user?.id;
                                    
                                    return (
                                        <motion.div 
                                            key={team.id}
                                            layout
                                            className={`bg-white rounded-[2rem] p-8 border-2 transition-all ${
                                                isMyTeam ? 'border-primary shadow-lg ring-4 ring-primary/5' : 'border-gray-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h4 className="text-xl font-black text-gray-900 group flex items-center gap-2">
                                                        {team.name}
                                                        {isLeader && <ShieldCheck className="text-indigo-500" size={18} />}
                                                    </h4>
                                                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                                        {team.members?.length || 0} Participants
                                                    </p>
                                                </div>
                                                {isLeader && (
                                                    <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100 flex flex-col items-center">
                                                        <span className="text-[10px] font-black uppercase opacity-60">Team Code</span>
                                                        <span className="text-sm font-mono font-black tracking-wider">{team.teamCode}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                {team.members?.map((member) => (
                                                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group/item">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400">
                                                                {member.username.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="text-sm font-semibold text-gray-700">
                                                                {member.username}
                                                                {member.id === team.leaderId && <span className="ml-2 text-[10px] text-primary italic font-bold">Leader</span>}
                                                            </span>
                                                        </div>
                                                        {isLeader && member.id !== team.leaderId && (
                                                            <button 
                                                                onClick={() => handleRemoveMember(team.id, member.id)}
                                                                className="opacity-0 group-hover/item:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            >
                                                                <UserMinus size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {isMyTeam ? (
                                                <div className="w-full py-3 bg-primary/10 text-primary text-center rounded-2xl text-sm font-black border border-primary/20">
                                                    YOU ARE IN THIS TEAM
                                                </div>
                                            ) : (
                                                <div className="w-full py-3 bg-gray-50 text-gray-400 text-center rounded-2xl text-xs font-bold italic">
                                                    Join via code to participate
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {teams.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                    <Users className="mx-auto text-gray-200 mb-6" size={64} strokeWidth={1} />
                                    <p className="text-gray-500 font-bold text-xl">No active teams yet</p>
                                    <p className="text-gray-400 text-sm mt-2">Be the first to start a movement for this event.</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Sticky Sidebar */}
                    <aside className="w-full lg:sticky lg:top-28">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-indigo-50"
                        >
                            <h3 className="text-2xl font-black text-gray-900 mb-8 pb-4 border-b border-gray-100">Event Pass</h3>
                            
                            <div className="space-y-8 mb-10">
                                <div className="flex gap-4 items-start">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 shadow-inner">
                                        <Calendar size={28} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Schedule</p>
                                        <p className="text-gray-500 text-sm mt-1">{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        <p className="text-primary text-xs font-black mt-1 uppercase tracking-tighter">{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0 shadow-inner">
                                        <MapPin size={28} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Venue</p>
                                        <p className="text-gray-500 text-sm mt-1 leading-snug">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            {isRegistered ? (
                                <div className="w-full py-5 flex items-center justify-center gap-3 bg-green-50 text-green-700 rounded-3xl font-black text-lg border-2 border-green-100">
                                    <CheckCircle size={24} /> Registered
                                </div>
                            ) : (
                                <button 
                                    onClick={handleRegister} 
                                    disabled={registering || (user?.role === 'ADMIN')}
                                    className="w-full bg-gray-900 hover:bg-primary text-white py-5 px-8 rounded-3xl font-black text-lg transition-all shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {registering ? (
                                        <span className="flex items-center justify-center gap-3 italic">
                                            <RefreshCw className="animate-spin" size={18} /> Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-3">
                                            {user?.role === 'ADMIN' ? 'Admin Restricted' : 'Secure Ticket'}
                                            <ArrowLeft className="rotate-180 group-hover:translate-x-2 transition-transform" />
                                        </span>
                                    )}
                                </button>
                            )}

                            {!isRegistered && (
                                <p className="text-[10px] text-gray-400 text-center mt-6 font-bold uppercase tracking-widest leading-relaxed">
                                    Registration is required before <br /> team participation is enabled
                                </p>
                            )}
                        </motion.div>
                    </aside>

                </div>
            </div>
        </div>
    );
};

export default EventDetails;
