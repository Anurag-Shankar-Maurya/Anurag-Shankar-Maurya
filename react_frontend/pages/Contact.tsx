import React, { useState } from 'react';
import { Mail, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { MetaTags } from '../components/MetaTags';
import { ProfileDetail } from '../types';
import { api } from '../services/api';
import { getSocialIcon } from '../utils/helpers';

export const Contact: React.FC<{ profile: ProfileDetail | null }> = ({ profile }) => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('sending');
    try {
      await api.sendContact(contactForm);
      setContactStatus('success');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      setContactStatus('error');
    }
  };

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in-up">
      <MetaTags 
        title={`Contact | ${profile?.full_name || "Anurag Shankar Maurya"}`}
        description={`Get in touch with ${profile?.full_name} for freelance projects or job opportunities.`}
        keywords="contact, hire, developer, freelance"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
         <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-6">Get in Touch</h1>
            <p className="text-[#4c4546] text-lg mb-10 leading-[1.6] font-normal">
              I'm currently available for freelance projects and open to full-time opportunities. 
              If you have a project that needs some creative injection then that's where I come in!
            </p>
            
            <div className="space-y-8">
               <div className="bg-white border border-[#E5E5E5] p-5 rounded-[2rem] flex items-center gap-5 group transition-all hover:border-black shadow-none">
                  <div className="w-12 h-12 rounded-full bg-[#eeeeee] flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                     <Mail className="w-5 h-5"/>
                  </div>
                  <div>
                     <div className="text-xs text-[#7e7576] font-bold uppercase tracking-widest mb-1">Email me at</div>
                     <a href={`mailto:${profile?.email}`} className="text-lg font-bold text-black hover:text-black transition-colors">{profile?.email || 'hello@example.com'}</a>
                  </div>
               </div>
               
               <div className="bg-white border border-[#E5E5E5] p-5 rounded-[2rem] flex items-center gap-5 group transition-all hover:border-black shadow-none">
                  <div className="w-12 h-12 rounded-full bg-[#eeeeee] flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                     <MapPin className="w-5 h-5"/>
                  </div>
                  <div>
                     <div className="text-xs text-[#7e7576] font-bold uppercase tracking-widest mb-1">Based in</div>
                     <div className="text-lg font-bold text-black">{profile?.location || 'Remote'}</div>
                  </div>
               </div>
            </div>

            <div className="mt-12 pt-10 border-t border-[#E5E5E5]">
               <h3 className="text-black font-bold mb-6">Connect on Social</h3>
               <div className="flex gap-4 flex-wrap">
                  {profile?.social_links.map(link => (
                     <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-black hover:bg-[#f3f3f3] hover:scale-110 hover:border-black transition-all duration-300 shadow-none">
                        {getSocialIcon(link.platform)}
                     </a>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-white border border-[#E5E5E5] rounded-[3rem] p-10 shadow-none">
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
               <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#4c4546] mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    className="w-full bg-[#f9f9f9] border border-[#cfc4c5] rounded-full px-5 py-3 text-black placeholder-[#7e7576] focus:outline-none focus:border-black focus:border-[2px] hover:bg-[#eeeeee] transition-all"
                    placeholder="John Doe"
                    value={contactForm.name}
                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                  />
               </div>
               <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#4c4546] mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    className="w-full bg-[#f9f9f9] border border-[#cfc4c5] rounded-full px-5 py-3 text-black placeholder-[#7e7576] focus:outline-none focus:border-black focus:border-[2px] hover:bg-[#eeeeee] transition-all"
                    placeholder="john@example.com"
                    value={contactForm.email}
                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                  />
               </div>
               <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-[#4c4546] mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject"
                    required
                    className="w-full bg-[#f9f9f9] border border-[#cfc4c5] rounded-full px-5 py-3 text-black placeholder-[#7e7576] focus:outline-none focus:border-black focus:border-[2px] hover:bg-[#eeeeee] transition-all"
                    placeholder="Project Inquiry"
                    value={contactForm.subject}
                    onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                  />
               </div>
               <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#4c4546] mb-2">Message</label>
                  <textarea 
                    id="message"
                    required
                    rows={4}
                    className="w-full bg-[#f9f9f9] border border-[#cfc4c5] rounded-[2rem] px-5 py-3 text-black placeholder-[#7e7576] focus:outline-none focus:border-black focus:border-[2px] hover:bg-[#eeeeee] transition-all resize-none"
                    placeholder="Tell me about your project..."
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                  />
               </div>

               <Button 
                 variant="primary" 
                 type="submit" 
                 className="w-full py-4 text-base shadow-none bg-black text-white hover:bg-neutral-800 border border-black rounded-full"
                 isLoading={contactStatus === 'sending'}
                 rightIcon={<ArrowRight className="w-5 h-5"/>}
               >
                 Send Message
               </Button>

               {contactStatus === 'success' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-full text-green-600 text-sm text-center font-semibold animate-fade-in">
                     Message sent successfully! I'll get back to you soon.
                  </div>
               )}
               {contactStatus === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full text-red-600 text-sm text-center font-semibold animate-fade-in">
                     Something went wrong. Please try again later.
                  </div>
               )}
            </form>
         </div>
      </div>
    </main>
  );
};
