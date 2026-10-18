import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Briefcase, BookOpen, Grid, File, ArrowUp, GraduationCap, Zap, Award, Star, Mail, Trophy } from 'lucide-react';
import { ViewState } from '../types';
import { pathFromView } from '../utils/helpers';

interface MobileNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainItems: { icon: any; label: string; view: ViewState['type'] }[] = [
    { icon: Home, label: 'Home', view: 'HOME' },
    { icon: File, label: 'Projects', view: 'PROJECTS' },
    { icon: BookOpen, label: 'Blog', view: 'BLOG' },
    { icon: Mail, label: 'Contact', view: 'CONTACT' },
  ];

  const menuItems: { icon: any; label: string; view: ViewState['type']; color: string; bg: string }[] = [
    { icon: Briefcase, label: 'Experience', view: 'EXPERIENCE', color: 'text-black', bg: 'bg-[#eeeeee]' },
    { icon: GraduationCap, label: 'Education', view: 'EDUCATION', color: 'text-black', bg: 'bg-[#eeeeee]' },
    { icon: Zap, label: 'Skills', view: 'SKILLS', color: 'text-black', bg: 'bg-[#eeeeee]' },
    { icon: Award, label: 'Certificates', view: 'CERTIFICATES', color: 'text-black', bg: 'bg-[#eeeeee]' },
    { icon: Trophy, label: 'Achievements', view: 'ACHIEVEMENTS', color: 'text-black', bg: 'bg-[#eeeeee]' },
    { icon: Grid, label: 'Gallery', view: 'GALLERY', color: 'text-black', bg: 'bg-[#eeeeee]' },
    { icon: Star, label: 'Testimonials', view: 'TESTIMONIALS', color: 'text-black', bg: 'bg-[#eeeeee]' },
    { icon: Mail, label: 'Contact', view: 'CONTACT', color: 'text-black', bg: 'bg-[#eeeeee]' },
  ];

  const handleNavigate = (view: ViewState) => {
    setIsMenuOpen(false);
    onNavigate(view);
  };

  return (
    <>
      {/* Menu Popup */}
      {isMenuOpen && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-white border border-[#E5E5E5] rounded-[2rem] p-4 shadow-none">
            <div className="grid grid-cols-2 gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={pathFromView({ type: item.view } as ViewState)}
                  onClick={() => handleNavigate({ type: item.view } as ViewState)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f3f3f3] transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-black">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          {/* Overlay to close */}
          <div className="fixed inset-0 -z-10" onClick={() => setIsMenuOpen(false)}></div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-[20px] border border-[#cfc4c5]/50 rounded-full p-2 shadow-none">
          {mainItems.map((item) => {
            const isActive = currentView.type === item.view || (currentView.type.startsWith(item.view) && item.view !== 'HOME');
            return (
              <Link
                key={item.label}
                to={pathFromView({ type: item.view } as ViewState)}
                onClick={() => { setIsMenuOpen(false); onNavigate({ type: item.view } as ViewState); }}
                className={`relative p-3 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-black text-white shadow-none' : 'text-[#7e7576] hover:text-black hover:bg-[#eeeeee]'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black inline-flex items-center justify-center`}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="w-5 h-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`relative p-3 rounded-full transition-all duration-300 ${
              isMenuOpen ? 'bg-[#eeeeee] text-black' : 'text-[#7e7576] hover:text-black hover:bg-[#eeeeee]'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black`}
            aria-expanded={isMenuOpen}
            aria-label="Toggle mobile menu"
          >
            <ArrowUp className="w-5 h-5" />
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
};
