/**
 * Example: Blog Page with Client-Side Filtering
 * Demonstrates client-side data fetching with filters
 */

'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/lib/hooks';
import { blogApi } from '@/lib';
import type { BlogFilters } from '@/lib';

export function BlogPageExample() {
  const [filters, setFilters] = useState<BlogFilters>({
    ordering: '-published_at',
    page: 1,
  });

  const { data, loading, error } = useApi(
    () => blogApi.list(filters),
    [filters] // Re-fetch when filters change
  );

  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  if (loading) {
    return <div>Loading blog posts...</div>;
  }

  if (error) {
    return <div>Error loading posts: {error.message}</div>;
  }

  if (!data) {
    return <div>No posts found</div>;
  }

  return (
    <div className="blog-container">
      <h1>Blog</h1>

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilters({ ...filters, is_featured: true, page: 1 })}>
          Featured Only
        </button>
        <button onClick={() => setFilters({ ...filters, is_featured: undefined, page: 1 })}>
          All Posts
        </button>
      </div>

      {/* Posts List */}
      <div className="posts-grid">
        {data.results.map((post) => (
          <article key={post.id} className="post-card">
            <img src={post.featured_image} alt={post.featured_image_alt || post.title} />
            <div className="post-meta">
              <span className="category">{post.category.name}</span>
              <span className="reading-time">{post.reading_time} min read</span>
            </div>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="tags">
              {post.tags.map((tag) => (
                <span key={tag.id} className="tag">
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="post-footer">
              <span>By {post.author}</span>
              <span>{new Date(post.published_at || '').toLocaleDateString()}</span>
            </div>
            <a href={`/blog/${post.slug}`}>Read More →</a>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(filters.page! - 1)}
          disabled={!data.previous}
        >
          Previous
        </button>
        <span>Page {filters.page} of {Math.ceil(data.count / 10)}</span>
        <button
          onClick={() => handlePageChange(filters.page! + 1)}
          disabled={!data.next}
        >
          Next
        </button>
      </div>

      <p className="results-count">
        Showing {data.results.length} of {data.count} posts
      </p>
    </div>
  );
}
