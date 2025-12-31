
import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Calendar, Loader2 } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { Button } from '../components/Button';
import { BlogPost, ViewState } from '../types';
import { api } from '../services/api';

export const BlogView: React.FC<{ posts: BlogPost[], onNavigate: (view: ViewState) => void }> = ({ posts, onNavigate }) => {
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState<{ src: string; alt?: string }[]>([]);

  const openSingle = (src: string, alt?: string) => {
    setLbImages([{ src, alt }]);
    setLbOpen(true);
  };

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
    <div className="flex items-center gap-4 mb-12">
      <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]"><BookOpen className="w-8 h-8"/></div>
      <div>
         <h1 className="text-4xl font-bold text-white">Blog & Insights</h1>
         <p className="text-gray-400 mt-2">Thoughts on software engineering, product design, and the tech industry.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <div 
          key={post.id} 
          className="group flex flex-col cursor-pointer glass-card rounded-2xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10" 
          onClick={() => onNavigate({ type: 'BLOG_DETAIL', slug: post.slug })}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 relative">
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
             <button onClick={(e) => { e.stopPropagation(); openSingle(post.featured_image || 'https://placehold.co/600x400/18181b/FFF?text=Blog', post.title); }} className="w-full h-full block">
             <img src={post.featured_image || 'https://placehold.co/600x400/18181b/FFF?text=Blog'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" />
             </button>
             <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs font-medium text-white border border-white/10 shadow-lg">
               {post.category.name}
             </div>
          </div>
          <div className="px-2 pb-2">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
               <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-purple-400"/> {new Date(post.published_at).toLocaleDateString()}</span>
               <span>•</span>
               <span>{post.reading_time} min read</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors leading-tight">{post.title}</h3>
            <p className="text-gray-400 line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>
          </div>
        </div>
      ))}
    </div>
  </main>
  );
};

export const BlogDetailView: React.FC<{ slug: string, onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState<{ src: string; alt?: string }[]>([]);

  useEffect(() => {
    api.getBlogPostDetail(slug).then(setPost).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 text-center text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;
  if (!post) return <div>Post not found</div>;

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in-up">
      <Button variant="ghost" onClick={() => onNavigate({ type: 'BLOG' })} className="mb-8 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4 mr-2"/> Back to Blog
      </Button>

      <div className="mb-10 text-center">
         <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
           {post.category.name}
         </div>
         <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
         <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {new Date(post.published_at).toLocaleDateString()}</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span>{post.reading_time} min read</span>
         </div>
      </div>

      <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden glass-card p-1 mb-12">
         <button onClick={() => { setLbImages([{ src: post.featured_image, alt: post.title }]); setLbOpen(true); }} className="w-full block">
           <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover rounded-xl cursor-pointer"/>
         </button>
      </div>

      <Lightbox images={lbImages} isOpen={lbOpen} onClose={() => setLbOpen(false)} />

      {post.images && post.images.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Gallery</h3>
          <Gallery images={post.images} columns={3} />
        </div>
      )}

      <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
         <p className="whitespace-pre-wrap">{post.content}</p>
      </div>

      <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-2">
         {post.tags.map(tag => (
            <span key={tag.slug} className="px-4 py-1.5 rounded-full bg-white/5 text-gray-400 text-sm hover:text-white hover:bg-white/10 transition-colors cursor-default">#{tag.name}</span>
         ))}
      </div>
    </main>
  );
};
