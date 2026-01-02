
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Get in Touch</h1>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
              I'm currently available for freelance projects and open to full-time opportunities. 
              If you have a project that needs some creative injection then that's where I come in!
            </p>
            
            <div className="space-y-8">
               <div className="glass-card p-4 rounded-2xl flex items-center gap-5 group transition-all hover:border-blue-500/30">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                     <Mail className="w-6 h-6"/>
                  </div>
                  <div>
                     <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Email me at</div>
                     <a href={`mailto:${profile?.email}`} className="text-lg font-bold text-white hover:text-blue-400 transition-colors">{profile?.email || 'hello@example.com'}</a>
                  </div>
               </div>
               
               <div className="glass-card p-4 rounded-2xl flex items-center gap-5 group transition-all hover:border-green-500/30">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                     <MapPin className="w-6 h-6"/>
                  </div>
                  <div>
                     <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Based in</div>
                     <div className="text-lg font-bold text-white">{profile?.location || 'Remote'}</div>
                  </div>
               </div>
            </div>

            <div className="mt-12 pt-10 border-t border-white/10">
               <h3 className="text-white font-bold mb-6">Connect on Social</h3>
               <div className="flex gap-4 flex-wrap">
                  {profile?.social_links.map(link => (
                     <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:scale-110 hover:border-white/20 transition-all duration-300 shadow-lg">
                        {getSocialIcon(link.platform)}
                     </a>
                  ))}
               </div>
            </div>
         </div>

         <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
               <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all hover:bg-black/40"
                    placeholder="John Doe"
                    value={contactForm.name}
                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                  />
               </div>
               <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all hover:bg-black/40"
                    placeholder="john@example.com"
                    value={contactForm.email}
                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                  />
               </div>
               <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject"
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all hover:bg-black/40"
                    placeholder="Project Inquiry"
                    value={contactForm.subject}
                    onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                  />
               </div>
               <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                  <textarea 
                    id="message"
                    required
                    rows={4}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none hover:bg-black/40"
                    placeholder="Tell me about your project..."
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                  />
               </div>

               <Button 
                 variant="primary" 
                 type="submit" 
                 className="w-full py-4 text-base shadow-xl shadow-blue-500/20"
                 isLoading={contactStatus === 'sending'}
                 rightIcon={<ArrowRight className="w-5 h-5"/>}
               >
                 Send Message
               </Button>

               {contactStatus === 'success' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center animate-fade-in">
                     Message sent successfully! I'll get back to you soon.
                  </div>
               )}
               {contactStatus === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center animate-fade-in">
                     Something went wrong. Please try again later.
                  </div>
               )}
            </form>
         </div>
      </div>
    </main>
  );
};
