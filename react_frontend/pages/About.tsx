import React from 'react';
import { MapPin, Calendar, Briefcase, ArrowRight, Download, Mail, Phone, ExternalLink, User, Award } from 'lucide-react';
import { Button } from '../components/Button';
import { MetaTags } from '../components/MetaTags';
import Gallery from '../components/Gallery';
import { ProfileDetail, WorkExperience, ViewState } from '../types';

interface AboutProps {
  profile: ProfileDetail | null;
  experience: WorkExperience[];
  onNavigate: (view: ViewState) => void;
}

export const About: React.FC<AboutProps> = ({ profile, experience, onNavigate }) => {
  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-32 animate-fade-in-up">
      <MetaTags 
        title={`About ${profile?.full_name || "Anurag Shankar Maurya"}`}
        description={`Learn more about ${profile?.full_name}, ${profile?.headline}. Experience, background, and career path.`}
        keywords={`about, biography, experience, ${profile?.full_name}`}
        ogImage={profile?.profile_image}
      />
      {/* Hero Section */}
      <section className="relative group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Profile Image Column (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-start order-2 lg:order-1">
            <div className="relative w-full max-w-md aspect-square mx-auto lg:mx-0">
               {/* Decorative background elements */}
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2.5rem] rotate-6 opacity-20 blur-xl group-hover:rotate-12 transition-transform duration-700"></div>
               <div className="absolute inset-0 bg-gradient-to-bl from-cyan-400 to-blue-500 rounded-[2.5rem] -rotate-3 opacity-20 blur-lg group-hover:-rotate-6 transition-transform duration-700"></div>
               
               {/* Main Image */}
               <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-2xl shadow-blue-500/10 bg-gray-900/50 backdrop-blur-sm z-10">
                 {profile?.profile_image && (
                   <img 
                     src={profile.profile_image} 
                     alt={profile.full_name} 
                     className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-1000"
                   />
                 )}
                 
                 {/* Floating Status Badge */}
                 {profile?.available_for_hire && (
                   <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-xl z-20">
                     <span className="relative flex h-3 w-3">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                     </span>
                     <span className="text-sm font-medium text-white">Available for Hire</span>
                   </div>
                 )}
               </div>
            </div>

            {/* Social / Contact Links Compact */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
               {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 transition-all group cursor-pointer backdrop-blur-sm">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate max-w-[300px]">{profile.email}</p>
                  </div>
                </a>
               )}
               {profile?.phone && (
                <a href={`tel:${profile.phone}`} className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 transition-all group cursor-pointer backdrop-blur-sm">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                    <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{profile.phone}</p>
                  </div>
                </a>
               )}
            </div>
          </div>

          {/* Text Content Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left order-1 lg:order-2">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                <User className="w-3 h-3" />
                About Me
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">{profile?.full_name?.split(' ')[0]}</span>
                <span className="block text-3xl md:text-4xl text-gray-400 font-normal mt-2">{profile?.full_name?.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {profile?.headline}
              </p>
            </div>

            <div className="prose prose-invert prose-lg text-gray-400 max-w-none">
              <p className="leading-relaxed opacity-90">{profile?.bio}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start pt-4">
              {profile?.resume_filename && (
                <a 
                  href={profile.resume_url || '#'} 
                  download 
                  className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Download Resume</span>
                </a>
              )}
              <button 
                onClick={() => onNavigate({ type: 'CONTACT' })}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-white/5"
              >
                <Mail className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                <span>Contact Me</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Experience Card */}
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5">
          <div className="mb-6 p-4 bg-blue-500/10 w-fit rounded-2xl group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
             <Calendar className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-5xl font-bold text-white mb-2 tracking-tight">{profile?.years_of_experience}+</div>
          <div className="text-gray-400 font-medium">Years of Experience</div>
        </div>

        {/* Projects/Positions Card */}
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/5">
          <div className="mb-6 p-4 bg-purple-500/10 w-fit rounded-2xl group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
             <Briefcase className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-5xl font-bold text-white mb-2 tracking-tight">{experience.length}</div>
          <div className="text-gray-400 font-medium">Positions Held</div>
        </div>

        {/* Current Role Card - Spans 2 cols on tablet/desktop */}
        <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:rotate-12 group-hover:scale-110 origin-top-right">
              <Briefcase className="w-40 h-40 text-blue-400" />
           </div>
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">Current Role</div>
                <div className="text-3xl font-bold text-white mb-2">{profile?.current_role || 'Full Stack Developer'}</div>
                <div className="text-xl text-gray-400">at <span className="text-white">{profile?.current_company || 'Independent'}</span></div>
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm text-gray-400 bg-black/20 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                <MapPin className="w-4 h-4 text-blue-400" />
                {profile?.location || 'Remote'}
              </div>
           </div>
        </div>
      </section>

      {/* Experience Section */}
      {experience.length > 0 && (
      <section className="relative">
        <div className="flex items-center justify-between mb-16">
           <div>
             <div className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">Career Path</div>
             <h2 className="text-3xl md:text-4xl font-bold text-white">Recent Experience</h2>
           </div>
           <Button variant="ghost" onClick={() => onNavigate({ type: 'EXPERIENCE' })} rightIcon={<ArrowRight className="w-4 h-4"/>}>Full Timeline</Button>
        </div>

        <div className="space-y-12">
          {experience.slice(0, 3).map((exp, index) => (
             <div 
               key={exp.id} 
               className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 items-start cursor-pointer"
               onClick={() => onNavigate({ type: 'EXPERIENCE_DETAIL', id: exp.id })}
               style={{ animationDelay: `${index * 0.1}s` }}
             >
               {/* Date Column */}
               <div className="md:col-span-3 pt-2">
                 <div className="flex items-center gap-4 text-gray-400 group-hover:text-blue-400 transition-colors">
                    <Calendar className="w-5 h-5" />
                    <span className="text-lg font-medium">
                      {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                    </span>
                 </div>
               </div>

               {/* Connector Line (Desktop) */}
               <div className="hidden md:flex flex-col items-center self-stretch col-span-1">
                 <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-background group-hover:ring-blue-500/20 transition-all shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                 <div className="w-px h-full bg-gradient-to-b from-blue-500/50 to-transparent mt-4"></div>
               </div>

               {/* Content Card */}
               <div className="md:col-span-8">
                 <div className="glass-card p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 border border-white/10 hover:border-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-900/10 bg-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                           {exp.company_logo ? (
                              <img src={exp.company_logo} alt={exp.company_name} className="w-12 h-12 rounded-xl bg-white/10 object-cover border border-white/10" />
                          ) : (
                              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-white/10"><Briefcase className="w-6 h-6"/></div>
                          )}
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{exp.job_title}</h3>
                            <div className="text-gray-400 font-medium">{exp.company_name}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
                      </div>
                      
                      <p className="text-gray-400 leading-relaxed mb-6 line-clamp-2 pl-1">{exp.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies_used?.split(',').slice(0, 4).map((t, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/5 text-blue-300/80 border border-blue-500/10 group-hover:border-blue-500/20 transition-colors">{t.trim()}</span>
                        ))}
                      </div>
                    </div>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </section>
      )}

      {/* Gallery Section */}
      {profile?.images && profile.images.length > 0 && (
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-400 text-sm font-bold uppercase tracking-wider mb-2">Life in Pictures</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Gallery & Moments</h2>
            </div>
            <p className="text-gray-400 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/10">{profile.images.length} photos</p>
          </div>
          <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
             <Gallery images={profile.images} />
          </div>
        </section>
      )}
    </main>
  );
};
