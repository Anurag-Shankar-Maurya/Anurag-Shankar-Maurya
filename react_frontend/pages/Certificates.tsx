
import React, { useState, useEffect } from 'react';
import { Award, ArrowRight, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { Button } from '../components/Button';
import { Certificate, ViewState } from '../types';
import { api } from '../services/api';

export const CertificatesView: React.FC<{ certificates: Certificate[], onNavigate: (view: ViewState) => void }> = ({ certificates, onNavigate }) => {
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
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors leading-snug flex-1">{cert.title}</h3>
                  {cert.organization_logo && (
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 p-1">
                      <img src={cert.organization_logo} alt={cert.issuing_organization} className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-400 mb-6 font-medium">{cert.issuing_organization}</div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                   <span className="text-xs text-gray-500 font-mono">{new Date(cert.issue_date).toLocaleDateString()}</span>
                   <span className="text-xs font-bold text-blue-400 flex items-center opacity-80 group-hover:opacity-100">View <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1"/></span>
                </div>
             </div>
          </div>
        ))}
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
            <div className="flex items-center gap-4 mb-4">
              {cert.organization_logo && (
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                  <img src={cert.organization_logo} alt={cert.issuing_organization} className="max-w-full max-h-full object-contain" />
                </div>
              )}
              <div className="text-blue-400 font-bold uppercase tracking-wide text-sm">{cert.issuing_organization}</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">{cert.title}</h1>
            <div className="space-y-6 text-gray-300 text-lg mb-10">
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Issued on: {new Date(cert.issue_date).toLocaleDateString()}</p>
              {cert.credential_id && (
                <p className="flex items-center gap-3 text-sm text-gray-400 font-mono tracking-wider"><span className="w-2 h-2 rounded-full bg-gray-600"></span> ID: {cert.credential_id}</p>
              )}
              {cert.description && (
                <div className="prose prose-invert max-w-none text-gray-300 text-base leading-relaxed mb-6 italic border-l-2 border-blue-500/30 pl-4 py-1">
                   <p className="whitespace-pre-wrap">{cert.description}</p>
                </div>
              )}
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
          <Gallery images={cert.images} />
        </div>
      )}

      <Lightbox images={[{ src: cert.certificate_image, alt: cert.title }]} isOpen={lbOpen} onClose={() => setLbOpen(false)} />
    </main>
  );
};
