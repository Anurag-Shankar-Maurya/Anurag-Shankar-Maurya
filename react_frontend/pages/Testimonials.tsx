import React, { useState, useEffect } from 'react';
import { Star, Loader2, ArrowLeft, Quote, Linkedin, Calendar, Building, User, Briefcase } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { Button } from '../components/Button';
import { Testimonial, ViewState } from '../types';
import { api } from '../services/api';

const RatingStars = ({ rating, size = "sm" }: { rating: number, size?: "sm" | "lg" }) => {
  const iconSize = size === "lg" ? "w-6 h-6" : "w-4 h-4";
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`${iconSize} ${i < rating ? 'fill-orange-400 text-orange-400' : 'text-gray-600'}`} 
        />
      ))}
    </div>
  );
};

export const TestimonialsView: React.FC<{ testimonials: Testimonial[], onNavigate: (view: ViewState) => void }> = ({ testimonials, onNavigate }) => {
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState<{ src: string; alt?: string }[]>([]);

  const openSingle = (src: string, alt?: string) => {
    setLbImages([{ src, alt }]);
    setLbOpen(true);
  };

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
          <Quote className="w-8 h-8"/>
        </div>
        <div>
           <h1 className="text-4xl font-bold text-white">Testimonials</h1>
           <p className="text-gray-400 mt-2">What colleagues and clients say about working with me.</p>
        </div>
      </div>
      
      <div className="columns-1 md:columns-2 lg:columns-2 gap-6 space-y-6">
        {testimonials.map((test, index) => (
          <div 
            key={test.id} 
            className="glass-card p-6 rounded-3xl break-inside-avoid hover:border-orange-500/30 transition-all cursor-pointer group hover:-translate-y-2 hover:bg-white/5 relative overflow-hidden flex flex-col" 
            onClick={() => onNavigate({ type: 'TESTIMONIAL_DETAIL', slug: test.slug || String(test.id) })}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
             {/* Top Row: Stars & Date */}
             <div className="flex justify-between items-center mb-4">
                <RatingStars rating={test.rating} />
                <div className="text-xs text-gray-300 font-medium bg-white/5 px-2 py-1 rounded-md">
                   {new Date(test.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </div>
             </div>

             <div className="relative mb-6 flex-grow">
               <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/5 transform -scale-x-100" />
               <p className="text-gray-300 relative z-10 leading-relaxed text-sm line-clamp-4 pl-4 border-l-2 border-orange-500/20 group-hover:border-orange-500/50 transition-colors">
                  {test.content}
               </p>
             </div>

             <div className="mt-auto pt-5 border-t border-white/5 flex items-center gap-3">
               <img 
                 onClick={(e) => { e.stopPropagation(); openSingle(test.author_image, test.author_name); }} 
                 src={test.author_image} 
                 alt={test.author_name} 
                 className="w-10 h-10 rounded-full object-cover bg-white/10 ring-2 ring-white/10 group-hover:ring-orange-500/30 transition-all cursor-pointer"
               />
               <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                     <div className="font-bold text-white text-sm truncate group-hover:text-orange-400 transition-colors">{test.author_name}</div>
                     {test.linkedin_url && <Linkedin className="w-6 h-6 text-blue-400/50 group-hover:text-blue-400 shrink-0 transition-opacity" />}
                  </div>
                  {test.relationship && (
                    <div className="absolute bottom-0 right-0 p-4 transition-opacity">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 group-hover:text-orange-400">{test.relationship}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 truncate">{test.author_title}</div>
                  {test.author_company && <div className="text-xs text-orange-400/80 font-medium truncate">{test.author_company}</div>}
               </div>
             </div>
          </div>
        ))}
      </div>

      <Lightbox images={lbImages} isOpen={lbOpen} onClose={() => setLbOpen(false)} />
    </main>
  );
};

export const TestimonialDetailView: React.FC<{ slug: string, onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const [test, setTest] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [lbOpen, setLbOpen] = useState(false);

  useEffect(() => {
    api.getTestimonialDetail(slug).then(setTest).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 text-center text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;
  if (!test) return <div>Testimonial not found</div>;

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in-up">
      <Button variant="ghost" onClick={() => onNavigate({ type: 'TESTIMONIALS' })} className="mb-8 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Testimonials
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Author Details */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-8 rounded-3xl text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-50 pointer-events-none"></div>
              
              <div className="relative mx-auto w-32 h-32 rounded-full p-1.5 bg-gradient-to-br from-orange-400 to-pink-500 mb-6 shadow-2xl shadow-orange-500/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => setLbOpen(true)}>
                 <img src={test.author_image} alt={test.author_name} className="w-full h-full rounded-full object-cover border-4 border-background"/>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">{test.author_name}</h2>
              <div className="text-orange-400 font-medium mb-1">{test.author_title}</div>
              {test.author_company && <div className="text-gray-400 text-sm mb-6 flex items-center justify-center gap-1.5"><Building className="w-3 h-3"/> {test.author_company}</div>}
              
              <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><User className="w-3 h-3"/> Relationship</span>
                    <span className="text-gray-300 font-medium">{test.relationship || 'N/A'}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-3 h-3"/> Date</span>
                    <span className="text-gray-300 font-medium">{new Date(test.date).toLocaleDateString()}</span>
                 </div>
              </div>

              {test.linkedin_url && (
                 <a href={test.linkedin_url} target="_blank" rel="noreferrer" className="relative z-10 mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] font-semibold transition-colors border border-[#0077b5]/20">
                    <Linkedin className="w-4 h-4" /> View Profile
                 </a>
              )}
           </div>

           {test.images && test.images.length > 0 && (
            <div className="glass-card p-6 rounded-3xl">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Attached Images</h3>
              <Gallery images={test.images} columns={2} />
            </div>
           )}
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-8">
           <div className="glass-card p-10 md:p-14 rounded-3xl relative">
              <div className="flex items-center gap-4 mb-8">
                 <RatingStars rating={test.rating} size="lg" />
                 <span className="text-gray-500 text-sm">Rated {test.rating}/5</span>
              </div>

              <span className="absolute top-8 right-8 text-8xl text-orange-500/5 font-serif leading-none select-none">“</span>
              
              <div className="prose prose-invert prose-lg max-w-none">
                 <p className="text-xl text-gray-200 leading-relaxed font-light italic relative z-10 whitespace-pre-line">
                   {test.content}
                 </p>
              </div>

              <span className="absolute bottom-8 right-8 text-8xl text-orange-500/5 font-serif leading-none select-none rotate-180">“</span>
           </div>
        </div>
      </div>

      <Lightbox images={[{ src: test.author_image, alt: test.author_name }]} isOpen={lbOpen} onClose={() => setLbOpen(false)} />
    </main>
  );
};
