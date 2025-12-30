from rest_framework import serializers
import base64

from .models import (
    Image, Profile, SocialLink, Skill, Education,
    WorkExperience, Project, Certificate, Achievement,
    BlogCategory, BlogTag, BlogPost, Testimonial, ContactMessage,
    SiteConfiguration
)


# ============================================
# IMAGE SERIALIZER
# ============================================

class ImageSerializer(serializers.ModelSerializer):
    """Serializer for Image model with base64 encoding"""
    image_url = serializers.SerializerMethodField()
    data_uri = serializers.SerializerMethodField()
    
    class Meta:
        model = Image
        fields = [
            'id', 'filename', 'mime_type', 'file_size', 'width', 'height',
            'image_type', 'alt_text', 'caption', 'order',
            'image_url', 'data_uri', 'created_at'
        ]
    
    def get_image_url(self, obj):
        """Return API endpoint for image"""
        if obj.pk:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f'/api/images/{obj.pk}/data/')
        return None
    
    def get_data_uri(self, obj):
        """Return image as data URI"""
        return obj.get_data_uri()


# ============================================
# PROFILE SERIALIZERS
# ============================================

class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['id', 'platform', 'url', 'icon', 'order']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'skill_type', 'proficiency', 'icon', 'order']


class ProfileSerializer(serializers.ModelSerializer):
    """Basic profile serializer for list view"""
    profile_image = serializers.SerializerMethodField()
    resume_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = [
            'id', 'full_name', 'headline', 'bio', 'profile_image',
            'email', 'phone', 'location',
            'years_of_experience', 'current_role', 'current_company',
            'available_for_hire', 'resume_filename', 'resume_url',
            'created_at', 'updated_at'
        ]
    
    def get_profile_image(self, obj):
        """Return profile image as data URI"""
        if obj.profile_image_data:
            b64 = base64.b64encode(obj.profile_image_data).decode('utf-8')
            return f"data:{obj.profile_image_mime};base64,{b64}"
        return None
    
    def get_resume_url(self, obj):
        """Return resume download URL"""
        if obj.resume_data and obj.resume_filename:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f'/api/profiles/{obj.pk}/resume/')
        return None


class ProfileDetailSerializer(ProfileSerializer):
    """Detailed profile serializer with related data"""
    social_links = SocialLinkSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, read_only=True)
    
    class Meta(ProfileSerializer.Meta):
        fields = ProfileSerializer.Meta.fields + ['social_links', 'skills', 'images']


# ============================================
# EDUCATION SERIALIZER
# ============================================

class EducationSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    images = ImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'field_of_study',
            'start_date', 'end_date', 'is_current', 'grade',
            'description', 'location', 'logo', 'images'
        ]
    
    def get_logo(self, obj):
        """Return logo as data URI"""
        if obj.logo_data:
            b64 = base64.b64encode(obj.logo_data).decode('utf-8')
            return f"data:{obj.logo_mime};base64,{b64}"
        return None


# ============================================
# WORK EXPERIENCE SERIALIZER
# ============================================

class WorkExperienceSerializer(serializers.ModelSerializer):
    company_logo = serializers.SerializerMethodField()
    images = ImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = WorkExperience
        fields = [
            'id', 'company_name', 'company_logo', 'company_url',
            'job_title', 'employment_type', 'work_mode', 'location',
            'start_date', 'end_date', 'is_current',
            'description', 'achievements', 'technologies_used',
            'order', 'images'
        ]
    
    def get_company_logo(self, obj):
        """Return company logo as data URI"""
        if obj.company_logo_data:
            b64 = base64.b64encode(obj.company_logo_data).decode('utf-8')
            return f"data:{obj.company_logo_mime};base64,{b64}"
        return None


# ============================================
# PROJECT SERIALIZERS
# ============================================

class ProjectSerializer(serializers.ModelSerializer):
    """Basic project serializer for list view"""
    featured_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description',
            'featured_image', 'featured_image_alt',
            'live_url', 'github_url', 'demo_url',
            'technologies', 'status', 'is_featured',
            'order', 'created_at', 'updated_at'
        ]
    
    def get_featured_image(self, obj):
        """Return featured image as data URI"""
        if obj.featured_image_data:
            b64 = base64.b64encode(obj.featured_image_data).decode('utf-8')
            return f"data:{obj.featured_image_mime};base64,{b64}"
        return None


class ProjectDetailSerializer(ProjectSerializer):
    """Detailed project serializer with full data"""
    images = ImageSerializer(many=True, read_only=True)
    
    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + [
            'description', 'role', 'team_size',
            'start_date', 'end_date', 'images'
        ]


# ============================================
# CERTIFICATE SERIALIZER
# ============================================

class CertificateSerializer(serializers.ModelSerializer):
    organization_logo = serializers.SerializerMethodField()
    certificate_image = serializers.SerializerMethodField()
    images = ImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Certificate
        fields = [
            'id', 'title', 'issuing_organization', 'organization_logo',
            'issue_date', 'expiry_date', 'does_not_expire',
            'credential_id', 'credential_url', 'certificate_image',
            'description', 'skills', 'order', 'images'
        ]
    
    def get_organization_logo(self, obj):
        """Return organization logo as data URI"""
        if obj.organization_logo_data:
            b64 = base64.b64encode(obj.organization_logo_data).decode('utf-8')
            return f"data:{obj.organization_logo_mime};base64,{b64}"
        return None
    
    def get_certificate_image(self, obj):
        """Return certificate image as data URI"""
        if obj.certificate_image_data:
            b64 = base64.b64encode(obj.certificate_image_data).decode('utf-8')
            return f"data:{obj.certificate_image_mime};base64,{b64}"
        return None


# ============================================
# ACHIEVEMENT SERIALIZER
# ============================================

class AchievementSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    images = ImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'title', 'achievement_type', 'issuer', 'date',
            'description', 'url', 'image', 'order', 'images'
        ]
    
    def get_image(self, obj):
        """Return achievement image as data URI"""
        if obj.image_data:
            b64 = base64.b64encode(obj.image_data).decode('utf-8')
            return f"data:{obj.image_mime};base64,{b64}"
        return None


# ============================================
# BLOG SERIALIZERS
# ============================================

class BlogCategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description', 'order', 'post_count']
    
    def get_post_count(self, obj):
        return obj.posts.filter(status='published').count()


class BlogTagSerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogTag
        fields = ['id', 'name', 'slug', 'post_count']
    
    def get_post_count(self, obj):
        return obj.posts.filter(status='published').count()


class BlogPostListSerializer(serializers.ModelSerializer):
    """Serializer for blog post list view"""
    featured_image = serializers.SerializerMethodField()
    category = BlogCategorySerializer(read_only=True)
    tags = BlogTagSerializer(many=True, read_only=True)
    author = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image',
            'featured_image_alt', 'category', 'tags', 'author',
            'status', 'published_at', 'reading_time', 'views_count',
            'is_featured', 'created_at', 'updated_at'
        ]
    
    def get_featured_image(self, obj):
        """Return featured image as data URI"""
        if obj.featured_image_data:
            b64 = base64.b64encode(obj.featured_image_data).decode('utf-8')
            return f"data:{obj.featured_image_mime};base64,{b64}"
        return None
    
    def get_author(self, obj):
        """Return basic author info"""
        return {
            'id': obj.profile.id,
            'name': obj.profile.full_name
        }


class BlogPostSerializer(BlogPostListSerializer):
    """Basic blog post serializer"""
    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + ['content']


class BlogPostDetailSerializer(BlogPostSerializer):
    """Detailed blog post serializer with SEO data"""
    images = ImageSerializer(many=True, read_only=True)
    og_image = serializers.SerializerMethodField()
    
    class Meta(BlogPostSerializer.Meta):
        fields = BlogPostSerializer.Meta.fields + [
            'images', 'allow_comments',
            'meta_title', 'meta_description', 'meta_keywords',
            'canonical_url', 'og_title', 'og_description', 'og_image',
            'schema_type'
        ]
    
    def get_og_image(self, obj):
        """Return OG image as data URI"""
        if obj.og_image_data:
            b64 = base64.b64encode(obj.og_image_data).decode('utf-8')
            return f"data:{obj.og_image_mime};base64,{b64}"
        return None


# ============================================
# TESTIMONIAL SERIALIZER
# ============================================

class TestimonialSerializer(serializers.ModelSerializer):
    author_image = serializers.SerializerMethodField()
    images = ImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Testimonial
        fields = [
            'id', 'author_name', 'author_title', 'author_company',
            'author_image', 'content', 'rating', 'relationship',
            'linkedin_url', 'is_featured', 'date', 'order', 'images'
        ]
    
    def get_author_image(self, obj):
        """Return author image as data URI"""
        if obj.author_image_data:
            b64 = base64.b64encode(obj.author_image_data).decode('utf-8')
            return f"data:{obj.author_image_mime};base64,{b64}"
        return None


# ============================================
# CONTACT MESSAGE SERIALIZER
# ============================================

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'subject', 'message']
        extra_kwargs = {
            'phone': {'required': False}
        }


# ============================================
# SITE CONFIGURATION SERIALIZER
# ============================================

class SiteConfigurationSerializer(serializers.ModelSerializer):
    """Serializer for site configuration - used by frontend to fetch UI configuration"""
    
    # Deserialize protected_routes from JSON string to list and vice versa
    protected_routes = serializers.SerializerMethodField()
    
    # Compose display config
    display = serializers.SerializerMethodField()
    
    # Compose style config
    style = serializers.SerializerMethodField()
    
    # Compose schema config
    schema = serializers.SerializerMethodField()
    
    # Compose social links (same_as)
    same_as = serializers.SerializerMethodField()
    
    # Compose social sharing config
    social_sharing = serializers.SerializerMethodField()
    
    # Compose routes config
    routes = serializers.SerializerMethodField()
    
    class Meta:
        model = SiteConfiguration
        fields = [
            'site_name',
            'site_description',
            'base_url',
            'display',
            'style',
            'schema',
            'same_as',
            'social_sharing',
            'protected_routes',
            'routes',
        ]
    
    def get_protected_routes(self, obj):
        """Parse protected routes from JSON string"""
        import json
        if obj.protected_routes:
            try:
                return json.loads(obj.protected_routes)
            except json.JSONDecodeError:
                return []
        return []
    
    def get_display(self, obj):
        """Compose display configuration"""
        return {
            'location': obj.display_location,
            'time': obj.display_time,
            'themeSwitcher': obj.display_theme_switcher,
        }
    
    def get_style(self, obj):
        """Compose style configuration"""
        return {
            'theme': obj.theme,
            'neutral': obj.neutral_color,
            'brand': obj.brand_color,
            'accent': obj.accent_color,
            'solid': 'contrast',  # This is typically fixed in UI
            'solidStyle': obj.solid_style,
            'border': obj.border_style,
            'surface': obj.surface_style,
            'transition': obj.transition_style,
            'scaling': str(obj.scaling),
        }
    
    def get_schema(self, obj):
        """Compose schema configuration"""
        return {
            'logo': '',
            'type': obj.schema_type,
            'name': obj.site_name,
            'description': obj.site_description,
            'email': obj.schema_email,
        }
    
    def get_same_as(self, obj):
        """Compose same_as (social links) configuration"""
        same_as = {}
        if obj.threads_url:
            same_as['threads'] = obj.threads_url
        if obj.linkedin_url:
            same_as['linkedin'] = obj.linkedin_url
        if obj.discord_url:
            same_as['discord'] = obj.discord_url
        return same_as
    
    def get_social_sharing(self, obj):
        """Compose social sharing configuration"""
        return {
            'display': obj.enable_social_sharing,
            'platforms': {
                'x': obj.share_on_x,
                'linkedin': obj.share_on_linkedin,
                'facebook': obj.share_on_facebook,
                'pinterest': obj.share_on_pinterest,
                'whatsapp': obj.share_on_whatsapp,
                'reddit': obj.share_on_reddit,
                'telegram': obj.share_on_telegram,
                'email': obj.share_email,
                'copyLink': obj.share_copy_link,
            }
        }
    
    def get_routes(self, obj):
        """Compose routes configuration"""
        return {
            '/': obj.enable_route_home,
            '/about': obj.enable_route_about,
            '/work': obj.enable_route_work,
            '/blog': obj.enable_route_blog,
            '/gallery': obj.enable_route_gallery,
        }
