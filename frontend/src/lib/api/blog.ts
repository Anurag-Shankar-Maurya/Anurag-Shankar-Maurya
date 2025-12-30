/**
 * API Service Layer - Blog Endpoints
 */

import { apiClient } from '../api-client';
import type {
  BlogPost,
  BlogPostList,
  BlogPostDetail,
  BlogCategory,
  BlogTag,
  PaginatedBlogPosts,
  PaginatedBlogCategories,
  PaginatedBlogTags,
  BlogFilters,
  PaginationParams,
  SearchParams,
  OrderingParams,
} from '@/types/api.types';

interface BlogCategoryParams extends PaginationParams, SearchParams, OrderingParams {}
interface BlogTagParams extends PaginationParams, SearchParams, OrderingParams {}

/**
 * Blog API Service
 */
export const blogApi = {
  /**
   * Get all published blog posts (paginated)
   */
  list: (params?: BlogFilters) =>
    apiClient.get<PaginatedBlogPosts>('/blog/', params),

  /**
   * Get blog post by slug (increments view count)
   */
  get: (slug: string) =>
    apiClient.get<BlogPostDetail>(`/blog/${slug}/`),

  /**
   * Get featured blog posts
   */
  getFeatured: () =>
    apiClient.get<BlogPost[]>('/blog/featured/'),

  /**
   * Get posts by category slug
   */
  getByCategory: (categorySlug: string) =>
    apiClient.get<BlogPost[]>(`/blog/category/${categorySlug}/`),

  /**
   * Get posts by tag slug
   */
  getByTag: (tagSlug: string) =>
    apiClient.get<BlogPost[]>(`/blog/tag/${tagSlug}/`),

  // Categories
  categories: {
    /**
     * Get all blog categories
     */
    list: (params?: BlogCategoryParams) =>
      apiClient.get<PaginatedBlogCategories>('/blog/categories/', params),

    /**
     * Get category by slug
     */
    get: (slug: string) =>
      apiClient.get<BlogCategory>(`/blog/categories/${slug}/`),
  },

  // Tags
  tags: {
    /**
     * Get all blog tags
     */
    list: (params?: BlogTagParams) =>
      apiClient.get<PaginatedBlogTags>('/blog/tags/', params),

    /**
     * Get tag by slug
     */
    get: (slug: string) =>
      apiClient.get<BlogTag>(`/blog/tags/${slug}/`),
  },
};
