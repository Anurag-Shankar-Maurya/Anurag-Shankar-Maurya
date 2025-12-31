
import React, { useState, useEffect } from 'react';
import { Briefcase, Loader2, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '../components/Button';
import { WorkExperience, ViewState } from '../types';
import { api } from '../services/api';

export const ExperienceView: React.FC<{ experience: WorkExperience[], onNavigate: (view: ViewState) => void }> = ({ experience, onNavigate }) => (
  <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in-up">
    <div className="flex items-center gap-4 mb-12">
      <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"><Briefcase className="w-8 h-8"/></div>
      <div>
         <h1 className="text-4xl font-bold text-white">Work Experience</h1>
         <p className="text-gray-400 mt-2">My professional journey and career milestones.</p>
      </div>
    </div>
    <div className="relative border-l border-white/10 ml-6 space-y-16">
      {experience.map((exp, index) => (
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
  </main>
);

export const ExperienceDetailView: React.FC<{ id: number, onNavigate: (view: ViewState) => void }> = ({ id, onNavigate }) => {
  const [experience, setExperience] = useState<WorkExperience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getExperienceDetail(id).then(setExperience).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-32 text-center text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;
  if (!experience) return <div>Experience not found</div>;

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in-up">
      <Button variant="ghost" onClick={() => onNavigate({ type: 'EXPERIENCE' })} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Experience
      </Button>
      <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between mb-8 border-b border-white/10 pb-8 relative z-10">
          <div className="flex items-center gap-6">
            {experience.company_logo ? (
              <img src={experience.company_logo} alt={experience.company_name} className="w-20 h-20 rounded-2xl bg-white/5 object-cover border border-white/10" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-white/10"><Briefcase className="w-8 h-8"/></div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{experience.job_title}</h1>
              <div className="text-xl text-blue-400 font-medium">{experience.company_name}</div>
            </div>
          </div>
           <div className="text-right">
              <div className="text-gray-300 font-medium mb-1 bg-white/5 px-3 py-1 rounded-lg inline-block">
                {new Date(experience.start_date).toLocaleDateString()} - {experience.end_date ? new Date(experience.end_date).toLocaleDateString() : 'Present'}
              </div>
              <div className="text-gray-500 text-sm flex items-center justify-end gap-2 mt-2"><MapPin className="w-4 h-4"/> {experience.location}</div>
           </div>
        </div>
        <div className="prose prose-invert max-w-none text-gray-300 mb-10 relative z-10">
          <h3 className="text-white font-bold text-lg mb-4">Role Overview</h3>
          <p className="leading-relaxed whitespace-pre-wrap">{experience.description}</p>
        </div>
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Technologies & Stack</h3>
          <div className="flex flex-wrap gap-2">
            {experience.technologies_used?.split(',').map((t, i) => (
                <span key={i} className="px-4 py-2 rounded-lg text-sm bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-default">{t.trim()}</span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
