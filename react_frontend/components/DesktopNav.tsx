
import React, { useState } from 'react';
import { ChevronDown, Briefcase, GraduationCap, Award, Star, Zap, Trophy } from 'lucide-react';
import { ViewState } from '../types';

interface DesktopNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  scrolled: boolean;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ currentView, onNavigate, scrolled }) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const navItemClass = (isActive: boolean) => 
    `text-sm font-medium transition-colors cursor-pointer ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`;

  const handleMegaMenuClick = (view: ViewState) => {
    onNavigate(view);
    setIsMegaMenuOpen(false);
  };

  return (
    <nav className="hidden md:flex items-center gap-6 relative">
      <button 
        onClick={() => onNavigate({ type: 'HOME' })}
        className={navItemClass(currentView.type === 'HOME')}
      >
        Home
      </button>
      <button 
        onClick={() => onNavigate({ type: 'PROJECTS' })}
        className={navItemClass(currentView.type === 'PROJECTS')}
      >
        Projects
      </button>
      <button 
        onClick={() => onNavigate({ type: 'BLOG' })}
        className={navItemClass(currentView.type === 'BLOG')}
      >
        Blog
      </button>
      <button 
        onClick={() => onNavigate({ type: 'GALLERY' })}
        className={navItemClass(currentView.type === 'GALLERY')}
      >
        Gallery
      </button>
      
      {/* Split Profile / Mega Menu Trigger */}
      <div 
        className="relative flex items-center gap-1 group"
        onMouseLeave={() => setIsMegaMenuOpen(false)}
      >
        <button 
          className={navItemClass(currentView.type === 'ABOUT')}
          onClick={() => onNavigate({ type: 'ABOUT' })}
        >
          Profile
        </button>
        <button
          className={`p-1 rounded hover:bg-white/10 transition-colors ${isMegaMenuOpen ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white'}`}
          onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          aria-label="Open profile menu"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Mega Menu Content */}
        {isMegaMenuOpen && (
          <div className="absolute top-full right-0 pt-4 w-[600px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-6 bg-[#18181b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Experience & Education</h3>
                <div onClick={() => handleMegaMenuClick({ type: 'EXPERIENCE' })} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Work Experience</div>
                    <div className="text-xs text-gray-400">Professional career path</div>
                  </div>
                </div>
                <div onClick={() => handleMegaMenuClick({ type: 'EDUCATION' })} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Education</div>
                    <div className="text-xs text-gray-400">Academic background</div>
                  </div>
                </div>
                <div onClick={() => handleMegaMenuClick({ type: 'TESTIMONIALS' })} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 group-hover:text-orange-300">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Testimonials</div>
                    <div className="text-xs text-gray-400">What others say</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills & Recognition</h3>
                <div onClick={() => handleMegaMenuClick({ type: 'SKILLS' })} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-400 group-hover:text-green-300">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Skills</div>
                    <div className="text-xs text-gray-400">Technical proficiency</div>
                  </div>
                </div>
                <div onClick={() => handleMegaMenuClick({ type: 'CERTIFICATES' })} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Certificates</div>
                    <div className="text-xs text-gray-400">Professional validations</div>
                  </div>
                </div>
                <div onClick={() => handleMegaMenuClick({ type: 'ACHIEVEMENTS' })} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400 group-hover:text-yellow-300">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Achievements</div>
                    <div className="text-xs text-gray-400">Honors and recognitions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={() => onNavigate({ type: 'CONTACT' })}
        className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/5"
      >
        Contact Me
      </button>
    </nav>
  );
};
