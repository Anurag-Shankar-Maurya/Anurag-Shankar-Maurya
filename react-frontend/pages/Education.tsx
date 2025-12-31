
import React, { useState, useEffect } from 'react';
import { GraduationCap, ArrowRight, ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Education, ViewState } from '../types';
import { api } from '../services/api';

export const EducationView: React.FC<{ education: Education[], onNavigate: (view: ViewState) => void }> = ({ education, onNavigate }) => (
  <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in-up">
    <div className="flex items-center gap-4 mb-12">
      <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]"><GraduationCap className="w-8 h-8"/></div>
      <div>
         <h1 className="text-4xl font-bold text-white">Education</h1>
         <p className="text-gray-400 mt-2">Academic background and qualifications.</p>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-6">
      {education.map((edu, index) => (
        <div 
          key={edu.id} 
          className="glass-card rounded-2xl p-8 hover:border-purple-500/30 transition-all cursor-pointer group hover:-translate-y-1" 
          onClick={() => onNavigate({ type: 'EDUCATION_DETAIL', slug: edu.slug || String(edu.id) })}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start gap-6">
             {edu.logo ? (
               <img src={edu.logo} alt={edu.institution} className="w-16 h-16 rounded-xl object-cover bg-white/5 border border-white/10"/>
             ) : (
               <div className="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20"><GraduationCap className="w-8 h-8"/></div>
             )}
             <div className="flex-1">
               <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                 <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">{edu.institution}</h3>
                 <span className="text-sm font-medium text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5 w-fit">
                   {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                 </span>
               </div>
               <div className="text-lg text-purple-200/80 mt-1 font-medium">{edu.degree} in {edu.field_of_study}</div>
               <p className="text-gray-400 mt-4 line-clamp-2 leading-relaxed">{edu.description}</p>
               <div className="mt-4 text-sm text-purple-400 font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                 Read more <ArrowRight className="w-3 h-3 ml-1"/>
               </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  </main>
);

export const EducationDetailView: React.FC<{ slug: string, onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const [education, setEducation] = useState<Education | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEducationDetail(slug).then(setEducation).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 text-center text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;
  if (!education) return <div>Education not found</div>;

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in-up">
      <Button variant="ghost" onClick={() => onNavigate({ type: 'EDUCATION' })} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Education
      </Button>
      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/10">
         <div className="h-48 bg-gradient-to-r from-purple-900/40 via-blue-900/20 to-purple-900/40 relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute bottom-0 left-8 transform translate-y-1/2 shadow-xl rounded-2xl">
              {education.logo ? (
                <img src={education.logo} alt={education.institution} className="w-24 h-24 rounded-2xl border-4 border-[#18181b] bg-surface object-cover"/>
              ) : (
                <div className="w-24 h-24 rounded-2xl border-4 border-[#18181b] bg-surface flex items-center justify-center text-purple-400 bg-purple-500/10"><GraduationCap className="w-10 h-10"/></div>
              )}
            </div>
         </div>
         <div className="pt-16 pb-12 px-8 md:px-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{education.institution}</h1>
            <div className="text-xl text-purple-400 mb-6 font-medium">{education.degree}, {education.field_of_study}</div>
            
            <div className="flex gap-6 text-sm text-gray-400 mb-10 border-b border-white/10 pb-8">
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5"><Calendar className="w-4 h-4"/> {new Date(education.start_date).getFullYear()} - {education.end_date ? new Date(education.end_date).getFullYear() : 'Present'}</div>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300">
              <h3 className="text-white font-bold text-lg mb-4">Program Overview</h3>
              <p className="whitespace-pre-wrap leading-relaxed">{education.description}</p>
            </div>
         </div>
      </div>
    </main>
  );
};
