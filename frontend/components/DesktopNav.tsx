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
        className={`relative px-3.5 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
          isViewActive('HOME') ? 'text-black font-semibold' : 'text-[#4c4546] hover:text-black'
        }`}
        aria-current={isViewActive('HOME') ? 'page' : undefined}
      >
        <span className="relative z-10">Home</span>
        {isViewActive('HOME') && (
          <motion.span 
            layoutId="activeNavBackground"
            className="absolute inset-0 bg-[#eeeeee] rounded-full border border-[#E5E5E5] shadow-none"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>
 
      {/* Projects Link */}
      <button 
        onClick={() => onNavigate({ type: 'PROJECTS' })}
        className={`relative px-3.5 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
          isViewActive('PROJECTS') ? 'text-black font-semibold' : 'text-[#4c4546] hover:text-black'
        }`}
        aria-current={isViewActive('PROJECTS') ? 'page' : undefined}
      >
        <span className="relative z-10">Projects</span>
        {isViewActive('PROJECTS') && (
          <motion.span 
            layoutId="activeNavBackground"
            className="absolute inset-0 bg-[#eeeeee] rounded-full border border-[#E5E5E5] shadow-none"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>
 
      {/* Blog Link */}
      <button 
        onClick={() => onNavigate({ type: 'BLOG' })}
        className={`relative px-3.5 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
          isViewActive('BLOG') ? 'text-black font-semibold' : 'text-[#4c4546] hover:text-black'
        }`}
        aria-current={isViewActive('BLOG') ? 'page' : undefined}
      >
        <span className="relative z-10">Blog</span>
        {isViewActive('BLOG') && (
          <motion.span 
            layoutId="activeNavBackground"
            className="absolute inset-0 bg-[#eeeeee] rounded-full border border-[#E5E5E5] shadow-none"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </button>
 
      {/* Gallery Link */}
      <button 
        onClick={() => onNavigate({ type: 'GALLERY' })}
        className={`relative px-3.5 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
          isViewActive('GALLERY') ? 'text-black font-semibold' : 'text-[#4c4546] hover:text-black'
        }`}
        aria-current={isViewActive('GALLERY') ? 'page' : undefined}
      >
        <span className="relative z-10">Gallery</span>
        {isViewActive('GALLERY') && (
          <motion.span 
            layoutId="activeNavBackground"
            className="absolute inset-0 bg-[#eeeeee] rounded-full border border-[#E5E5E5] shadow-none"
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
          className={`relative px-3.5 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
            isExploreActive || isMegaMenuOpen ? 'text-black font-semibold' : 'text-[#4c4546] hover:text-black'
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
              className="absolute inset-0 bg-[#eeeeee] rounded-full border border-[#E5E5E5] shadow-none"
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
              <div className="relative p-6 bg-white border border-[#E5E5E5] rounded-[3rem] shadow-none overflow-hidden">
                <div className="relative grid grid-cols-2 gap-6 z-10">
                  {/* Left Column: Career & Background */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-[#7e7576] uppercase tracking-widest pl-3 mb-1">Career & Background</h3>
                    
                    <div 
                      onClick={() => handleMegaMenuClick({ type: 'EXPERIENCE' })} 
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#f3f3f3] cursor-pointer transition-all duration-300 group border border-transparent hover:border-[#cfc4c5]"
                    >
                      <div className="p-2.5 bg-[#eeeeee] rounded-xl text-black group-hover:scale-110 transition-all duration-300">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-black transition-colors">Work Experience</div>
                        <div className="text-xs text-[#4c4546] mt-0.5 leading-relaxed">Professional path & career history</div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => handleMegaMenuClick({ type: 'EDUCATION' })} 
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#f3f3f3] cursor-pointer transition-all duration-300 group border border-transparent hover:border-[#cfc4c5]"
                    >
                      <div className="p-2.5 bg-[#eeeeee] rounded-xl text-black group-hover:scale-110 transition-all duration-300">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-black transition-colors">Education</div>
                        <div className="text-xs text-[#4c4546] mt-0.5 leading-relaxed">Academic timeline & qualifications</div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => handleMegaMenuClick({ type: 'TESTIMONIALS' })} 
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#f3f3f3] cursor-pointer transition-all duration-300 group border border-transparent hover:border-[#cfc4c5]"
                    >
                      <div className="p-2.5 bg-[#eeeeee] rounded-xl text-black group-hover:scale-110 transition-all duration-300">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-black transition-colors">Testimonials</div>
                        <div className="text-xs text-[#4c4546] mt-0.5 leading-relaxed">Recommendations & feedback</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Expertise & Accomplishments */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-[#7e7576] uppercase tracking-widest pl-3 mb-1">Expertise & Honors</h3>
                    
                    <div 
                      onClick={() => handleMegaMenuClick({ type: 'SKILLS' })} 
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#f3f3f3] cursor-pointer transition-all duration-300 group border border-transparent hover:border-[#cfc4c5]"
                    >
                      <div className="p-2.5 bg-[#eeeeee] rounded-xl text-black group-hover:scale-110 transition-all duration-300">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-black transition-colors">Skills</div>
                        <div className="text-xs text-[#4c4546] mt-0.5 leading-relaxed">Tech proficiency & framework stack</div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => handleMegaMenuClick({ type: 'CERTIFICATES' })} 
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#f3f3f3] cursor-pointer transition-all duration-300 group border border-transparent hover:border-[#cfc4c5]"
                    >
                      <div className="p-2.5 bg-[#eeeeee] rounded-xl text-black group-hover:scale-110 transition-all duration-300">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-black transition-colors">Certificates</div>
                        <div className="text-xs text-[#4c4546] mt-0.5 leading-relaxed">Verified professional validations</div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => handleMegaMenuClick({ type: 'ACHIEVEMENTS' })} 
                      className="flex items-start gap-4 p-3 rounded-2xl hover:bg-[#f3f3f3] cursor-pointer transition-all duration-300 group border border-transparent hover:border-[#cfc4c5]"
                    >
                      <div className="p-2.5 bg-[#eeeeee] rounded-xl text-black group-hover:scale-110 transition-all duration-300">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-black transition-colors">Achievements</div>
                        <div className="text-xs text-[#4c4546] mt-0.5 leading-relaxed">Honors, hackathons, & records</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Primary Monochromatic CTA Button */}
      <button 
        onClick={() => onNavigate({ type: 'CONTACT' })}
        className="relative ml-2 px-6 py-3 text-sm font-medium text-white rounded-full bg-black hover:bg-neutral-800 border border-black transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <span className="relative z-10 flex items-center gap-1.5">
          Contact Me
        </span>
      </button>
    </nav>
  );
};
