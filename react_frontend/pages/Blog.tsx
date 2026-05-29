
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, BookOpen, Calendar, Loader2, Search, X, List, LayoutGrid } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { Button } from '../components/Button';
import { MetaTags } from '../components/MetaTags';
import { Breadcrumb, generateBreadcrumbs } from '../components/Breadcrumb';
import { BlogPost, ViewState, PaginatedResponse } from '../types';
import { api } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const BlogView: React.FC<{ posts: BlogPost[], onNavigate: (view: ViewState) => void }> = ({ posts, onNavigate }) => {
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState<{ src: string; alt?: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<BlogPost> | null>(null);
  const [loading, setLoading] = useState(false);
  const ITEMS_PER_PAGE = 15;

  // Fetch paginated data when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: any = { page: currentPage };
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedTag) params.tags = selectedTag;
        params.limit = ITEMS_PER_PAGE;
        
        const data = await api.getBlogPosts(params);
        setPaginatedData(data);
      } catch (error) {
        console.error('Failed to fetch blog posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, selectedCategory, selectedTag, currentPage]);

  // Extract unique categories and tags from initial posts
  const categories = Array.from(new Set(posts.map(p => p.category.slug))).map(slug => {
    const post = posts.find(p => p.category.slug === slug);
    return post?.category;
  }).filter(Boolean);

  const uniqueTags = Array.from(new Set(posts.flatMap(p => p.tags.map(t => t.slug))));
  const allTags = uniqueTags
    .map((slug) => posts.flatMap(p => p.tags).find((t) => t.slug === slug))
    .filter(Boolean);
  const filteredTags = allTags.filter((tag) => tag?.name.toLowerCase().includes(tagSearchQuery.toLowerCase()));
  const visibleTags = showAllTags ? filteredTags : filteredTags.slice(0, 10);

  // Compute a dynamic page title so filters show in the browser tab
  const pageTitle = selectedCategory
    ? `${categories.find(c => c?.slug === selectedCategory)?.name || selectedCategory} | Blog | Anurag Shankar Maurya`
    : selectedTag
    ? `${allTags.find(t => t?.slug === selectedTag)?.name || selectedTag} | Blog | Anurag Shankar Maurya`
    : 'Blog & Insights | Anurag Shankar Maurya';

  const openSingle = (src: string, alt?: string) => {
    setLbImages([{ src, alt }]);
    setLbOpen(true);
  };

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
      <MetaTags title={pageTitle} description="Thoughts on software engineering, product design, and the tech industry." />
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]"><BookOpen className="w-8 h-8"/></div>
        <div>
          <h1 className="text-4xl font-bold text-white">Blog & Insights</h1>
          <p className="text-gray-400 mt-2">Thoughts on software engineering, product design, and the tech industry.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search posts..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus-visible:ring-2 focus-visible:ring-purple-400/70 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 rounded-md">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {categories.length > 0 && (
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-semibold text-gray-400">Category</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 ${!selectedCategory ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat?.slug}
                  onClick={() => { setSelectedCategory(cat?.slug || null); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 ${selectedCategory === cat?.slug ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  {cat?.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {allTags.length > 0 && (
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-semibold text-gray-400">Tags</h3>
              {allTags.length > 10 && (
                <button
                  onClick={() => setShowAllTags((prev) => !prev)}
                  className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-gray-300 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
                >
                  {showAllTags ? 'Show less' : `Show all (${allTags.length})`}
                </button>
              )}
            </div>
            {allTags.length > 10 && (
              <div className="mb-3">
                <input
                  type="text"
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full md:max-w-sm px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus-visible:ring-2 focus-visible:ring-purple-400/70"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { setSelectedTag(null); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 ${!selectedTag ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                All
              </button>
              {visibleTags.map(tag => (
                <button 
                  key={tag?.slug}
                  onClick={() => { setSelectedTag(tag?.slug || null); setCurrentPage(1); }}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 ${selectedTag === tag?.slug ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  {tag?.name}
                </button>
              ))}
            </div>
            {tagSearchQuery && filteredTags.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">No tags found for “{tagSearchQuery}”.</p>
            )}
          </div>
        )}
      </div>

      <div className="mb-8 flex items-center justify-end">
        <div className="inline-flex items-center p-1 rounded-lg bg-white/5 border border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-300 hover:bg-white/5'}`}
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-300 hover:bg-white/5'}`}
            aria-pressed={viewMode === 'list'}
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid grid-cols-1'} gap-6 mb-8`}>
          {Array.from({ length: viewMode === 'grid' ? 6 : 4 }).map((_, idx) => (
            <div key={idx} className={`glass-card rounded-2xl overflow-hidden animate-pulse ${viewMode === 'list' ? 'flex gap-4 p-4 items-start' : ''}`}>
              <div className={`${viewMode === 'list' ? 'w-56 h-36 rounded-xl' : 'w-full aspect-video'} bg-white/5`} />
              <div className={`${viewMode === 'list' ? 'flex-1' : 'p-6'}`}>
                <div className="h-5 w-3/4 bg-white/10 rounded mb-3" />
                <div className="h-4 w-full bg-white/5 rounded mb-2" />
                <div className="h-4 w-2/3 bg-white/5 rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-white/5 rounded" />
                  <div className="h-6 w-20 bg-white/5 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : paginatedData && paginatedData.results.length > 0 ? (
        <>
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'} mb-8`}>
            {paginatedData.results.map((post, index) => (
              <div 
                key={post.id} 
                className={`group cursor-pointer glass-card rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 ${viewMode === 'grid' ? 'flex flex-col p-4' : 'flex flex-col md:flex-row gap-4 p-4 items-start'}`}
                onClick={() => onNavigate({ type: 'BLOG_DETAIL', slug: post.slug })}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${viewMode === 'list' ? 'md:w-72 md:min-w-72 mb-0' : 'mb-6'} aspect-video w-full rounded-xl overflow-hidden relative`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <button onClick={(e) => { e.stopPropagation(); openSingle(post.featured_image || 'https://placehold.co/600x400/18181b/FFF?text=Blog', post.title); }} className="w-full h-full block">
                    <img src={post.featured_image || 'https://placehold.co/600x400/18181b/FFF?text=Blog'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" />
                  </button>
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs font-medium text-white border border-white/10 shadow-lg">
                    {post.category.name}
                  </div>
                </div>
                <div className={`${viewMode === 'list' ? 'pt-1 px-2 pb-1' : 'px-2 pb-2'} flex flex-col flex-grow`}>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-purple-400"/> {new Date(post.published_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.reading_time} min read</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors leading-tight">{post.title}</h3>
                  <p className="text-gray-400 line-clamp-2 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag.slug} className="px-2 py-1 text-xs bg-white/5 rounded-md text-gray-300 border border-white/5 hover:bg-white/10 transition-colors cursor-default">{tag.name}</span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-500">+{post.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {paginatedData.count > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!paginatedData.previous}
                className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(paginatedData.count / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!paginatedData.next}
                className="px-4 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No posts found matching your filters.</p>
        </div>
      )}
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

  const authorName = typeof post.author === 'string' ? post.author : (post.author as any)?.name || "Anurag Shankar Maurya";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": post.schema_type || "BlogPosting",
    "headline": post.title,
    "image": [post.featured_image],
    "datePublished": post.published_at,
    "dateModified": post.updated_at || post.published_at,
    "author": [{
      "@type": "Person",
      "name": authorName,
      "url": window.location.origin
    }],
    "description": post.meta_description || post.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in-up">
      <MetaTags 
        title={`${post.meta_title || post.title} | Anurag Shankar Maurya`}
        description={post.meta_description || post.excerpt}
        keywords={post.meta_keywords}
        canonical={post.canonical_url || window.location.href}
        ogTitle={post.og_title || post.title}
        ogDescription={post.og_description || post.excerpt}
        ogImage={(post as any).og_image || post.featured_image}
        ogType="article"
        publishedTime={post.published_at}
        modifiedTime={post.updated_at}
        author={authorName}
        schemaData={schemaData}
      />
      <Breadcrumb 
        items={generateBreadcrumbs({ type: 'BLOG_DETAIL', slug }, post.title)} 
        onNavigate={onNavigate} 
      />

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

      {post.featured_image && post.featured_image.trim() !== '' && (
        <div className="w-full rounded-2xl overflow-hidden glass-card p-1 mb-12">
           <button onClick={() => { setLbImages([{ src: post.featured_image, alt: post.title }]); setLbOpen(true); }} className="w-full block">
             <img src={post.featured_image} alt={post.title} className="w-full h-auto max-h-[550px] object-contain rounded-xl cursor-pointer mx-auto" />
           </button>
        </div>
      )}

      <Lightbox images={lbImages} isOpen={lbOpen} onClose={() => setLbOpen(false)} />

      <div ref={contentRef} className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed" style={expanded ? undefined : { maxHeight: maxHeight ? `${maxHeight}px` : undefined, overflow: 'hidden' }}>
         <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      {needsTruncate && (
        <div className="mt-6">
          <Button variant="ghost" onClick={() => setExpanded(prev => !prev)}>{expanded ? 'Read less' : 'Read more'}</Button>
        </div>
      )}

      {post.images && post.images.length > 0 && (
        <div className="mb-8 mt-8">
          <h3 className="text-lg font-bold text-white mb-4">Gallery</h3>
          <Gallery images={post.images} />
        </div>
      )}
    </main>
  );
};
