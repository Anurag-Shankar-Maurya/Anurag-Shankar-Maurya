
import React, { useState, useEffect } from 'react';
import { Award, ArrowRight, ArrowLeft, Loader2, Trophy, HelpCircle } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { Button } from '../components/Button';
import { MetaTags } from '../components/MetaTags';
import { Achievement, ViewState } from '../types';
import { api } from '../services/api';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';

export const AchievementsView: React.FC<{ achievements: Achievement[], onNavigate: (view: ViewState) => void }> = ({ achievements, onNavigate }) => {
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState<{ src: string; alt?: string; caption?: string }[]>([]);
  const [lbIndex, setLbIndex] = useState(0);

  const openSingle = (src: string, alt?: string) => {
    setLbImages([{ src, alt }]);
    setLbIndex(0);
    setLbOpen(true);
  };

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fade-in-up">
       <MetaTags title="Honors & Achievements | Anurag Shankar Maurya" description="Recognitions, awards, and professional milestones." />
       <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] text-black shadow-none"><Trophy className="w-8 h-8"/></div>
        <div>
           <h1 className="text-4xl font-extrabold text-black">Honors & Achievements</h1>
           <p className="text-[#4c4546] mt-2">Recognitions, awards, and professional milestones.</p>
        </div>
      </div>

      {achievements.length === 0 ? (
        <EmptyState
          title="Trophy Cabinet is Empty"
          description="Recognitions, professional honors, and key industry milestones are currently being gathered. Check back soon!"
          icon={Trophy}
          variant="general"
        />
      ) : (
        <div className="space-y-6">
           {achievements.map((ach, index) => (
              <div 
                key={ach.id} 
                className="bg-white border border-[#E5E5E5] flex flex-col md:flex-row md:items-center gap-8 rounded-[3rem] p-10 hover:border-black transition-all cursor-pointer group shadow-none" 
                onClick={() => onNavigate({ type: 'ACHIEVEMENT_DETAIL', slug: ach.slug || String(ach.id) })}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-full md:w-56 h-36 md:h-32 rounded-[2rem] bg-[#F2F2F2] border border-[#E5E5E5] overflow-hidden flex-shrink-0 relative shadow-none">
                   {ach.image ? <img onClick={(e) => { e.stopPropagation(); openSingle(ach.image); }} src={ach.image} alt={ach.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"/> : <div className="w-full h-full flex items-center justify-center text-black bg-[#F2F2F2]"><Trophy className="w-10 h-10"/></div>}
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="text-xl font-bold text-black group-hover:text-black transition-colors">{ach.title}</h3>
                      <span className="text-xs font-semibold bg-[#F2F2F2] text-black px-3 py-1.5 rounded-full border border-[#E5E5E5] uppercase tracking-wide shrink-0">{ach.achievement_type}</span>
                   </div>
                   <div className="text-sm font-semibold text-[#4c4546] mb-3 flex items-center gap-2">
                     <span className="text-black font-bold">{ach.issuer}</span> 
                     <span className="w-1.5 h-1.5 rounded-full bg-[#cfc4c5]"></span> 
                     <span>{new Date(ach.date).toLocaleDateString()}</span>
                   </div>
                   <p className="text-[#4c4546] line-clamp-2 text-sm leading-relaxed">{ach.description}</p>
                </div>
              </div>
           ))}
        </div>
      )}

      <Lightbox images={lbImages} initialIndex={lbIndex} isOpen={lbOpen} onClose={() => setLbOpen(false)} />
    </main>
  );
}

export const AchievementDetailView: React.FC<{ slug: string, onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const [ach, setAch] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(true);
  const [lbOpen, setLbOpen] = useState(false);

  useEffect(() => {
    api.getAchievementDetail(slug).then(setAch).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <SkeletonLoader type="achievement-detail" />;
  if (!ach) {
    return (
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in-up">
        <EmptyState
          title="Achievement Record Not Found"
          description="The honors or professional milestone record you are looking for may have been moved, renamed, or is currently unavailable."
          icon={HelpCircle}
          actionText="Back to Achievements"
          onAction={() => onNavigate({ type: 'ACHIEVEMENTS' })}
          variant="general"
        />
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in-up">
      <MetaTags title={ach?.title ? `${ach.title} | Achievements | Anurag Shankar Maurya` : 'Achievements | Anurag Shankar Maurya'} description={ach?.description} ogImage={ach?.image} />
      <Button variant="ghost" onClick={() => onNavigate({ type: 'ACHIEVEMENTS' })} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Achievements
      </Button>
      
      <div className="bg-white border border-[#E5E5E5] rounded-[3rem] overflow-hidden mb-10 shadow-none">
         <div className="w-full h-80 bg-[#F2F2F2] border-b border-[#E5E5E5] relative overflow-hidden">
            <button onClick={() => setLbOpen(true)} className="w-full h-full block">
              <img src={ach.image} alt={ach.title} className="w-full h-full object-cover cursor-pointer opacity-90 hover:opacity-100 transition-opacity"/>
            </button>
         </div>
         
         <div className="p-10 md:p-12">
            <span className="px-3 py-1.5 bg-[#F2F2F2] border border-[#E5E5E5] text-black font-semibold text-xs rounded-full uppercase mb-4 inline-block">{ach.achievement_type}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-4 leading-tight">{ach.title}</h1>
            <div className="flex items-center gap-3 text-[#4c4546] font-semibold text-sm mb-8">
               <span className="text-black font-bold">{ach.issuer}</span>
               <span className="w-1.5 h-1.5 rounded-full bg-[#cfc4c5]"></span>
               <span>{new Date(ach.date).toLocaleDateString()}</span>
            </div>

            <div className="prose prose-neutral max-w-none text-[#4c4546] text-lg leading-relaxed">
               <p className="whitespace-pre-wrap">{ach.description}</p>
            </div>
            
            {ach.url && (
               <div className="mt-10 pt-8 border-t border-[#E5E5E5]">
                  <a href={ach.url} target="_blank" rel="noreferrer" className="text-black hover:text-black font-bold flex items-center gap-2 group w-fit">
                     View Official Announcement <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </a>
               </div>
            )}
         </div>
      </div>

      {ach.images && ach.images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-black mb-4">Gallery</h3>
          <Gallery images={ach.images} />
        </div>
      )}

      <Lightbox images={[{ src: ach.image, alt: ach.title }]} isOpen={lbOpen} onClose={() => setLbOpen(false)} />
    </main>
  );
};
