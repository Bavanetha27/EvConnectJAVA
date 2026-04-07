import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Share2, Users, Globe, Mail, Heart } from 'lucide-react';

const Footer = () => {
    const location = useLocation();
    if (['/login', '/register'].includes(location.pathname)) return null;

    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">E</span>
                            </div>
                            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                                EvConnect
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            The ultimate community platform for organizing, discovering, and coordinating events seamlessly across the globe.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Share2 size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Users size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Globe size={20} /></a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><Link to="/events" className="text-sm text-gray-500 hover:text-primary transition-colors">Browse Events</Link></li>
                            <li><Link to="/login" className="text-sm text-gray-500 hover:text-primary transition-colors">Organizer Hub</Link></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">API Features</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Community Guidelines</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Partners</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} EvConnect Inc. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                        Crafted with <Heart size={14} className="text-red-500 fill-red-500" /> for global communities
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
