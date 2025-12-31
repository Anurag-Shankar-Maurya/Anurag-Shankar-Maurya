
import React from 'react';
import { MapPin, Calendar, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import Gallery from '../components/Gallery';
import { ProfileDetail, WorkExperience, ViewState } from '../types';

interface AboutProps {
  profile: ProfileDetail | null;
  experience: WorkExperience[];
  onNavigate: (view: ViewState) => void;
}

export const About: React.FC<AboutProps> = ({ profile, experience, onNavigate }) => {
  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-24 animate-fade-in-up">
      {/* Profile Header */}
      <section className="flex flex-col md:flex-row items-center gap-12 group">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
          <img 
            src={profile?.profile_image} 
            alt={profile?.full_name} 
            className="relative w-48 h-48 rounded-2xl object-cover border-2 border-white/10 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500" 
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">About Me</h1>
          <div className="prose prose-invert prose-lg text-gray-300 max-w-none">
            <p className="leading-relaxed font-light">{profile?.bio}</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-400">
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                <MapPin className="w-4 h-4 text-blue-400"/> {profile?.location}
             </div>
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                <Calendar className="w-4 h-4 text-blue-400"/> {profile?.years_of_experience}+ Years Exp.
             </div>
          </div>
        </div>
      </section>

      {profile?.images && profile.images.length > 0 && (
        <section className="animate-fade-in-up">
          <h3 className="text-lg font-bold text-white mb-4">Photos & Gallery</h3>
          <Gallery images={profile.images} columns={4} />
        </section>
      )}

      {/* Experience Preview */}
      <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"><Briefcase className="w-6 h-6"/></div>
             <h2 className="text-2xl font-bold text-white">Recent Experience</h2>
          </div>
          <Button variant="ghost" onClick={() => onNavigate({ type: 'EXPERIENCE' })} rightIcon={<ArrowRight className="w-4 h-4"/>}>View All</Button>
        </div>
        <div className="relative border-l border-white/10 ml-6 space-y-8">
          {experience.slice(0, 3).map((exp, index) => (
            <div key={exp.id} className="relative pl-12 group" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
              <div className="absolute -left-[5px] top-8 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-background group-hover:ring-blue-500/20 transition-all shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              
              <div className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 group-hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{exp.job_title}</h3>
                  <span className="text-xs font-medium text-gray-400 bg-black/30 px-3 py-1 rounded-full border border-white/5 w-fit mt-2 sm:mt-0">
                    {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                  </span>
                </div>
                <div className="text-lg text-blue-400 mb-3">{exp.company_name}</div>
                <p className="text-gray-400 leading-relaxed line-clamp-2 text-sm">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
