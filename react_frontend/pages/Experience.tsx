
import React, { useState, useEffect } from 'react';
import { Briefcase, Loader2, ArrowLeft, MapPin, HelpCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { MetaTags } from '../components/MetaTags';
import Gallery from '../components/Gallery';
import { WorkExperience, ViewState } from '../types';
import { api } from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';

export const ExperienceView: React.FC<{ experience: WorkExperience[], onNavigate: (view: ViewState) => void }> = ({ experience, onNavigate }) => (
  <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in-up">
    <MetaTags title="Work Experience | Anurag Shankar Maurya" description="My professional journey and career milestones." />
    <div className="flex items-center gap-4 mb-12">
      <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] text-black shadow-none"><Briefcase className="w-8 h-8"/></div>
      <div>
         <h1 className="text-4xl font-extrabold text-black">Work Experience</h1>
         <p className="text-[#4c4546] mt-2">My professional journey and career milestones.</p>
      </div>
    </div>
    {experience.length === 0 ? (
      <EmptyState
        title="Timeline Under Curation"
        description="My professional chronology and career milestones are currently being updated. Stay tuned for updates!"
        icon={Briefcase}
        variant="general"
      />
    ) : (
      <div className="relative border-l border-[#E5E5E5] ml-6 space-y-16">
        {experience.map((exp, index) => (
          <div 
            key={exp.id} 
            className="relative pl-12 group cursor-pointer" 
            onClick={() => onNavigate({ type: 'EXPERIENCE_DETAIL', id: exp.id })}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute -left-[5px] top-8 w-2.5 h-2.5 rounded-full bg-black ring-4 ring-[#f9f9f9] group-hover:scale-125 transition-all"></div>
            
            <div className="bg-white border border-[#E5E5E5] p-10 rounded-[3rem] transition-all duration-300 hover:border-black shadow-none">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-5">
                  {exp.company_logo ? (
                     <img src={exp.company_logo} alt={exp.company_name} className="w-14 h-14 rounded-2xl bg-white object-cover border border-[#E5E5E5]" />
                  ) : (
                     <div className="w-14 h-14 rounded-2xl bg-[#F2F2F2] flex items-center justify-center text-black border border-[#E5E5E5]"><Briefcase className="w-6 h-6"/></div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-black group-hover:text-black transition-colors">{exp.job_title}</h3>
                    <div className="text-[#4c4546] font-medium">{exp.company_name}</div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[#4c4546] bg-[#f9f9f9] px-4 py-1.5 rounded-full border border-[#E5E5E5] whitespace-nowrap">
                  {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                </span>
              </div>
              <p className="text-[#4c4546] leading-relaxed mb-6 line-clamp-3 pl-1">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.technologies_used?.split(',').slice(0, 5).map((t, i) => (
                   <span key={i} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F2F2F2] text-black border border-[#E5E5E5]">{t.trim()}</span>
                ))}
                {exp.technologies_used?.split(',').length > 5 && <span className="px-2.5 py-1 text-xs font-medium text-[#7e7576]">+{exp.technologies_used.split(',').length - 5} more</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </main>
);

export const ExperienceDetailView: React.FC<{ id: number, onNavigate: (view: ViewState) => void }> = ({ id, onNavigate }) => {
  const [experience, setExperience] = useState<WorkExperience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getExperienceDetail(id).then(setExperience).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <SkeletonLoader type="experience-detail" />;

  if (!experience) {
    return (
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in-up">
        <EmptyState
          title="Experience Not Found"
          description="The professional experience entry you are looking for may have been moved, renamed, or is currently unavailable."
          icon={HelpCircle}
          actionText="Back to Experience"
          onAction={() => onNavigate({ type: 'EXPERIENCE' })}
          variant="general"
        />
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in-up">
      <MetaTags title={experience?.job_title ? `${experience.job_title} at ${experience.company_name} | Experience | Anurag Shankar Maurya` : 'Work Experience | Anurag Shankar Maurya'} description={experience?.description} />
      <Button variant="ghost" onClick={() => onNavigate({ type: 'EXPERIENCE' })} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Experience
      </Button>
      <div className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 md:p-12 relative overflow-hidden shadow-none">
        
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between mb-8 border-b border-[#E5E5E5] pb-8 relative z-10">
          <div className="flex items-center gap-6">
            {experience.company_logo ? (
              <img src={experience.company_logo} alt={experience.company_name} className="w-20 h-20 rounded-[1.5rem] bg-white object-cover border border-[#E5E5E5]" />
            ) : (
              <div className="w-20 h-20 rounded-[1.5rem] bg-[#F2F2F2] flex items-center justify-center text-black border border-[#E5E5E5]"><Briefcase className="w-8 h-8"/></div>
            )}
            <div>
              <h1 className="text-3xl font-extrabold text-black mb-2">{experience.job_title}</h1>
              <div className="text-xl text-black font-semibold">{experience.company_name}</div>
            </div>
          </div>
           <div className="text-right">
              <div className="text-black font-semibold mb-1 bg-[#F2F2F2] border border-[#E5E5E5] px-4 py-1.5 rounded-full inline-block">
                {new Date(experience.start_date).toLocaleDateString()} - {experience.end_date ? new Date(experience.end_date).toLocaleDateString() : 'Present'}
              </div>
              <div className="text-[#7e7576] font-semibold text-sm flex items-center justify-end gap-2 mt-2"><MapPin className="w-4 h-4"/> {experience.location}</div>
           </div>
        </div>
        <div className="prose prose-neutral max-w-none text-[#4c4546] mb-10 relative z-10">
          <h3 className="text-black font-bold text-lg mb-4">Role Overview</h3>
          <p className="leading-relaxed whitespace-pre-wrap">{experience.description}</p>
        </div>
        <div className="relative z-10">
          <h3 className="text-xs font-bold text-[#7e7576] uppercase tracking-widest mb-4">Technologies & Stack</h3>
          <div className="flex flex-wrap gap-2">
            {experience.technologies_used?.split(',').map((t, i) => (
                <span key={i} className="px-4 py-2 rounded-full text-sm font-semibold bg-[#F2F2F2] text-black border border-[#E5E5E5] hover:border-black transition-all cursor-default">{t.trim()}</span>
            ))}
          </div>
        </div>

        {experience.images && experience.images.length > 0 && (
      <div className="mt-8">
          <h3 className="text-lg font-bold text-black mb-4">Gallery</h3>
      <Gallery images={experience.images} />
    </div>
        )}
      </div>
    </main>
  );
};
