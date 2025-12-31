
import React, { useState, useEffect } from 'react';
import { Zap, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Skill, ViewState } from '../types';
import { api } from '../services/api';
import { Icons, IconName } from '../components/Icons';

export const SkillsView: React.FC<{ skills: Skill[], onNavigate: (view: ViewState) => void }> = ({ skills, onNavigate }) => (
  <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
    <div className="flex items-center gap-4 mb-12">
      <div className="p-3 bg-green-500/10 rounded-xl text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]"><Zap className="w-8 h-8"/></div>
      <div>
         <h1 className="text-4xl font-bold text-white">Skills & Expertise</h1>
         <p className="text-gray-400 mt-2">A comprehensive list of my technical capabilities.</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {skills.map((skill, index) => (
        <div 
          key={skill.id} 
          className="glass-card p-4 rounded-2xl hover:border-green-500/40 hover:bg-green-500/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 aspect-square group hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/10"
          onClick={() => onNavigate({ type: 'SKILL_DETAIL', slug: skill.slug })}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
           <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-green-500/10 group-hover:scale-110 transition-all duration-300">
             {(() => {
               const IconComponent = Icons[skill.name.toLowerCase().replace(/[\s\.\-\+]/g, '') as IconName] || Zap;
               return <IconComponent className="w-8 h-8 text-gray-400 group-hover:text-green-400" />;
             })()}
           </div>
           <div>
             <div className="font-bold text-white mb-1 group-hover:text-green-400 transition-colors">{skill.name}</div>
             <div className="text-xs text-gray-500 capitalize px-2 py-0.5 rounded-full border border-white/5 bg-black/20">{skill.proficiency}</div>
           </div>
        </div>
      ))}
    </div>
  </main>
);

export const SkillDetailView: React.FC<{ slug: string, onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSkillDetail(slug).then(setSkill).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 text-center text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;
  if (!skill) return <div>Skill not found</div>;

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center animate-fade-in-up">
      <Button variant="ghost" onClick={() => onNavigate({ type: 'SKILLS' })} className="mb-12 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Skills
      </Button>
      
      <div className="glass-card rounded-3xl p-12 relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-blue-500"></div>
         <div className="absolute inset-0 bg-green-500/5 blur-3xl rounded-full opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none"></div>
         
         <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-white/5 mb-8 border border-white/10 shadow-lg shadow-green-500/10 group-hover:scale-105 transition-transform duration-500">
            {(() => {
               const IconComponent = Icons[skill.name.toLowerCase().replace(/[\s\.\-\+]/g, '') as IconName] || Zap;
               return <IconComponent className="w-14 h-14 text-green-400" />;
            })()}
         </div>
         <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">{skill.name}</h1>
         <div className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium capitalize mb-10">
           {skill.proficiency} • {skill.skill_type}
         </div>
         <p className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
           This skill is a key part of my stack. I have utilized <span className="text-white font-medium">{skill.name}</span> in various projects to build robust and scalable solutions, demonstrating a deep understanding of its core concepts.
         </p>
      </div>
    </main>
  );
};
