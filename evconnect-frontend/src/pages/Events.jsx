import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Search, ArrowRight, Filter } from 'lucide-react';
import { toast } from 'react-toastify';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [timeFilter, setTimeFilter] = useState('Upcoming'); // Upcoming, All, Past
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Technology', 'Networking', 'Workshop', 'Music', 'Sports', 'Other'];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (err) {
                toast.error("Failed to load events");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                             e.location.toLowerCase().includes(search.toLowerCase()) ||
                             (e.description && e.description.toLowerCase().includes(search.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
        
        const eventDate = new Date(e.date);
        const now = new Date();
        let matchesTime = true;
        if (timeFilter === 'Upcoming') matchesTime = eventDate >= now;
        else if (timeFilter === 'Past') matchesTime = eventDate < now;
        
        return matchesSearch && matchesCategory && matchesTime;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
                        Discover <span className="text-primary">Events</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl font-medium">
                        Explore and participate in the world's most innovative community gatherings.
                    </p>
                </motion.div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-grow sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search events, cities..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 shadow-xl focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Controls Bar */}
            <div className="mb-12 sticky top-24 z-30 bg-gray-50/80 backdrop-blur-md p-2 rounded-3xl border border-white/50 shadow-sm overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-4">
                    {/* Category Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                        <Filter size={18} className="text-gray-400 mr-2 shrink-0" />
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                                    selectedCategory === cat 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Time Filter Segments */}
                    <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-inner shrink-0">
                        {['Upcoming', 'All', 'Past'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setTimeFilter(filter)}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    timeFilter === filter 
                                    ? 'bg-gray-900 text-white shadow-md' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Event Grid */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {[1, 2, 3, 4, 5, 6].map(skeleton => (
                            <div key={skeleton} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-2xl w-full"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-24 bg-gray-200 rounded w-full mt-4"></div>
                            </div>
                        ))}
                    </motion.div>
                ) : filteredEvents.length === 0 ? (
                    <motion.div 
                        key="no-results"
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100"
                    >
                        <div className="mx-auto w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                            <Search size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No matching events</h3>
                        <p className="text-gray-500 mb-8">We couldn't find any events matching your current filters.</p>
                        <button 
                            onClick={() => { setSelectedCategory('All'); setSearch(''); setTimeFilter('Upcoming'); }}
                            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
                        >
                            Reset All Filters
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="grid"
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredEvents.map((event, i) => (
                            <motion.div 
                                key={event.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl hover:ring-1 hover:ring-primary/10 transition-all duration-500 flex flex-col"
                            >
                                <div className="h-64 rounded-[2rem] bg-gray-100 relative overflow-hidden flex items-center justify-center mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/40 to-transparent z-10"></div>
                                    <h3 className="text-4xl font-black text-white/20 select-none uppercase tracking-tighter transform -rotate-12 group-hover:scale-125 transition-transform duration-700">
                                        {event.category || 'EVENT'}
                                    </h3>
                                    
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-white">
                                            {event.category || 'General'}
                                        </span>
                                    </div>
                                    
                                    <div className="absolute bottom-6 left-6 z-20 flex flex-col items-start">
                                        <div className="flex items-center gap-2 text-white/90 mb-1">
                                            <Calendar size={14} className="text-primary" />
                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/90">
                                            <MapPin size={14} className="text-accent" />
                                            <span className="text-xs font-bold">{event.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-4 pb-4 flex-grow flex flex-col">
                                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed">
                                        {event.description}
                                    </p>
                                    
                                    <Link 
                                        to={`/events/${event.id}`} 
                                        className="mt-auto w-full inline-flex justify-center items-center py-4 px-6 rounded-2xl text-sm font-black text-white bg-gray-900 group-hover:bg-primary transition-all shadow-xl group-hover:shadow-primary/40 active:scale-[0.98]"
                                    >
                                        Explore Details <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Events;
