
import React from 'react';
import { MapPin, Calendar, Briefcase, ArrowRight, Download, Mail, Phone } from 'lucide-react';
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
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-32 animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Profile Image & Stats */}
          <div className="relative flex flex-col items-center md:items-start gap-8">
            {/* Image Container */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
              <img 
                src={profile?.profile_image} 
                alt={profile?.full_name} 
                className="relative w-64 h-64 rounded-3xl object-cover border-2 border-white/20 shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500 group-hover:scale-105" 
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl opacity-10 blur-xl"></div>
            </div>

            {/* Contact Cards */}
            <div className="w-full space-y-3">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 transition-all group cursor-pointer">
                  <div className="p-2.5 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{profile.email}</p>
                  </div>
                </a>
              )}
              {profile?.phone && (
                <a href={`tel:${profile.phone}`} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 transition-all group cursor-pointer">
                  <div className="p-2.5 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{profile.phone}</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                Professional Profile
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">{profile?.full_name}</h1>
              <p className="text-2xl text-blue-400 font-semibold">{profile?.headline}</p>
            </div>

            <div className="prose prose-invert prose-lg text-gray-300 max-w-none space-y-4">
              <p className="leading-relaxed font-light text-base">{profile?.bio}</p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 hover:border-blue-500/30 transition-colors">
                <div className="text-3xl font-bold text-blue-400 mb-1">{profile?.years_of_experience}+</div>
                <p className="text-sm text-gray-400">Years Experience</p>
              </div>
              <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 hover:border-purple-500/30 transition-colors">
                <div className="text-3xl font-bold text-purple-400 mb-1">{experience.length}</div>
                <p className="text-sm text-gray-400">Positions Held</p>
              </div>
            </div>

            {/* Location & Status */}
            <div className="flex flex-wrap gap-3 pt-4">
              {profile?.location && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{profile.location}</span>
                </div>
              )}
              {profile?.available_for_hire && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm text-green-400">Available for Hire</span>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-6">
              {profile?.resume_filename && (
                <a href={profile.resume_url || '#'} download className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30">
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              )}
              <button onClick={() => onNavigate({ type: 'CONTACT' })} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all">
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Summary Boxes */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-colors group">
          <div className="p-3 w-fit bg-blue-500/20 rounded-lg mb-4 group-hover:bg-blue-500/30 transition-colors">
            <Briefcase className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Current Role</h3>
          <p className="text-blue-400 font-semibold text-lg">{profile?.current_role || 'Full Stack Developer'}</p>
          <p className="text-gray-500 text-sm mt-2">at {profile?.current_company || 'Independent'}</p>
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
          <div className="p-3 w-fit bg-purple-500/20 rounded-lg mb-4 group-hover:bg-purple-500/30 transition-colors">
            <Calendar className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Total Experience</h3>
          <p className="text-purple-400 font-semibold text-lg">{profile?.years_of_experience}+ Years</p>
          <p className="text-gray-500 text-sm mt-2">of professional work</p>
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 hover:border-pink-500/40 transition-colors group">
          <div className="p-3 w-fit bg-pink-500/20 rounded-lg mb-4 group-hover:bg-pink-500/30 transition-colors">
            <Briefcase className="w-6 h-6 text-pink-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Status</h3>
          <p className={`font-semibold text-lg ${profile?.available_for_hire ? 'text-green-400' : 'text-gray-400'}`}>
            {profile?.available_for_hire ? '🟢 Open to Opportunities' : '⚪ Not Available'}
          </p>
          <p className="text-gray-500 text-sm mt-2">for new projects</p>
        </div>
      </section>

      {/* Experience Section */}
      {experience.length > 0 && (
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
            <div 
              key={exp.id} 
              className="relative pl-12 group cursor-pointer" 
              onClick={() => onNavigate({ type: 'EXPERIENCE_DETAIL', id: exp.id })}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute -left-[5px] top-8 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-background group-hover:ring-blue-500/20 transition-all shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              
              <div className="glass-card p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20 group-hover:shadow-2xl group-hover:shadow-blue-900/10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-5">
                    {exp.company_logo ? (
                        <img src={exp.company_logo} alt={exp.company_name} className="w-14 h-14 rounded-xl bg-white/5 object-cover border border-white/10" />
                    ) : (
                        <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-white/10"><Briefcase className="w-6 h-6"/></div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{exp.job_title}</h3>
                      <div className="text-gray-400 font-medium">{exp.company_name}</div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 whitespace-nowrap">
                    {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3 pl-1">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies_used?.split(',').slice(0, 5).map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/5 text-blue-300/80 border border-blue-500/10">{t.trim()}</span>
                  ))}
                  {exp.technologies_used?.split(',').length > 5 && <span className="px-2.5 py-1 text-xs text-gray-500">+{exp.technologies_used.split(',').length - 5} more</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Gallery Section */}
      {profile?.images && profile.images.length > 0 && (
        <section className="space-y-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Gallery & Moments</h2>
            <p className="text-gray-400 text-sm">{profile.images.length} photos</p>
          </div>
          <Gallery images={profile.images} columns={4} />
        </section>
      )}
    </main>
  );
};
