import React, { useState } from 'react';
import { ChevronDown, Briefcase, GraduationCap, Award, Star, Zap, Trophy } from 'lucide-react';
import { ViewState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface DesktopNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  scrolled: boolean;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ currentView, onNavigate, scrolled }) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const isViewActive = (type: ViewState['type']) => {
    if (type === 'PROJECTS') return currentView.type === 'PROJECTS' || currentView.type === 'PROJECT_DETAIL';
    if (type === 'BLOG') return currentView.type === 'BLOG' || currentView.type === 'BLOG_DETAIL';
    if (type === 'EXPERIENCE') return currentView.type === 'EXPERIENCE' || currentView.type === 'EXPERIENCE_DETAIL';
    if (type === 'EDUCATION') return currentView.type === 'EDUCATION' || currentView.type === 'EDUCATION_DETAIL';
    if (type === 'SKILLS') return currentView.type === 'SKILLS' || currentView.type === 'SKILL_DETAIL';
    if (type === 'CERTIFICATES') return currentView.type === 'CERTIFICATES' || currentView.type === 'CERTIFICATE_DETAIL';
    if (type === 'ACHIEVEMENTS') return currentView.type === 'ACHIEVEMENTS' || currentView.type === 'ACHIEVEMENT_DETAIL';
    if (type === 'TESTIMONIALS') return currentView.type === 'TESTIMONIALS' || currentView.type === 'TESTIMONIAL_DETAIL';
    return currentView.type === type;
  };

  const isExploreActive = 
    isViewActive('EXPERIENCE') || 
    isViewActive('EDUCATION') || 
    isViewActive('TESTIMONIALS') || 
    isViewActive('SKILLS') || 
    isViewActive('CERTIFICATES') || 
    isViewActive('ACHIEVEMENTS');

  const handleMegaMenuClick = (view: ViewState) => {
    onNavigate(view);
    setIsMegaMenuOpen(false);
  };

  return (
    <nav className="hidden md:flex items-center gap-1.5 relative">
      {/* Home Link */}
      <button 
        onClick={() => onNavigate({ type: 'HOME' })}
        className={`relative px-3.5 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${
          isViewActive('HOME') ? 'text-white' : 'text-gray-400 hover:text-white'
        }`}
        aria-current={isViewActive('HOME') ? 'page' : undefined}
      >
        <span className="relative z-10">Home</span>
        {isViewActive('HOME') && (
          <motion.span 
            layoutId="activeNavBackground"
            className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-inner"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>

      {/* Projects Link */}
      <button 
        onClick={() => onNavigate({ type: 'PROJECTS' })}
        className={`relative px-3.5 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${
          isViewActive('PROJECTS') ? 'text-white' : 'text-gray-400 hover:text-white'
        }`}
        aria-current={isViewActive('PROJECTS') ? 'page' : undefined}
      >
        <span className="relative z-10">Projects</span>
        {isViewActive('PROJECTS') && (
          <motion.span 
            layoutId="activeNavBackground"
            className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-inner"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>

      {/* Blog Link */}
      <button 
        onClick={() => onNavigate({ type: 'BLOG' })}
        className={`relative px-3.5 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${
          isViewActive('BLOG') ? 'text-white' : 'text-gray-400 hover:text-white'
        }`}
        aria-current={isViewActive('BLOG') ? 'page' : undefined}
      >
        <span className="relative z-10">Blog</span>
        {isViewActive('BLOG') && (
          <motion.span 
            layoutId="activeNavBackground"
            className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-inner"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>

      {/* Gallery Link */}
      <button 
        onClick={() => onNavigate({ type: 'GALLERY' })}
        className={`relative px-3.5 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${
          isViewActive('GALLERY') ? 'text-white' : 'text-gray-400 hover:text-white'
        }`}
        aria-current={isViewActive('GALLERY') ? 'page' : undefined}
      >
        <span className="relative z-10">Gallery</span>
        {isViewActive('GALLERY') && (
          <motion.span 
            layoutId="activeNavBackground"
            className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-inner"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>
      
      {/* Reconstructed Dropdown Trigger */}
      <div 
        className="relative flex items-center"
        onMouseLeave={() => setIsMegaMenuOpen(false)}
      >
        <button
          className={`relative px-3.5 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${
            isExploreActive || isMegaMenuOpen ? 'text-white' : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          aria-expanded={isMegaMenuOpen}
          aria-haspopup="true"
          aria-label="Open explore menu"
        >
          <span className="relative z-10 flex items-center gap-1">
            Explore 
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
          </span>
          {isExploreActive && (
            <motion.span 
              layoutId="activeNavBackground"
              className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-inner"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        {/* Mega Menu Content using framer-motion */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full right-0 pt-4 w-[560px] z-50 origin-top-right"
            >
              <div className="relative p-6 bg-[#09090b]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(59,130,246,0.05)] overflow-hidden">
                {/* Visual Ambient Glows inside Mega Menu */}
                <div className="absolute -top-10 -right-10 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative grid grid-cols-2 gap-6 z-10">
                  {/* Left Column: Career & Background */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-3 mb-1">Career & Background</h3>
                    
                    <div 
                      onClick={() => handleMegaMenuClick({ type: 'EXPERIENCE' })} 
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-transparent hover:border-white/5"
                    >
                      <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.35)]">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Work Experience</div>
                        <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">Professional path & career history</div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => handleMegaMenuClick({ type: 'EDUCATION' })} 
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-transparent hover:border-white/5"
                    >
                      <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.35)]">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">Education</div>
                        <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">Academic timeline & qualifications</div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => handleMegaMenuClick({ type: 'TESTIMONIALS' })} 
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-transparent hover:border-white/5"
                    >
                      <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-400 group-hover:text-orange-300 group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.35)]">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors">Testimonials</div>
                        <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">Recommendations & feedback</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Expertise & Accomplishments */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-3 mb-1">Expertise & Honors</h3>
                    
                    <div 
                      onClick={() => handleMegaMenuClick({ type: 'SKILLS' })} 
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-transparent hover:border-white/5"
                    >
                      <div className="p-2.5 bg-green-500/10 rounded-xl text-green-400 group-hover:text-green-300 group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.35)]">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors">Skills</div>
                        <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">Tech proficiency & framework stack</div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => handleMegaMenuClick({ type: 'CERTIFICATES' })} 
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-transparent hover:border-white/5"
                    >
                      <div className="p-2.5 bg-teal-500/10 rounded-xl text-teal-400 group-hover:text-teal-300 group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.35)]">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">Certificates</div>
                        <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">Verified professional validations</div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => handleMegaMenuClick({ type: 'ACHIEVEMENTS' })} 
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-transparent hover:border-white/5"
                    >
                      <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-400 group-hover:text-yellow-300 group-hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.35)]">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors">Achievements</div>
                        <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">Honors, hackathons, & records</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Shimmer CTA Button */}
      <button 
        onClick={() => onNavigate({ type: 'CONTACT' })}
        className="relative ml-2 px-5 py-2.5 text-sm font-medium text-white rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-[0_4px_15px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.45)] hover:scale-[1.03] active:scale-[0.98] overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        <span className="relative z-10 flex items-center gap-1.5">
          Contact Me
        </span>
      </button>
    </nav>
  );
};
