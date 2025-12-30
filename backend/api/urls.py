from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProfileViewSet, SocialLinkViewSet, SkillViewSet,
    EducationViewSet, WorkExperienceViewSet,
    ProjectViewSet, CertificateViewSet, AchievementViewSet,
    BlogCategoryViewSet, BlogTagViewSet, BlogPostViewSet,
    TestimonialViewSet, ContactMessageViewSet, ImageViewSet,
    SiteConfigurationViewSet
)

# Create a router and register our viewsets
router = DefaultRouter()

# Profile & Related
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'social-links', SocialLinkViewSet, basename='sociallink')
router.register(r'skills', SkillViewSet, basename='skill')

# Education & Work
router.register(r'education', EducationViewSet, basename='education')
router.register(r'work-experience', WorkExperienceViewSet, basename='workexperience')

# Projects
router.register(r'projects', ProjectViewSet, basename='project')

# Certificates & Achievements
router.register(r'certificates', CertificateViewSet, basename='certificate')
router.register(r'achievements', AchievementViewSet, basename='achievement')

# Blog
router.register(r'blog/categories', BlogCategoryViewSet, basename='blogcategory')
router.register(r'blog/tags', BlogTagViewSet, basename='blogtag')
router.register(r'blog', BlogPostViewSet, basename='blogpost')

# Testimonials
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')

# Contact
router.register(r'contact', ContactMessageViewSet, basename='contact')

# Images
router.register(r'images', ImageViewSet, basename='image')

# Configuration
router.register(r'config', SiteConfigurationViewSet, basename='config')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
]
