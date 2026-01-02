
import React, { useState, useEffect } from 'react';
import { Award, ArrowRight, ArrowLeft, Loader2, Trophy } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { Button } from '../components/Button';
import { Achievement, ViewState } from '../types';
import { api } from '../services/api';

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
       <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]"><Trophy className="w-8 h-8"/></div>
        <div>
           <h1 className="text-4xl font-bold text-white">Honors & Achievements</h1>
           <p className="text-gray-400 mt-2">Recognitions, awards, and professional milestones.</p>
        </div>
      </div>

      <div className="space-y-6">
         {achievements.map((ach, index) => (
           <div 
             key={ach.id} 
             className="glass-card flex flex-col md:flex-row md:items-center gap-8 rounded-2xl p-6 hover:border-yellow-500/30 transition-all cursor-pointer group hover:bg-white/5" 
             onClick={() => onNavigate({ type: 'ACHIEVEMENT_DETAIL', slug: ach.slug || String(ach.id) })}
             style={{ animationDelay: `${index * 0.1}s` }}
           >
             <div className="w-full md:w-56 h-36 md:h-32 rounded-xl bg-gray-900 overflow-hidden flex-shrink-0 relative shadow-lg">
                {ach.image ? <img onClick={(e) => { e.stopPropagation(); openSingle(ach.image); }} src={ach.image} alt={ach.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"/> : <div className="w-full h-full flex items-center justify-center text-yellow-500 bg-yellow-500/10"><Trophy className="w-10 h-10"/></div>}
             </div>
             <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{ach.title}</h3>
                   <span className="text-xs font-bold bg-yellow-500/10 text-yellow-500 px-2.5 py-1 rounded border border-yellow-500/20 uppercase tracking-wide">{ach.achievement_type}</span>
                </div>
                <div className="text-sm text-gray-400 mb-3 font-medium flex items-center gap-2">
                  <span className="text-white">{ach.issuer}</span> 
                  <span className="w-1 h-1 rounded-full bg-gray-600"></span> 
                  <span>{new Date(ach.date).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300 line-clamp-2 text-sm leading-relaxed">{ach.description}</p>
             </div>
           </div>
         ))}
      </div>

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

  if (loading) return <div className="pt-32 text-center text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;
  if (!ach) return <div>Achievement not found</div>;

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in-up">
      <Button variant="ghost" onClick={() => onNavigate({ type: 'ACHIEVEMENTS' })} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Achievements
      </Button>
      
      <div className="glass-card rounded-3xl overflow-hidden mb-10">
         <div className="w-full h-80 relative">
            <button onClick={() => setLbOpen(true)} className="w-full h-full block">
              <img src={ach.image} alt={ach.title} className="w-full h-full object-cover cursor-pointer"/>
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/50 to-transparent"></div>
            <div className="absolute bottom-8 left-8">
               <span className="px-3 py-1 bg-yellow-500 text-black font-bold text-xs rounded uppercase mb-4 inline-block shadow-lg">{ach.achievement_type}</span>
               <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{ach.title}</h1>
               <div className="flex items-center gap-3 text-gray-300 font-medium">
                  <span className="text-yellow-400">{ach.issuer}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                  <span>{new Date(ach.date).toLocaleDateString()}</span>
               </div>
            </div>
         </div>
         
         <div className="p-8 md:p-12">
            <div className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed">
               <p className="whitespace-pre-wrap">{ach.description}</p>
            </div>
            
            {ach.url && (
               <div className="mt-10 pt-8 border-t border-white/10">
                  <a href={ach.url} target="_blank" rel="noreferrer" className="text-yellow-400 hover:text-yellow-300 font-bold flex items-center gap-2 group w-fit">
                     View Official Announcement <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </a>
               </div>
            )}
         </div>
      </div>

      {ach.images && ach.images.length > 0 && (
        <div className="mt-8 px-8 md:px-12">
          <h3 className="text-lg font-bold text-white mb-4">Gallery</h3>
          <Gallery images={ach.images} columns={3} />
        </div>
      )}

      <Lightbox images={[{ src: ach.image, alt: ach.title }]} isOpen={lbOpen} onClose={() => setLbOpen(false)} />
    </main>
  );
};
