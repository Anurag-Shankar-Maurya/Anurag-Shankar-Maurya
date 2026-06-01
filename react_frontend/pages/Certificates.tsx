
import React, { useState, useEffect } from 'react';
import { Award, ArrowRight, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { Button } from '../components/Button';
import { MetaTags } from '../components/MetaTags';
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
       <MetaTags title="Certificates | Anurag Shankar Maurya" description="Recognitions and professional validations." />
       <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] text-black shadow-none"><Award className="w-8 h-8"/></div>
        <div>
           <h1 className="text-4xl font-extrabold text-black">Certificates</h1>
           <p className="text-[#4c4546] mt-2">Recognitions and professional validations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.map((cert, index) => (
          <div 
            key={cert.id} 
            className="bg-white border border-[#E5E5E5] rounded-[3rem] overflow-hidden hover:border-black transition-all cursor-pointer group shadow-none" 
            onClick={() => onNavigate({ type: 'CERTIFICATE_DETAIL', slug: cert.slug || String(cert.id) })}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
             <div className="h-40 bg-[#F2F2F2] border-b border-[#E5E5E5] relative overflow-hidden">
               <div className="absolute inset-0 bg-[#1a1c1c]/5 z-10"></div>
               {cert.certificate_image && <img onClick={(e) => { e.stopPropagation(); openSingle(cert.certificate_image); }} src={cert.certificate_image} alt={cert.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 cursor-pointer"/>}
             </div>
             <div className="p-6">
                 <div className="flex items-start justify-between gap-4 mb-2">
                   <h3 className="font-bold text-black text-lg group-hover:text-black transition-colors leading-snug flex-1">{cert.title}</h3>
                   {cert.organization_logo && (
                     <div className="w-10 h-10 rounded-lg bg-[#f9f9f9] border border-[#E5E5E5] flex items-center justify-center shrink-0 p-1">
                       <img src={cert.organization_logo} alt={cert.issuing_organization} className="max-w-full max-h-full object-contain" />
                     </div>
                   )}
                 </div>
                 <div className="text-sm font-semibold text-[#4c4546] mb-6">{cert.issuing_organization}</div>
                 <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E5E5E5]">
                    <span className="text-xs text-[#7e7576] font-semibold">{new Date(cert.issue_date).toLocaleDateString()}</span>
                    <span className="text-xs font-bold text-black flex items-center opacity-80 group-hover:opacity-100">View <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1"/></span>
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

  if (loading) return <div className="pt-32 text-center text-black"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;
  if (!cert) return <div>Certificate not found</div>;

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in-up">
      <MetaTags title={cert?.title ? `${cert.title} | Certificate | Anurag Shankar Maurya` : 'Certificates | Anurag Shankar Maurya'} description={cert?.description} ogImage={cert?.certificate_image} />
      <Button variant="ghost" onClick={() => onNavigate({ type: 'CERTIFICATES' })} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to List
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
         <div className="order-2 md:order-1">
            <div className="flex items-center gap-4 mb-4">
              {cert.organization_logo && (
                <div className="w-12 h-12 rounded-xl bg-[#f9f9f9] border border-[#E5E5E5] flex items-center justify-center p-2">
                  <img src={cert.organization_logo} alt={cert.issuing_organization} className="max-w-full max-h-full object-contain" />
                </div>
              )}
              <div className="text-black font-extrabold uppercase tracking-wide text-sm">{cert.issuing_organization}</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-8 leading-tight">{cert.title}</h1>
            <div className="space-y-6 text-[#4c4546] text-lg mb-10">
              <p className="flex items-center gap-3 font-semibold"><span className="w-2 h-2 rounded-full bg-black"></span> Issued on: {new Date(cert.issue_date).toLocaleDateString()}</p>
              {cert.credential_id && (
                <p className="flex items-center gap-3 text-sm text-[#7e7576] font-mono tracking-wider"><span className="w-2 h-2 rounded-full bg-[#cfc4c5]"></span> ID: {cert.credential_id}</p>
              )}
              {cert.description && (
                <div className="prose prose-neutral max-w-none text-[#4c4546] text-base leading-relaxed mb-6 italic border-l-2 border-[#cfc4c5] pl-4 py-1">
                   <p className="whitespace-pre-wrap">{cert.description}</p>
                </div>
              )}
              {cert.credential_url && (
                <Button variant="primary" onClick={() => window.open(cert.credential_url, '_blank')} className="w-fit">
                  Verify Credential <ExternalLink className="w-4 h-4 ml-2"/>
                </Button>
              )}
            </div>
            <div className="pt-8 border-t border-[#E5E5E5]">
               <h3 className="text-xs font-bold text-[#7e7576] uppercase tracking-widest mb-4">Skills Validated</h3>
               <div className="flex flex-wrap gap-2">
                  {cert.skills?.split(',').map(s => (
                     <span key={s} className="px-3 py-1.5 bg-[#F2F2F2] border border-[#E5E5E5] rounded-full text-sm font-semibold text-black hover:border-black transition-colors cursor-default">{s.trim()}</span>
                  ))}
               </div>
            </div>
         </div>
         <div className="bg-white border border-[#E5E5E5] p-2 rounded-[2rem] shadow-none order-1 md:order-2 hover:border-black transition-all">
            <button onClick={() => setLbOpen(true)} className="w-full block">
              <img src={cert.certificate_image} alt={cert.title} className="w-full rounded-[1.5rem] cursor-pointer"/>
            </button>
         </div>
      </div>

      {cert.images && cert.images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-black mb-4">Gallery</h3>
          <Gallery images={cert.images} />
        </div>
      )}

      <Lightbox images={[{ src: cert.certificate_image, alt: cert.title }]} isOpen={lbOpen} onClose={() => setLbOpen(false)} />
    </main>
  );
};
