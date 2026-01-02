
import React, { useState, useEffect } from 'react';
import { Award, ArrowRight, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { Button } from '../components/Button';
import { Certificate, Achievement, ViewState } from '../types';
import { api } from '../services/api';

export const CertificatesView: React.FC<{ certificates: Certificate[], achievements: Achievement[], onNavigate: (view: ViewState) => void }> = ({ certificates, achievements, onNavigate }) => {
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
        <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]"><Award className="w-8 h-8"/></div>
        <div>
           <h1 className="text-4xl font-bold text-white">Certificates</h1>
           <p className="text-gray-400 mt-2">Recognitions and professional validations.</p>
        </div>
      </div>

      <div className="space-y-20">
        {/* Certificates Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><div className="w-2 h-8 bg-blue-500 rounded-full"></div> Professional Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <div 
                key={cert.id} 
                className="glass-card rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all cursor-pointer group hover:-translate-y-2" 
                onClick={() => onNavigate({ type: 'CERTIFICATE_DETAIL', slug: cert.slug || String(cert.id) })}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                 <div className="h-40 bg-gray-900 relative overflow-hidden">
                   <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/10 transition-colors z-10"></div>
                   {cert.certificate_image && <img onClick={(e) => { e.stopPropagation(); openSingle(cert.certificate_image); }} src={cert.certificate_image} alt={cert.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 cursor-pointer"/>}
                 </div>
                 <div className="p-6">
                    <h3 className="font-bold text-white text-lg mb-2 group-hover:text-blue-400 transition-colors leading-snug">{cert.title}</h3>
                    <div className="text-sm text-gray-400 mb-6 font-medium">{cert.issuing_organization}</div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                       <span className="text-xs text-gray-500 font-mono">{new Date(cert.issue_date).toLocaleDateString()}</span>
                       <span className="text-xs font-bold text-blue-400 flex items-center opacity-80 group-hover:opacity-100">View <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1"/></span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><div className="w-2 h-8 bg-yellow-500 rounded-full"></div> Honors & Achievements</h2>
          <div className="space-y-6">
             {achievements.map((ach, index) => (
               <div 
                 key={ach.id} 
                 className="glass-card flex flex-col md:flex-row md:items-center gap-8 rounded-2xl p-6 hover:border-yellow-500/30 transition-all cursor-pointer group hover:bg-white/5" 
                 onClick={() => onNavigate({ type: 'ACHIEVEMENT_DETAIL', slug: ach.slug || String(ach.id) })}
                 style={{ animationDelay: `${0.2 + index * 0.1}s` }}
               >
                 <div className="w-full md:w-56 h-36 md:h-32 rounded-xl bg-gray-900 overflow-hidden flex-shrink-0 relative shadow-lg">
                    {ach.image ? <img onClick={(e) => { e.stopPropagation(); openSingle(ach.image); }} src={ach.image} alt={ach.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"/> : <div className="w-full h-full flex items-center justify-center text-yellow-500 bg-yellow-500/10"><Award className="w-10 h-10"/></div>}
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
        </section>
      </div>

      <Lightbox images={lbImages} initialIndex={lbIndex} isOpen={lbOpen} onClose={() => setLbOpen(false)} />
    </main>
  );
}

export const CertificateDetailView: React.FC<{ slug: string, onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [lbOpen, setLbOpen] = useState(false);

  useEffect(() => {
    api.getCertificateDetail(slug).then(setCert).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 text-center text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;
  if (!cert) return <div>Certificate not found</div>;

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in-up">
      <Button variant="ghost" onClick={() => onNavigate({ type: 'CERTIFICATES' })} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to List
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
         <div className="order-2 md:order-1">
            <div className="text-blue-400 font-bold mb-3 uppercase tracking-wide text-sm">{cert.issuing_organization}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">{cert.title}</h1>
            <div className="space-y-6 text-gray-300 text-lg mb-10">
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Issued on: {new Date(cert.issue_date).toLocaleDateString()}</p>
              {cert.credential_url && (
                <a href={cert.credential_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-500 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-1">
                  Verify Credential <ExternalLink className="w-4 h-4 ml-2"/>
                </a>
              )}
            </div>
            <div className="pt-8 border-t border-white/10">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Skills Validated</h3>
               <div className="flex flex-wrap gap-2">
                  {cert.skills?.split(',').map(s => (
                     <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-sm text-gray-300 hover:text-white transition-colors cursor-default">{s.trim()}</span>
                  ))}
               </div>
            </div>
         </div>
         <div className="glass-card p-2 rounded-2xl shadow-2xl order-1 md:order-2 rotate-1 hover:rotate-0 transition-transform duration-500">
            <button onClick={() => setLbOpen(true)} className="w-full block">
              <img src={cert.certificate_image} alt={cert.title} className="w-full rounded-xl cursor-pointer"/>
            </button>
         </div>
      </div>

      {cert.images && cert.images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-white mb-4">Gallery</h3>
          <Gallery images={cert.images} columns={3} />
        </div>
      )}

      <Lightbox images={[{ src: cert.certificate_image, alt: cert.title }]} isOpen={lbOpen} onClose={() => setLbOpen(false)} />
    </main>
  );
};

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
      <Button variant="ghost" onClick={() => onNavigate({ type: 'CERTIFICATES' })} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to List
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
               <p>{ach.description}</p>
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
