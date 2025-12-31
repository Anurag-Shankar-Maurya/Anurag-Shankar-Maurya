
import React, { useState, useEffect } from 'react';
import { Star, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Testimonial, ViewState } from '../types';
import { api } from '../services/api';

export const TestimonialsView: React.FC<{ testimonials: Testimonial[], onNavigate: (view: ViewState) => void }> = ({ testimonials, onNavigate }) => (
  <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
    <div className="flex items-center gap-4 mb-12">
      <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]"><Star className="w-8 h-8"/></div>
      <div>
         <h1 className="text-4xl font-bold text-white">Testimonials</h1>
         <p className="text-gray-400 mt-2">What colleagues and clients say about working with me.</p>
      </div>
    </div>
    
    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
      {testimonials.map((test, index) => (
        <div 
          key={test.id} 
          className="glass-card p-8 rounded-3xl break-inside-avoid hover:border-orange-500/30 transition-all cursor-pointer group hover:-translate-y-2 hover:bg-white/5" 
          onClick={() => onNavigate({ type: 'TESTIMONIAL_DETAIL', slug: test.slug || String(test.id) })}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
           <div className="text-6xl text-white/5 font-serif mb-4 leading-none group-hover:text-orange-500/10 transition-colors">“</div>
           <p className="text-gray-300 mb-8 relative z-10 leading-relaxed italic">{test.content.length > 150 ? test.content.substring(0, 150) + "..." : test.content}</p>
           <div className="flex items-center gap-4 pt-6 border-t border-white/5">
             <img src={test.author_image} alt={test.author_name} className="w-12 h-12 rounded-full object-cover bg-white/10 ring-2 ring-white/10"/>
             <div>
                <div className="font-bold text-white group-hover:text-orange-400 transition-colors">{test.author_name}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{test.author_title}</div>
             </div>
           </div>
        </div>
      ))}
    </div>
  </main>
);

export const TestimonialDetailView: React.FC<{ slug: string, onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const [test, setTest] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTestimonialDetail(slug).then(setTest).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 text-center text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;
  if (!test) return <div>Testimonial not found</div>;

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col items-center text-center animate-fade-in-up">
      <Button variant="ghost" onClick={() => onNavigate({ type: 'TESTIMONIALS' })} className="mb-12 self-start hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Testimonials
      </Button>
      
      <div className="w-32 h-32 rounded-full p-1.5 bg-gradient-to-br from-orange-400 to-pink-500 mb-10 shadow-2xl shadow-orange-500/20">
         <img src={test.author_image} alt={test.author_name} className="w-full h-full rounded-full object-cover border-4 border-background"/>
      </div>
      
      <h2 className="text-4xl font-bold text-white mb-2">{test.author_name}</h2>
      <div className="text-xl text-orange-400/80 mb-12 font-medium">{test.author_title} at {test.author_company}</div>
      
      <div className="relative glass-card p-10 md:p-14 rounded-3xl">
         <span className="absolute -top-6 -left-4 text-8xl text-orange-500/10 font-serif">“</span>
         <p className="text-2xl text-gray-200 leading-relaxed font-light italic relative z-10">
           {test.content}
         </p>
         <span className="absolute -bottom-16 -right-4 text-8xl text-orange-500/10 font-serif">”</span>
      </div>
      
      <div className="mt-16 pt-8 border-t border-white/10 w-full flex justify-center">
         <div className="text-gray-500 text-sm flex flex-col items-center gap-3">
           <div className="font-bold text-gray-400 uppercase tracking-widest text-xs">Relationship</div>
           <div className="text-lg text-white">{test.relationship}</div>
           {test.linkedin_url && (
              <a href={test.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 font-medium mt-2 hover:underline">
                 View on LinkedIn
              </a>
           )}
         </div>
      </div>
    </main>
  );
};
