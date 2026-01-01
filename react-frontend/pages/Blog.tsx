
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, BookOpen, Calendar, Loader2, Search, Filter, X } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { Button } from '../components/Button';
import { BlogPost, ViewState } from '../types';
import { api } from '../services/api';

export const BlogView: React.FC<{ posts: BlogPost[], onNavigate: (view: ViewState) => void }> = ({ posts, onNavigate }) => {
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState<{ src: string; alt?: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const openSingle = (src: string, alt?: string) => {
    setLbImages([{ src, alt }]);
    setLbOpen(true);
  };

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(posts.map(p => p.category.slug)))
    .map(slug => posts.find(p => p.category.slug === slug)?.category)
    .filter(Boolean) as any[];

  // Paginate filtered results
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIdx, startIdx + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
    <div className="flex items-center gap-4 mb-12">
      <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]"><BookOpen className="w-8 h-8"/></div>
      <div>
         <h1 className="text-4xl font-bold text-white">Blog & Insights</h1>
         <p className="text-gray-400 mt-2">Thoughts on software engineering, product design, and the tech industry.</p>
      </div>
    </div>

    {/* Search and Filter Bar */}
    <div className="mb-8 space-y-4">
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-purple-500/30 border border-purple-500/50 text-purple-300'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
          {(searchQuery || selectedCategory) && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-500">
        {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {paginatedPosts.map((post, index) => (
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

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="mt-12 flex items-center justify-center gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 disabled:opacity-50 hover:bg-white/10 transition-colors"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              currentPage === page
                ? 'bg-purple-500/30 border border-purple-500/50 text-white'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 disabled:opacity-50 hover:bg-white/10 transition-colors"
        >
          Next
        </button>
      </div>
    )}

    <Lightbox images={lbImages} isOpen={lbOpen} onClose={() => setLbOpen(false)} />
  </main>
  );
};

export const BlogDetailView: React.FC<{ slug: string, onNavigate: (view: ViewState) => void }> = ({ slug, onNavigate }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState<{ src: string; alt?: string }[]>([]);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [needsTruncate, setNeedsTruncate] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);

  useEffect(() => {
    api.getBlogPostDetail(slug).then(setPost).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const el = contentRef.current;
    if (!el) return;
    const style = window.getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight || '20');
    const height = el.scrollHeight;
    const lines = Math.round(height / lineHeight);
    if (lines > 15) {
      setNeedsTruncate(true);
      setMaxHeight(lineHeight * 15);
    } else {
      setNeedsTruncate(false);
      setMaxHeight(null);
    }
  }, [post]);

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
         {post.tags && post.tags.length > 0 && (
           <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
             {post.tags.map(tag => (
               <span key={tag.slug} className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs hover:text-white hover:bg-white/10 transition-colors cursor-default">{tag.name}</span>
             ))}
           </div>
         )}
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

      <div ref={contentRef} className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed" style={expanded ? undefined : { maxHeight: maxHeight ? `${maxHeight}px` : undefined, overflow: 'hidden' }}>
         <p className="whitespace-pre-wrap">{post.content}</p>
      </div>

      {needsTruncate && (
        <div className="mt-6">
          <Button variant="ghost" onClick={() => setExpanded(prev => !prev)}>{expanded ? 'Read less' : 'Read more'}</Button>
        </div>
      )}

      {post.images && post.images.length > 0 && (
        <div className="mb-8 mt-8">
          <h3 className="text-lg font-bold text-white mb-4">Gallery</h3>
          <Gallery images={post.images} columns={3} />
        </div>
      )}
    </main>
  );
};
