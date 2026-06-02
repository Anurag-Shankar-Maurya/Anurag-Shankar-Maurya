
import React, { useState, useEffect } from 'react';
import { Zap, Loader2, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { MetaTags } from '../components/MetaTags';
import { Skill, ViewState } from '../types';
import { api } from '../services/api';
import { Icons, IconName } from '../components/Icons';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';

export const SkillsView: React.FC<{ skills: Skill[], onNavigate: (view: ViewState) => void }> = ({ skills, onNavigate }) => {
  const grouped = skills.reduce((acc, s) => {
    const key = s.skill_type?.trim() || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {} as Record<string, Skill[]>);

  const groupKeys = Object.keys(grouped).sort();

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
      <MetaTags title="Skills & Expertise | Anurag Shankar Maurya" description="A comprehensive list of my technical capabilities." />
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] text-black shadow-none"><Zap className="w-8 h-8"/></div>
        <div>
           <h1 className="text-4xl font-extrabold text-black">Skills & Expertise</h1>
           <p className="text-[#4c4546] mt-2">A comprehensive list of my technical capabilities.</p>
        </div>
      </div>

      {skills.length === 0 ? (
        <EmptyState
          title="Skill Profile Being Formed"
          description="A comprehensive breakdown of my programming languages, frameworks, and developer tools is currently on its way. Stay tuned!"
          icon={Zap}
          variant="general"
        />
      ) : (
        groupKeys.map((type) => (
          <section key={type} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">{type}</h2>
              <div className="text-sm font-semibold text-[#7e7576]">{grouped[type].length} skills</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {grouped[type].map((skill, index) => (
                <div 
                  key={skill.id} 
                  className="bg-white border border-[#E5E5E5] p-6 rounded-[2.5rem] hover:border-black transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 aspect-square group shadow-none"
                  onClick={() => onNavigate({ type: 'SKILL_DETAIL', slug: skill.slug })}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                   <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#f9f9f9] border border-[#E5E5E5] group-hover:scale-110 transition-all duration-300">
                     {(() => {
                       const IconComponent = Icons[skill.name.toLowerCase().replace(/[\s\.\-\+]/g, '') as IconName] || Zap;
                       return <IconComponent className="w-8 h-8 text-black" />;
                     })()}
                   </div>
                   <div>
                     <div className="font-bold text-black mb-1 group-hover:text-black transition-colors">{skill.name}</div>
                     <div className="text-xs font-semibold text-[#4c4546] capitalize px-3 py-1 rounded-full border border-[#E5E5E5] bg-[#f9f9f9]">{skill.proficiency}</div>
                   </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
};

export const SkillDetailView: React.FC<{ slug: string, onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSkillDetail(slug).then(setSkill).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <SkeletonLoader type="skill-detail" />;
  if (!skill) {
    return (
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center animate-fade-in-up">
        <EmptyState
          title="Skill Not Found"
          description="The technical capability or expertise record you are looking for may have been moved, renamed, or is currently unavailable."
          icon={HelpCircle}
          actionText="Back to Skills"
          onAction={() => onNavigate({ type: 'SKILLS' })}
          variant="general"
        />
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center animate-fade-in-up">
      <MetaTags title={skill?.name ? `${skill.name} | Skills | Anurag Shankar Maurya` : 'Skills | Anurag Shankar Maurya'} description={skill?.description || `Details about ${skill?.name || 'this skill'}.`} />
      <Button variant="ghost" onClick={() => onNavigate({ type: 'SKILLS' })} className="mb-12 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Skills
      </Button>
      
      <div className="bg-white border border-[#E5E5E5] rounded-[3rem] p-12 relative overflow-hidden group shadow-none">
         
         <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-[#f9f9f9] border border-[#E5E5E5] mb-8 shadow-none group-hover:scale-105 transition-transform duration-500">
            {(() => {
               const IconComponent = Icons[skill.name.toLowerCase().replace(/[\s\.\-\+]/g, '') as IconName] || Zap;
               return <IconComponent className="w-14 h-14 text-black" />;
            })()}
         </div>
         <h1 className="text-5xl font-extrabold text-black mb-6 tracking-tight">{skill.name}</h1>
         <div className="inline-block px-5 py-2 rounded-full bg-[#f9f9f9] border border-[#E5E5E5] text-[#4c4546] text-sm font-semibold capitalize mb-10">
           {skill.proficiency} • {skill.skill_type}
         </div>
         <p className="text-[#4c4546] text-lg leading-relaxed max-w-lg mx-auto">
           This skill is a key part of my stack. I have utilized <span className="text-black font-semibold">{skill.name}</span> in various projects to build robust and scalable solutions, demonstrating a deep understanding of its core concepts.
         </p>
      </div>
    </main>
  );
};
