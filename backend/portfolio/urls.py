"""
URL configuration for portfolio project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from api.admin import portfolio_admin_site
from api import views
from django.conf import settings
from django.conf.urls.static import static


def backend_robots_txt(request):
    """
    Prevent search engines from indexing the API and admin backend,
    while permitting sitemap discovery and media serving.
    """
    lines = [
        "User-agent: *",
        "Disallow: /admin/",
        "Disallow: /api/",
        "Allow: /api/sitemap/",
        "Allow: /api/llms.txt/",
        "Allow: /llms.txt",
        "Allow: /media/",
        "",
        "Sitemap: https://backend.anuragshankarmaurya.in/api/sitemap/",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")


urlpatterns = [
    path('robots.txt', backend_robots_txt, name='backend_robots_txt'),
    path('llms.txt', views.LLMsTxtView.as_view(), name='root_llms_txt'),
    path('admin/load-test/', staff_member_required(TemplateView.as_view(template_name='load_test.html')), name='load_test_gui'),
    path('admin/', portfolio_admin_site.urls),
    path('api/', include('api.urls')),
    
    # OpenAPI/Swagger documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
