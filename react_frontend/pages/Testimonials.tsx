import React, { useState, useEffect } from 'react';
import { Star, Loader2, ArrowLeft, Quote, Linkedin, Calendar, Building, User } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { MetaTags } from '../components/MetaTags';
import { Button } from '../components/Button';
import { Testimonial, ViewState } from '../types';
import { api } from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';

const RatingStars = ({ rating, size = "sm" }: { rating: number, size?: "sm" | "lg" }) => {
  const iconSize = size === "lg" ? "w-6 h-6" : "w-4 h-4";
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`${iconSize} ${i < rating ? 'fill-black text-black' : 'text-[#cfc4c5]'}`} 
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
      <MetaTags title="Testimonials | Anurag Shankar Maurya" description="What colleagues and clients say about working with me." />
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] text-black shadow-none">
          <Quote className="w-8 h-8"/>
        </div>
        <div>
           <h1 className="text-4xl font-extrabold text-black">Testimonials</h1>
           <p className="text-[#4c4546] mt-2">What colleagues and clients say about working with me.</p>
        </div>
      </div>
      
      <div className="columns-1 md:columns-2 lg:columns-2 gap-6 space-y-6">
        {testimonials.map((test, index) => (
          <div 
            key={test.id} 
            className="bg-white border border-[#E5E5E5] p-10 rounded-[3rem] break-inside-avoid hover:border-black transition-all cursor-pointer group shadow-none relative overflow-hidden flex flex-col mb-6" 
            onClick={() => onNavigate({ type: 'TESTIMONIAL_DETAIL', slug: test.slug || String(test.id) })}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
             {/* Top Row: Stars & Date */}
             <div className="flex justify-between items-center mb-4">
                 <RatingStars rating={test.rating} />
                 <div className="text-xs font-semibold text-[#4c4546] bg-[#f9f9f9] border border-[#E5E5E5] px-3 py-1 rounded-full">
                    {new Date(test.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                 </div>
             </div>

             <div className="relative mb-6 flex-grow">
               <Quote className="absolute -top-2 -left-2 w-8 h-8 text-black/5 transform -scale-x-100" />
               <p className="text-[#4c4546] relative z-10 leading-relaxed text-sm line-clamp-4 pl-4 border-l-2 border-black/25 group-hover:border-black transition-colors">
                  {test.content}
               </p>
             </div>

             <div className="mt-auto pt-5 border-t border-[#E5E5E5] flex items-center gap-3">
               {test.author_image && (
                 <img 
                   onClick={(e) => { e.stopPropagation(); openSingle(test.author_image, test.author_name); }} 
                   src={test.author_image} 
                   alt={test.author_name} 
                   className="w-10 h-10 rounded-full object-cover bg-white border border-[#E5E5E5] hover:border-black transition-all cursor-pointer"
                 />
               )}
               <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between">
                      <div className="font-bold text-black text-sm truncate group-hover:text-black transition-colors">{test.author_name}</div>
                      {test.linkedin_url && <Linkedin className="w-5 h-5 text-black shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />}
                   </div>
                   {test.relationship && (
                     <div className="absolute bottom-0 right-0 p-4 transition-opacity">
                       <span className="text-[10px] uppercase font-bold tracking-wider text-[#7e7576] group-hover:text-black">{test.relationship}</span>
                     </div>
                   )}
                   <div className="text-xs text-[#7e7576] font-medium truncate">{test.author_title}</div>
                   {test.author_company && <div className="text-xs text-black font-semibold truncate mt-0.5">{test.author_company}</div>}
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

  if (loading) return <SkeletonLoader type="testimonials-detail" />;
  if (!test) return <div>Testimonial not found</div>;

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in-up">
      <MetaTags title={test?.author_name ? `${test.author_name} • Testimonial | Anurag Shankar Maurya` : 'Testimonials | Anurag Shankar Maurya'} description={test?.content} ogImage={test?.author_image} />
      <Button variant="ghost" onClick={() => onNavigate({ type: 'TESTIMONIALS' })} className="mb-8 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Testimonials
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Author Details */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white border border-[#E5E5E5] p-8 rounded-[3rem] text-center relative overflow-hidden group shadow-none">
              
              <div className="relative mx-auto w-32 h-32 rounded-full p-1 bg-[#E5E5E5] mb-6 shadow-none cursor-pointer hover:scale-105 transition-transform" onClick={() => setLbOpen(true)}>
                 <img src={test.author_image} alt={test.author_name} className="w-full h-full rounded-full object-cover border border-[#E5E5E5] bg-white"/>
              </div>
              
              <h2 className="text-2xl font-extrabold text-black mb-2">{test.author_name}</h2>
              <div className="text-black font-semibold mb-1">{test.author_title}</div>
              {test.author_company && <div className="text-[#4c4546] text-sm mb-6 flex items-center justify-center gap-1.5 font-medium"><Building className="w-3.5 h-3.5"/> {test.author_company}</div>}
              
              <div className="flex flex-col gap-3 pt-6 border-t border-[#E5E5E5]">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7e7576] flex items-center gap-2"><User className="w-3.5 h-3.5"/> Relationship</span>
                    <span className="text-black font-semibold">{test.relationship || 'N/A'}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7e7576] flex items-center gap-2"><Calendar className="w-3.5 h-3.5"/> Date</span>
                    <span className="text-black font-semibold">{new Date(test.date).toLocaleDateString()}</span>
                 </div>
              </div>

              {test.linkedin_url && (
                 <Button variant="secondary" onClick={() => window.open(test.linkedin_url, '_blank')} className="w-full mt-6">
                    <Linkedin className="w-4 h-4 mr-2" /> View Profile
                 </Button>
              )}
           </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-8">
           <div className="bg-white border border-[#E5E5E5] p-10 md:p-14 rounded-[3rem] relative shadow-none">
              <div className="flex items-center gap-4 mb-8">
                 <RatingStars rating={test.rating} size="lg" />
                 <span className="text-[#4c4546] font-semibold text-sm">Rated {test.rating}/5</span>
              </div>

              <span className="absolute top-8 right-8 text-8xl text-black/5 font-serif leading-none select-none">“</span>
              
              <div className="prose prose-neutral max-w-none text-[#4c4546] text-lg font-light italic relative z-10 whitespace-pre-line leading-relaxed">
                 {test.content}
              </div>

              <span className="absolute bottom-8 right-8 text-8xl text-black/5 font-serif leading-none select-none rotate-180">“</span>
           </div>
        </div>
      </div>

      {test.images && test.images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-black mb-4">Gallery</h3>
          <Gallery images={test.images} />
        </div>
      )}

      <Lightbox images={[{ src: test.author_image, alt: test.author_name }]} isOpen={lbOpen} onClose={() => setLbOpen(false)} />
    </main>
  );
};
