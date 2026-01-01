from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
import base64

from .models import (
    Image, Profile, SocialLink, Skill, Education,
    WorkExperience, Project, Certificate, Achievement,
    BlogCategory, BlogTag, BlogPost, Testimonial, ContactMessage,
    SiteConfiguration
)
from .serializers import (
    ImageSerializer, ProfileSerializer, ProfileDetailSerializer,
    SocialLinkSerializer, SkillSerializer, EducationSerializer,
    WorkExperienceSerializer, ProjectSerializer, ProjectDetailSerializer,
    CertificateSerializer, AchievementSerializer,
    BlogCategorySerializer, BlogTagSerializer, 
    BlogPostSerializer, BlogPostDetailSerializer, BlogPostListSerializer,
    TestimonialSerializer, ContactMessageSerializer, SiteConfigurationSerializer
)


# ============================================
# PROFILE VIEWSET
# ============================================

@extend_schema_view(
    list=extend_schema(tags=['Profile'], description='List all profiles'),
    retrieve=extend_schema(tags=['Profile'], description='Retrieve profile details with related data'),
)
class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Profile model.
    GET /api/profile/ - List all profiles
    GET /api/profile/{id}/ - Retrieve single profile with full details
    """
    queryset = Profile.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProfileDetailSerializer
        return ProfileSerializer
    
    @action(detail=True, methods=['get'])
    def resume(self, request, pk=None):
        """Download resume file"""
        from django.http import HttpResponse
        profile = self.get_object()
        if profile.resume_data and profile.resume_filename:
            response = HttpResponse(
                profile.resume_data,
                content_type=profile.resume_mime or 'application/pdf'
            )
            response['Content-Disposition'] = f'attachment; filename="{profile.resume_filename}"'
            return response
        return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)


# ============================================
# RELATED MODELS VIEWSETS
# ============================================

class SocialLinkViewSet(viewsets.ReadOnlyModelViewSet):
    """Social links for a profile"""
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['profile', 'platform', 'show_on_home']


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    """Skills for a profile"""
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['profile', 'skill_type', 'proficiency', 'show_on_home']


class EducationViewSet(viewsets.ReadOnlyModelViewSet):
    """Education history"""
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['profile', 'is_current', 'show_on_home']


class WorkExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    """Work experience history"""
    queryset = WorkExperience.objects.all()
    serializer_class = WorkExperienceSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['profile', 'employment_type', 'work_mode', 'is_current', 'show_on_home']
    search_fields = ['company_name', 'job_title', 'description', 'technologies_used']
    ordering_fields = ['start_date', 'company_name']


# ============================================
# PROJECTS VIEWSET
# ============================================

@extend_schema_view(
    list=extend_schema(tags=['Projects'], description='List all visible projects'),
    retrieve=extend_schema(tags=['Projects'], description='Retrieve project details by slug'),
    featured=extend_schema(tags=['Projects'], description='Get featured projects'),
)
class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Portfolio projects
    GET /api/projects/ - List all visible projects
    GET /api/projects/{slug}/ - Retrieve single project by slug
    GET /api/projects/featured/ - Get featured projects
    """
    queryset = Project.objects.filter(is_visible=True)
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['profile', 'status', 'is_featured', 'show_on_home']
    search_fields = ['title', 'short_description', 'description', 'technologies']
    ordering_fields = ['created_at', 'order', 'title']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured projects"""
        projects = self.queryset.filter(is_featured=True)
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)


# ============================================
# CERTIFICATES & ACHIEVEMENTS VIEWSETS
# ============================================

class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    """Professional certifications"""
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['profile', 'does_not_expire', 'show_on_home']
    search_fields = ['title', 'issuing_organization', 'skills']
    ordering_fields = ['issue_date', 'order']


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """Awards, honors, and achievements"""
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['profile', 'achievement_type', 'show_on_home']
    search_fields = ['title', 'issuer', 'description']
    ordering_fields = ['date', 'order']


# ============================================
# BLOG VIEWSETS
# ============================================

@extend_schema(tags=['Blog'])
class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Blog categories"""
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


@extend_schema(tags=['Blog'])
class BlogTagViewSet(viewsets.ReadOnlyModelViewSet):
    """Blog tags"""
    queryset = BlogTag.objects.all()
    serializer_class = BlogTagSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


@extend_schema_view(
    list=extend_schema(tags=['Blog'], description='List published blog posts (paginated)'),
    retrieve=extend_schema(tags=['Blog'], description='Retrieve blog post by slug (increments view count)'),
    featured=extend_schema(tags=['Blog'], description='Get featured blog posts'),
    by_category=extend_schema(tags=['Blog'], description='Get posts by category slug'),
    by_tag=extend_schema(tags=['Blog'], description='Get posts by tag slug'),
)
class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Blog posts with SEO support
    GET /api/blog/ - List published posts
    GET /api/blog/{slug}/ - Retrieve single post by slug
    GET /api/blog/featured/ - Get featured posts
    GET /api/blog/category/{category_slug}/ - Filter by category
    """
    queryset = BlogPost.objects.filter(status='published').select_related('category', 'profile').prefetch_related('tags')
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['profile', 'category', 'tags', 'is_featured', 'show_on_home']
    search_fields = ['title', 'excerpt', 'content', 'meta_keywords', 'tags__name']
    ordering_fields = ['published_at', 'views_count', 'reading_time']
    ordering = ['-published_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BlogPostListSerializer
        elif self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Increment view count when retrieving a post"""
        instance = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured blog posts"""
        posts = self.queryset.filter(is_featured=True)
        serializer = BlogPostListSerializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='category/(?P<category_slug>[^/.]+)')
    def by_category(self, request, category_slug=None):
        """Get posts by category slug"""
        posts = self.queryset.filter(category__slug=category_slug)
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = BlogPostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = BlogPostListSerializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='tag/(?P<tag_slug>[^/.]+)')
    def by_tag(self, request, tag_slug=None):
        """Get posts by tag slug"""
        posts = self.queryset.filter(tags__slug=tag_slug)
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = BlogPostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = BlogPostListSerializer(posts, many=True)
        return Response(serializer.data)


# ============================================
# TESTIMONIALS VIEWSET
# ============================================

class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """Client/colleague testimonials"""
    queryset = Testimonial.objects.filter(is_visible=True)
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['profile', 'is_featured', 'rating', 'show_on_home']
    ordering_fields = ['date', 'order', 'rating']
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured testimonials"""
        testimonials = self.queryset.filter(is_featured=True)
        serializer = self.get_serializer(testimonials, many=True)
        return Response(serializer.data)


# ============================================
# CONTACT MESSAGE VIEWSET
# ============================================

@extend_schema_view(
    create=extend_schema(tags=['Contact'], description='Submit contact form'),
)
class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    Contact form submissions
    POST /api/contact/ - Submit contact form
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post']  # Only allow POST for public API
    
    def create(self, request, *args, **kwargs):
        """Create a new contact message"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {'message': 'Thank you for your message. We will get back to you soon!'},
            status=status.HTTP_201_CREATED
        )


# ============================================
# IMAGE VIEWSET
# ============================================

class ImageViewSet(viewsets.ReadOnlyModelViewSet):
    """Gallery images"""
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['image_type', 'content_type', 'object_id', 'show_on_home']


# ============================================
# SITE CONFIGURATION VIEWSET
# ============================================

@extend_schema_view(
    list=extend_schema(tags=['Configuration'], description='Get site configuration for frontend'),
)
class SiteConfigurationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for SiteConfiguration.
    GET /api/config/ - Get the current site configuration
    """
    queryset = SiteConfiguration.objects.all()
    serializer_class = SiteConfigurationSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Always return the singleton configuration
        return SiteConfiguration.objects.filter(pk=1)
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current site configuration - preferred endpoint"""
        config = SiteConfiguration.get_config()
        serializer = self.get_serializer(config)
        return Response(serializer.data)
