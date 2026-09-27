import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, BookOpen, Calendar, Loader2, Search, X, List, LayoutGrid, HelpCircle } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import Gallery from '../components/Gallery';
import { Button } from '../components/Button';
import { MetaTags } from '../components/MetaTags';
import { Breadcrumb, generateBreadcrumbs } from '../components/Breadcrumb';
import { BlogPost, ViewState, PaginatedResponse, BlogCategory } from '../types';
import { api } from '../services/api';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';

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

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query to avoid overflooding the backend with API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 400); // 400ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch paginated data when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: any = { page: currentPage };
        if (debouncedSearchQuery) params.search = debouncedSearchQuery;
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
  }, [debouncedSearchQuery, selectedCategory, selectedTag, currentPage]);

  const [categories, setCategories] = useState<BlogCategory[]>([]);

  // Fetch categories directly from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getBlogCategories();
        setCategories(response.results || []);
      } catch (error) {
        console.error('Failed to fetch categories from backend', error);
      }
    };
    fetchCategories();
  }, []);

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

  if (!loading && posts.length === 0) {
    return (
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
        <MetaTags title="Blog & Insights | Anurag Shankar Maurya" description="Thoughts on software engineering, product design, and the tech industry." />
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] text-black shadow-none"><BookOpen className="w-8 h-8"/></div>
          <div>
            <h1 className="text-4xl font-extrabold text-black">Blog & Insights</h1>
            <p className="text-[#4c4546] mt-2">Thoughts on software engineering, product design, and the tech industry.</p>
          </div>
        </div>
        <EmptyState
          title="Writing Desk is Empty"
          description="Guides, tutorials, and tech stories are currently being drafted. Please check back soon for my latest writings!"
          icon={BookOpen}
          actionText="Back to Home"
          onAction={() => onNavigate({ type: 'HOME' })}
          variant="general"
        />
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
      <MetaTags title={pageTitle} description="Thoughts on software engineering, product design, and the tech industry." />
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-white border border-[#E5E5E5] rounded-[1.5rem] text-black shadow-none"><BookOpen className="w-8 h-8"/></div>
        <div>
          <h1 className="text-4xl font-extrabold text-black">Blog & Insights</h1>
          <p className="text-[#4c4546] mt-2">Thoughts on software engineering, product design, and the tech industry.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7e7576]" />
          <input 
            type="text" 
            placeholder="Search posts..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-12 py-3 bg-white border border-[#cfc4c5] rounded-full text-black placeholder-[#7e7576] focus:outline-none focus:border-black focus:border-[2px] transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7e7576] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-full">
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
              <h3 className="text-xs font-bold text-[#7e7576] uppercase tracking-widest">Category</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${!selectedCategory ? 'bg-black text-white font-semibold' : 'bg-[#F2F2F2] text-[#4c4546] hover:bg-[#eeeeee] border border-transparent hover:border-[#cfc4c5]'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat?.slug}
                  onClick={() => { setSelectedCategory(cat?.slug || null); setCurrentPage(1); }}
                  className={`px-4 py-2 text-sm rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${selectedCategory === cat?.slug ? 'bg-black text-white font-semibold' : 'bg-[#F2F2F2] text-[#4c4546] hover:bg-[#eeeeee] border border-transparent hover:border-[#cfc4c5]'}`}
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
              <h3 className="text-xs font-bold text-[#7e7576] uppercase tracking-widest">Tags</h3>
              {allTags.length > 10 && (
                <button
                  onClick={() => setShowAllTags((prev) => !prev)}
                  className="text-xs px-3 py-1 rounded-full bg-[#eeeeee] border border-[#cfc4c5] text-black hover:bg-[#e2e2e2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
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
                  className="w-full md:max-w-sm px-4 py-2 text-sm bg-white border border-[#cfc4c5] rounded-full text-black placeholder-[#7e7576] focus:outline-none focus:border-black"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { setSelectedTag(null); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-sm rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${!selectedTag ? 'bg-black text-white font-semibold shadow-none' : 'bg-[#F2F2F2] text-[#4c4546] hover:bg-[#eeeeee] border border-transparent hover:border-[#cfc4c5]'}`}
              >
                All
              </button>
              {visibleTags.map(tag => (
                <button 
                  key={tag?.slug}
                  onClick={() => { setSelectedTag(tag?.slug || null); setCurrentPage(1); }}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${selectedTag === tag?.slug ? 'bg-black text-white font-semibold shadow-none' : 'bg-[#F2F2F2] text-[#4c4546] hover:bg-[#eeeeee] border border-transparent hover:border-[#cfc4c5]'}`}
                >
                  {tag?.name}
                </button>
              ))}
            </div>
            {tagSearchQuery && filteredTags.length === 0 && (
              <p className="text-xs text-[#7e7576] mt-2">No tags found for “{tagSearchQuery}”.</p>
            )}
          </div>
        )}
      </div>

      <div className="mb-8 flex items-center justify-end">
        <div className="inline-flex items-center p-1 rounded-full bg-[#f9f9f9] border border-[#E5E5E5]">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${viewMode === 'grid' ? 'bg-black text-white font-bold' : 'text-[#4c4546] hover:bg-[#F2F2F2] hover:text-black'}`}
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${viewMode === 'list' ? 'bg-black text-white font-bold' : 'text-[#4c4546] hover:bg-[#F2F2F2] hover:text-black'}`}
            aria-pressed={viewMode === 'list'}
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <SkeletonLoader type="blog-grid" viewMode={viewMode} />
      ) : paginatedData && paginatedData.results.length > 0 ? (
        <>
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-8'} mb-8`}>
            {paginatedData.results.map((post, index) => (
              <div 
                key={post.id} 
                className={`group bg-white border border-[#E5E5E5] rounded-[1.5rem] sm:rounded-[3rem] p-4 sm:p-10 hover:border-black hover:border-[2px] transition-all duration-300 cursor-pointer shadow-none ${viewMode === 'list' ? 'flex flex-row gap-4 sm:gap-8' : 'flex flex-col'}`}
                onClick={() => onNavigate({ type: 'BLOG_DETAIL', slug: post.slug })}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${viewMode === 'list' ? 'w-24 min-w-24 sm:w-72 sm:min-w-72 mb-0' : 'mb-4'} aspect-[16/10] w-full rounded-[1rem] sm:rounded-[2rem] overflow-hidden relative bg-[#F2F2F2] border border-[#E5E5E5]`}>
                  <img 
                    src={post.featured_image || 'https://placehold.co/600x400/18181b/FFF?text=Blog'} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                    loading="lazy"
                  />
                </div>
                <div className="px-1 flex flex-col flex-grow">
                  <div className="text-[9px] sm:text-[10px] text-black font-bold uppercase tracking-widest mb-1 sm:mb-2">
                    {post.category.name}
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-black mb-1 sm:mb-2 group-hover:text-black transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[#4c4546] text-xs line-clamp-2 leading-[1.4] sm:leading-[1.6] mb-2 sm:mb-4">
                    {post.excerpt}
                  </p>
                  <div className="text-[9px] sm:text-[10px] text-[#7e7576] font-semibold mt-auto flex items-center gap-1.5 sm:gap-3 pt-2 sm:pt-3 border-t border-[#E5E5E5]">
                    <span>{new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="w-1 h-1 rounded-full bg-[#cfc4c5]"></span>
                    <span>{post.reading_time} min read</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {paginatedData.count > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!paginatedData.previous}
                className="px-5 py-2.5 rounded-full bg-[#f9f9f9] border border-[#E5E5E5] text-[#4c4546] font-bold disabled:opacity-30 hover:border-black hover:text-black transition-all"
              >
                Previous
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.ceil(paginatedData.count / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full text-sm font-bold transition-all border shadow-none ${currentPage === page ? 'bg-black border-black text-white' : 'bg-[#f9f9f9] border-[#E5E5E5] text-[#4c4546] hover:border-black hover:text-black'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!paginatedData.next}
                className="px-5 py-2.5 rounded-full bg-[#f9f9f9] border border-[#E5E5E5] text-[#4c4546] font-bold disabled:opacity-30 hover:border-black hover:text-black transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No articles match these filters"
          description="We couldn't find any articles matching your search query or tag/category selections. Try resetting your filters!"
          icon={Search}
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory(null);
            setSelectedTag(null);
            setCurrentPage(1);
          }}
          variant="filter"
        />
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

  if (loading) return <SkeletonLoader type="blog-detail" />;
  if (!post) {
    return (
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto animate-fade-in-up">
        <EmptyState
          title="Article Not Found"
          description="The article you are looking for might have been moved, renamed, or is currently unavailable."
          icon={HelpCircle}
          actionText="Back to Blog"
          onAction={() => onNavigate({ type: 'BLOG' })}
          variant="general"
        />
      </main>
    );
  }

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
        ogImage={post.og_image || post.featured_image}
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
         <div className="inline-block px-4 py-1.5 rounded-full bg-[#F2F2F2] border border-[#E5E5E5] text-black text-xs font-bold uppercase tracking-widest mb-6">
           {post.category.name}
         </div>
         <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-6 leading-tight">{post.title}</h1>
         {post.tags && post.tags.length > 0 && (
           <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
             {post.tags.map(tag => (
               <span key={tag.slug} className="px-3.5 py-1.5 bg-[#F2F2F2] border border-[#E5E5E5] rounded-full text-black text-xs font-semibold hover:border-black transition-all cursor-default">{tag.name}</span>
             ))}
           </div>
         )}
         <div className="flex items-center justify-center gap-6 text-[#7e7576] text-sm font-semibold">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-black"/> {new Date(post.published_at).toLocaleDateString()}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#cfc4c5]"></span>
            <span>{post.reading_time} min read</span>
         </div>
      </div>

      {post.featured_image && post.featured_image.trim() !== '' && (
        <div className="w-full rounded-[3rem] overflow-hidden bg-white border border-[#E5E5E5] p-4 mb-12 shadow-none">
           <button onClick={() => { setLbImages([{ src: post.featured_image, alt: post.title }]); setLbOpen(true); }} className="w-full block">
             <img src={post.featured_image} alt={post.title} className="w-full h-auto max-h-[550px] object-contain rounded-[2rem] cursor-pointer mx-auto" />
           </button>
        </div>
      )}

      <Lightbox images={lbImages} isOpen={lbOpen} onClose={() => setLbOpen(false)} />

      <div className="relative">
        <div ref={contentRef} className="markdown-content" style={expanded ? undefined : { maxHeight: maxHeight ? `${maxHeight}px` : undefined, overflow: 'hidden' }}>
           <MarkdownRenderer content={post.content} />
        </div>
        {needsTruncate && !expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FBFBFB] via-[#FBFBFB]/80 to-transparent pointer-events-none" />
        )}
      </div>
      
      {needsTruncate && (
        <div className="flex justify-center mt-8 relative z-20">
          <Button 
            onClick={() => setExpanded(prev => !prev)} 
            className="px-8 py-3 rounded-full bg-black text-white hover:bg-neutral-800 transition-all font-bold text-sm shadow-none"
          >
            {expanded ? 'Read Less' : 'Read More'}
          </Button>
        </div>
      )}

      {post.images && post.images.length > 0 && (
        <div className="mb-8 mt-12 border-t border-[#E5E5E5] pt-12">
          <h3 className="text-2xl font-extrabold text-black mb-6">Gallery</h3>
          <Gallery images={post.images} />
        </div>
      )}
    </main>
  );
};
