from rest_framework import serializers
import base64

from .models import (
    Image, Profile, SocialLink, Skill, Education,
    WorkExperience, Project, Certificate, Achievement,
    BlogCategory, BlogTag, BlogPost, Testimonial, ContactMessage
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
    
    class Meta:
        model = Profile
        fields = [
            'id', 'full_name', 'headline', 'bio', 'profile_image',
            'email', 'phone', 'location',
            'years_of_experience', 'current_role', 'current_company',
            'available_for_hire', 'created_at', 'updated_at'
        ]
    
    def get_profile_image(self, obj):
        """Return profile image as data URI"""
        if obj.profile_image_data:
            b64 = base64.b64encode(obj.profile_image_data).decode('utf-8')
            return f"data:{obj.profile_image_mime};base64,{b64}"
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
