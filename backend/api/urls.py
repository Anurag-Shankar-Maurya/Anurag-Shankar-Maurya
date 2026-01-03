from django.urls import path, include
from . import views
from django.urls import path

urlpatterns = [
    # Profiles
    path('profiles/', views.ProfileViewSet.as_view({'get': 'list'}), name='profile-list'),
    path('profiles/<int:pk>/', views.ProfileViewSet.as_view({'get': 'retrieve'}), name='profile-detail'),
    path('profiles/<int:pk>/resume/', views.ProfileViewSet.as_view({'get': 'resume'}), name='profile-resume'),
    path('profiles/<int:pk>/photo/', views.ProfileViewSet.as_view({'get': 'photo'}), name='profile-photo'),

    # Social links
    path('social-links/', views.SocialLinkViewSet.as_view({'get': 'list'}), name='sociallink-list'),
    path('social-links/<int:pk>/', views.SocialLinkViewSet.as_view({'get': 'retrieve'}), name='sociallink-detail'),

    # Skills
    path('skills/', views.SkillViewSet.as_view({'get': 'list'}), name='skill-list'),
    path('skills/<slug:slug>/', views.SkillViewSet.as_view({'get': 'retrieve'}), name='skill-detail'),

    # Education
    path('education/', views.EducationViewSet.as_view({'get': 'list'}), name='education-list'),
    path('education/<slug:slug>/', views.EducationViewSet.as_view({'get': 'retrieve'}), name='education-detail'),
    path('education/<slug:slug>/logo/', views.EducationViewSet.as_view({'get': 'logo'}), name='education-logo'),

    # Work experience
    path('work-experience/', views.WorkExperienceViewSet.as_view({'get': 'list'}), name='workexperience-list'),
    path('work-experience/<int:pk>/', views.WorkExperienceViewSet.as_view({'get': 'retrieve'}), name='workexperience-detail'),
    path('work-experience/<int:pk>/logo/', views.WorkExperienceViewSet.as_view({'get': 'logo'}), name='workexperience-logo'),

    # Projects
    path('projects/', views.ProjectViewSet.as_view({'get': 'list'}), name='project-list'),
    path('projects/featured/', views.ProjectViewSet.as_view({'get': 'featured'}), name='project-featured'),
    path('projects/<slug:slug>/', views.ProjectViewSet.as_view({'get': 'retrieve'}), name='project-detail'),
    path('projects/<slug:slug>/image/', views.ProjectViewSet.as_view({'get': 'image'}), name='project-image'),

    # Certificates & Achievements
    path('certificates/', views.CertificateViewSet.as_view({'get': 'list'}), name='certificate-list'),
    path('certificates/<slug:slug>/', views.CertificateViewSet.as_view({'get': 'retrieve'}), name='certificate-detail'),
    path('certificates/<slug:slug>/org-logo/', views.CertificateViewSet.as_view({'get': 'org_logo'}), name='certificate-org-logo'),
    path('certificates/<slug:slug>/cert-image/', views.CertificateViewSet.as_view({'get': 'cert_image'}), name='certificate-image'),
    path('achievements/', views.AchievementViewSet.as_view({'get': 'list'}), name='achievement-list'),
    path('achievements/<slug:slug>/', views.AchievementViewSet.as_view({'get': 'retrieve'}), name='achievement-detail'),
    path('achievements/<slug:slug>/image/', views.AchievementViewSet.as_view({'get': 'image'}), name='achievement-image'),

    # Blog categories & tags
    path('blog/categories/', views.BlogCategoryViewSet.as_view({'get': 'list'}), name='blogcategory-list'),
    path('blog/categories/<slug:slug>/', views.BlogCategoryViewSet.as_view({'get': 'retrieve'}), name='blogcategory-detail'),
    path('blog/tags/', views.BlogTagViewSet.as_view({'get': 'list'}), name='blogtag-list'),
    path('blog/tags/<slug:slug>/', views.BlogTagViewSet.as_view({'get': 'retrieve'}), name='blogtag-detail'),

    # Blog posts
    path('blog/', views.BlogPostViewSet.as_view({'get': 'list'}), name='blogpost-list'),
    path('blog/featured/', views.BlogPostViewSet.as_view({'get': 'featured'}), name='blogpost-featured'),
    path('blog/category/<slug:category_slug>/', views.BlogPostViewSet.as_view({'get': 'by_category'}), name='blogpost-by-category'),
    path('blog/tag/<slug:tag_slug>/', views.BlogPostViewSet.as_view({'get': 'by_tag'}), name='blogpost-by-tag'),
    path('blog/<slug:slug>/', views.BlogPostViewSet.as_view({'get': 'retrieve'}), name='blogpost-detail'),
    path('blog/<slug:slug>/image/', views.BlogPostViewSet.as_view({'get': 'image'}), name='blogpost-image'),
    path('blog/<slug:slug>/og-image/', views.BlogPostViewSet.as_view({'get': 'og_image'}), name='blogpost-og-image'),

    # Testimonials
    path('testimonials/', views.TestimonialViewSet.as_view({'get': 'list'}), name='testimonial-list'),
    path('testimonials/featured/', views.TestimonialViewSet.as_view({'get': 'featured'}), name='testimonial-featured'),
    path('testimonials/<slug:slug>/', views.TestimonialViewSet.as_view({'get': 'retrieve'}), name='testimonial-detail'),
    path('testimonials/<slug:slug>/photo/', views.TestimonialViewSet.as_view({'get': 'photo'}), name='testimonial-photo'),

    # Contact
    path('contact/', views.ContactMessageViewSet.as_view({'post': 'create'}), name='contact-create'),

    # Images
    path('images/', views.ImageViewSet.as_view({'get': 'list'}), name='image-list'),
    path('images/<int:pk>/', views.ImageViewSet.as_view({'get': 'retrieve'}), name='image-detail'),
    path('images/<int:pk>/data/', views.ImageViewSet.as_view({'get': 'data'}), name='image-data'),

    # Site configuration
    path('config/', views.SiteConfigurationViewSet.as_view({'get': 'list'}), name='config-list'),
    path('config/current/', views.SiteConfigurationViewSet.as_view({'get': 'current'}), name='config-current'),
]
