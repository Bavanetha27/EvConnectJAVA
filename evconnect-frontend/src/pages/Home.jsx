import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users, Globe, PlayCircle, Star, Shield, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div className="w-full flex justify-center items-center flex-col overflow-hidden">
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] w-full flex flex-col justify-center items-center pt-20 pb-32">
                {/* Ambient Background Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center z-10 p-12 sm:p-20 max-w-5xl w-full mx-4 relative"
                >
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary font-bold text-sm tracking-wide shadow-sm backdrop-blur-md">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        EvConnect Platform 2.0
                    </div>
                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight mb-8 leading-[1.1]">
                        Bring your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-glow">Community</span> together.
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                        The ultimate infrastructure for organizers and attendees. Discover, manage, and scale your global events seamlessly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <Link to="/events" className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gray-900 rounded-full overflow-hidden transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative flex items-center gap-2">Explore Events <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                        </Link>
                        <Link to="/register" className="w-full sm:w-auto group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-white border-2 border-gray-200 rounded-full transition-all shadow-sm hover:shadow-md hover:border-gray-900 hover:scale-105 active:scale-95">
                            <span className="flex items-center gap-2"><PlayCircle size={20} className="text-primary" /> View Demo</span>
                        </Link>
                    </div>

                    {/* Stats mini-banner */}
                    <div className="mt-20 pt-10 border-t border-gray-200/60 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="text-4xl font-black text-gray-900">2M+</h4>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Attendees</p>
                        </div>
                        <div>
                            <h4 className="text-4xl font-black text-gray-900">10k+</h4>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Organizers</p>
                        </div>
                        <div>
                            <h4 className="text-4xl font-black text-gray-900">150+</h4>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Locations</p>
                        </div>
                        <div>
                            <h4 className="text-4xl font-black text-gray-900">99%</h4>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Uptime</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* DASHBOARD PREVIEW IMAGE SECTION */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-gray-100 bg-white"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                        alt="EvConnect Interactive Dashboard Layout" 
                        className="w-full h-auto object-cover"
                    />
                </motion.div>
            </section>

            {/* FEATURES SECTION */}
            <section className="w-full py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-3">Enterprise Features</h2>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Everything you need to scale perfectly.</h3>
                        <p className="text-xl text-gray-500 font-light">Stop piecing together tools. EvConnect provides a unified suite for digital ticketing, local networking, and organizer tracking.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="glass p-10 rounded-3xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-interior">
                                <Calendar size={28} />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-4">Smart Ticketing</h4>
                            <p className="text-gray-600 leading-relaxed font-medium">Issue digital passes instantly, track registration limits, and allow users one-click cancellations without customer support.</p>
                        </div>
                        
                        <div className="glass p-10 rounded-3xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-6 shadow-interior">
                                <Users size={28} />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-4">Team Coordination</h4>
                            <p className="text-gray-600 leading-relaxed font-medium">Allow attendees to form squads natively via the event UI. Increase engagement by 40% through built-in active networking.</p>
                        </div>

                        <div className="glass p-10 rounded-3xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-interior">
                                <Shield size={28} />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-4">Organizer Auth</h4>
                            <p className="text-gray-600 leading-relaxed font-medium">Enterprise-grade security using JWT standards allowing robust, isolated event authoring and strict analytics protection.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="w-full py-32 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Trusted by top industry leaders globally.</h2>
                            <p className="text-xl text-gray-400 font-light">See why community leaders migrate their infrastructure entirely to EvConnect.</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                            <span className="w-3 h-3 rounded-full bg-gray-700 inline-block"></span>
                            <span className="w-3 h-3 rounded-full bg-gray-700 inline-block"></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10">
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-yellow-500 text-yellow-500" />)}
                            </div>
                            <p className="text-lg font-medium text-gray-300 mb-8 italic">"Moving our European tech summit to EvConnect increased our registration retention by 35%. The UI is simply flawless."</p>
                            <div className="flex items-center gap-4">
                                <img src="https://i.pravatar.cc/150?img=32" alt="Face" className="w-12 h-12 rounded-full" />
                                <div>
                                    <h5 className="font-bold text-white">Sarah Jenkins</h5>
                                    <p className="text-sm text-gray-400">Head of Events, TechCorp</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10">
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-yellow-500 text-yellow-500" />)}
                            </div>
                            <p className="text-lg font-medium text-gray-300 mb-8 italic">"The team coordinating feature alone is worth the switch. Attendees love building their squads قبل the doors even open."</p>
                            <div className="flex items-center gap-4">
                                <img src="https://i.pravatar.cc/150?img=11" alt="Face" className="w-12 h-12 rounded-full" />
                                <div>
                                    <h5 className="font-bold text-white">Michael Chen</h5>
                                    <p className="text-sm text-gray-400">Founder, LocalNet</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hidden lg:block">
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-yellow-500 text-yellow-500" />)}
                            </div>
                            <p className="text-lg font-medium text-gray-300 mb-8 italic">"A stunning, blazing fast platform that makes me look like a professional organizer effortlessly."</p>
                            <div className="flex items-center gap-4">
                                <img src="https://i.pravatar.cc/150?img=47" alt="Face" className="w-12 h-12 rounded-full" />
                                <div>
                                    <h5 className="font-bold text-white">Elena Rostova</h5>
                                    <p className="text-sm text-gray-400">Indie Developer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="w-full py-32 bg-gradient-to-br from-primary via-indigo-600 to-accent text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <Zap size={48} className="mx-auto mb-8 text-yellow-300" />
                    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight">Ready to level up your events?</h2>
                    <p className="text-2xl font-light text-white/90 mb-12 max-w-2xl mx-auto">Join thousands of organizers and millions of attendees on the premium network.</p>
                    <Link to="/register" className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-primary bg-white rounded-full hover:scale-105 transition-transform shadow-2xl">
                        Get Started for Free
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
