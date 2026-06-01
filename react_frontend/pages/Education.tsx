
import React, { useState, useEffect } from 'react';
import { GraduationCap, ArrowRight, ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { MetaTags } from '../components/MetaTags';
import { Button } from '../components/Button';
import Gallery from '../components/Gallery';
import { Education, ViewState } from '../types';
import { api } from '../services/api';

export const EducationView: React.FC<{ education: Education[], onNavigate: (view: ViewState) => void }> = ({ education, onNavigate }) => (
  <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in-up">
    <MetaTags title="Education | Anurag Shankar Maurya" description="Academic background and qualifications." />
    <div className="flex items-center gap-4 mb-12">
      <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] text-black shadow-none"><GraduationCap className="w-8 h-8"/></div>
      <div>
         <h1 className="text-4xl font-extrabold text-black">Education</h1>
         <p className="text-[#4c4546] mt-2">Academic background and qualifications.</p>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-6">
      {education.map((edu, index) => (
        <div 
          key={edu.id} 
          className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 hover:border-black transition-all cursor-pointer group shadow-none" 
          onClick={() => onNavigate({ type: 'EDUCATION_DETAIL', slug: edu.slug || String(edu.id) })}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start gap-6">
              {edu.logo ? (
                <img src={edu.logo} alt={edu.institution} className="w-16 h-16 rounded-[1.5rem] object-cover bg-white border border-[#E5E5E5]"/>
              ) : (
                <div className="w-16 h-16 rounded-[1.5rem] bg-[#F2F2F2] flex items-center justify-center text-black border border-[#E5E5E5]"><GraduationCap className="w-8 h-8"/></div>
              )}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <h3 className="text-2xl font-bold text-black group-hover:text-black transition-colors">{edu.institution}</h3>
                  <span className="text-sm font-semibold text-[#4c4546] bg-[#f9f9f9] px-4 py-1.5 rounded-full border border-[#E5E5E5] w-fit">
                    {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                  </span>
                </div>
                <div className="text-lg text-black mt-1 font-semibold">{edu.degree} in {edu.field_of_study}</div>
                <p className="text-[#4c4546] mt-4 line-clamp-2 leading-relaxed">{edu.description}</p>
                <div className="mt-4 text-sm text-black font-semibold flex items-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
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

  if (loading) return <div className="pt-32 text-center text-black"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;
  if (!education) return <div>Education not found</div>;

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in-up">
      <MetaTags title={education?.institution ? `${education.institution} | Education | Anurag Shankar Maurya` : 'Education | Anurag Shankar Maurya'} description={education?.description} />
      <Button variant="ghost" onClick={() => onNavigate({ type: 'EDUCATION' })} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Education
      </Button>
      <div className="bg-white border border-[#E5E5E5] rounded-[3rem] overflow-hidden shadow-none">
         <div className="h-48 bg-[#F2F2F2] border-b border-[#E5E5E5] relative">
            <div className="absolute bottom-0 left-8 transform translate-y-1/2 rounded-[1.5rem] bg-white border border-[#E5E5E5]">
              {education.logo ? (
                <img src={education.logo} alt={education.institution} className="w-24 h-24 rounded-[1.5rem] border border-[#E5E5E5] bg-white object-cover"/>
              ) : (
                <div className="w-24 h-24 rounded-[1.5rem] border border-[#E5E5E5] bg-white flex items-center justify-center text-black bg-[#F2F2F2]"><GraduationCap className="w-10 h-10"/></div>
              )}
            </div>
         </div>
         <div className="pt-16 pb-12 px-8 md:px-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-2">{education.institution}</h1>
            <div className="text-xl text-[#4c4546] mb-6 font-semibold">{education.degree}, {education.field_of_study}</div>
            
            <div className="flex gap-6 text-sm text-[#4c4546] mb-10 border-b border-[#E5E5E5] pb-8">
               <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f9f9f9] border border-[#E5E5E5]"><Calendar className="w-4 h-4"/> {new Date(education.start_date).getFullYear()} - {education.end_date ? new Date(education.end_date).getFullYear() : 'Present'}</div>
            </div>

            <div className="prose prose-neutral max-w-none text-[#4c4546]">
              <h3 className="text-black font-bold text-lg mb-4">Program Overview</h3>
              <p className="whitespace-pre-wrap leading-relaxed">{education.description}</p>
            </div>

      {education.images && education.images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-black mb-4">Gallery</h3>
          <Gallery images={education.images} />
        </div>
      )}
         </div>
      </div>
    </main>
  );
};
