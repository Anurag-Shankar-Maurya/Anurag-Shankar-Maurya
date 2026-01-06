from django.contrib import admin
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.utils.html import format_html
from django.contrib.contenttypes.admin import GenericTabularInline
from django import forms
from django.core.files.uploadedfile import UploadedFile

from .models import (
    Image, Profile, SocialLink, Skill, Education,
    WorkExperience, Project, Certificate, Achievement,
    BlogCategory, BlogTag, BlogPost, Testimonial, ContactMessage,
    SiteConfiguration
)

# ============================================
# CUSTOM ADMIN SITE (Regrouping)
# ============================================

class PortfolioAdminSite(admin.AdminSite):
    site_header = "Portfolio Management"
    site_title = "Portfolio Admin"
    index_title = "Welcome to Portfolio Management Dashboard"

    def get_app_list(self, request, app_label=None):
        """
        Custom regrouping of models into logical sections.
        """
        app_dict = self._build_app_dict(request, app_label)
        if not app_dict:
            return []

        # Get all models from our 'api' app
        api_models = app_dict.get('api', {}).get('models', [])
        auth_models = app_dict.get('auth', {}).get('models', [])

        # Map model names to their objects
        model_map = {model['object_name'].lower(): model for model in api_models}

        # Define custom groups matching user request
        groups = [
            {
                'name': '1. Portfolio Showcase',
                'app_label': 'portfolio_showcase',
                'models': [
                    model_map.get('profile'),
                    model_map.get('project'),
                    model_map.get('skill'),
                    model_map.get('certificate'),
                    model_map.get('achievement'),
                ]
            },
            {
                'name': '2. Career & Social',
                'app_label': 'career_social',
                'models': [
                    model_map.get('education'),
                    model_map.get('workexperience'),
                    model_map.get('sociallink'),
                    model_map.get('testimonial'),
                ]
            },
            {
                'name': '3. Editorial & Media',
                'app_label': 'editorial_media',
                'models': [
                    model_map.get('blogpost'),
                    model_map.get('blogcategory'),
                    model_map.get('blogtag'),
                    model_map.get('image'),
                ]
            },
            {
                'name': '4. Infrastructure & Communication',
                'app_label': 'infrastructure_comm',
                'models': [
                    model_map.get('siteconfiguration'),
                    model_map.get('contactmessage'),
                ]
            }
        ]

        # Clean up: remove missing models
        for group in groups:
            group['models'] = [m for m in group['models'] if m]
            # Ensure permissions are shown (default in app_dict)
            group['has_module_perms'] = True

        result = [g for g in groups if g['models']]
        if auth_models:
             result.append({
                'name': 'User Management',
                'app_label': 'auth',
                'models': auth_models,
                'has_module_perms': True
            })

        return result

# Instantiate custom site
portfolio_admin_site = PortfolioAdminSite(name='portfolio_admin')

# Register Auth models
portfolio_admin_site.register(User, UserAdmin)
portfolio_admin_site.register(Group, GroupAdmin)


# ============================================
# CUSTOM FORMS WITH FILE UPLOAD
# ============================================

class ImageAdminForm(forms.ModelForm):
    """Custom form for Image model with file upload and external URL"""
    external_image_url = forms.URLField(required=False, label='External Image URL', help_text='Optional URL to an externally hosted image (CDN)')
    upload_image = forms.FileField(required=False, label='Upload Image', help_text='Upload an image file')
    clear_image = forms.BooleanField(required=False, label='Clear Image', help_text='Check to remove the current image')

    class Meta:
        model = Image
        exclude = ['image_file']  # Exclude model's FileField to avoid conflict

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            if getattr(self.instance, 'image_url', None):
                self.fields['external_image_url'].help_text = f'✓ Current: External URL set ({self.instance.image_url}). Upload file to replace or clear to remove.'
            elif getattr(self.instance, 'image_file', None):
                size = getattr(self.instance.image_file, 'size', 0)
                self.fields['upload_image'].help_text = f'✓ Current: Image file present ({size} bytes). Upload new file to replace.'

    def save(self, commit=True):
        instance = super().save(commit=False)
        external_url = self.cleaned_data.get('external_image_url')
        image_file = self.cleaned_data.get('upload_image')

        # Handle clear checkbox
        if self.cleaned_data.get('clear_image'):
            instance.image_url = ''
            if instance.image_file:
                try:
                    instance.image_file.delete(save=False)
                except Exception:
                    pass
            instance.filename = ''
            instance.file_size = 0
            instance.width = None
            instance.height = None
        # If an external URL is provided, prefer it and remove any stored file
        elif external_url:
            instance.image_url = external_url
            if instance.image_file:
                try:
                    instance.image_file.delete(save=False)
                except Exception:
                    pass
        # Only process newly uploaded files (UploadedFile with non-zero size)
        elif isinstance(image_file, UploadedFile) and getattr(image_file, 'size', 0) > 0:
            from PIL import Image as PILImage

            # Try to get dimensions without reading entire file into memory
            try:
                img = PILImage.open(image_file)
                instance.width, instance.height = img.size
                image_file.seek(0)
            except Exception:
                instance.width = None
                instance.height = None
            # Save file to model's ImageField
            instance.filename = getattr(image_file, 'name', '')
            instance.mime_type = _get_mime_type(image_file, fallback='image/jpeg')
            instance.file_size = getattr(image_file, 'size', 0)
            instance.image_file.save(getattr(image_file, 'name', ''), image_file, save=False)

        if commit:
            instance.save()
        return instance


class ProfileAdminForm(forms.ModelForm):
    """Custom form for Profile model with file uploads and external URLs"""
    profile_image_url = forms.URLField(required=False, label='Profile Image URL', help_text='External profile image URL (CDN)')
    upload_profile_image = forms.ImageField(
        required=False,
        label='Upload Profile Image',
        help_text='Current profile image will be replaced if new file is uploaded'
    )
    clear_profile_image = forms.BooleanField(required=False, label='Clear Profile Image', help_text='Check to remove the profile image')
    resume_url = forms.URLField(required=False, label='Resume URL', help_text='External resume URL (PDF)')
    upload_resume = forms.FileField(
        required=False,
        label='Upload Resume',
        help_text='Upload PDF, DOC, DOCX or TXT file. Current resume will be replaced if new file is uploaded'
    )
    clear_resume = forms.BooleanField(required=False, label='Clear Resume', help_text='Check to remove the resume')

    class Meta:
        model = Profile
        exclude = ['profile_image_file', 'resume_file']  # Exclude model FileFields

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Show current file/URL status
        if self.instance and self.instance.pk:
            if getattr(self.instance, 'profile_image_url', None):
                self.fields['profile_image_url'].help_text = f'✓ Current: External image URL set ({self.instance.profile_image_url}). Upload file to replace or clear to remove.'
            elif self.instance.profile_image_file:
                size = getattr(self.instance.profile_image_file, 'size', 0)
                self.fields['upload_profile_image'].help_text = f'✓ Current: Profile image file present ({size} bytes). Upload new file to replace.'
            if getattr(self.instance, 'resume_url', None):
                self.fields['resume_url'].help_text = f'✓ Current: External resume URL set.'
            elif self.instance.resume_file:
                size = getattr(self.instance.resume_file, 'size', 0)
                resume_name = self.instance.resume_filename or getattr(self.instance.resume_file, 'name', 'resume')
                self.fields['upload_resume'].help_text = f'✓ Current: {resume_name} ({size} bytes). Upload new file to replace.'

    def save(self, commit=True):
        instance = super().save(commit=False)

        # Handle clear profile image
        if self.cleaned_data.get('clear_profile_image'):
            instance.profile_image_url = ''
            if instance.profile_image_file:
                try:
                    instance.profile_image_file.delete(save=False)
                except Exception:
                    pass
            instance.profile_image_mime = ''
        # If an external URL is provided, prefer it and remove any stored file
        elif self.cleaned_data.get('profile_image_url'):
            instance.profile_image_url = self.cleaned_data.get('profile_image_url')
            if instance.profile_image_file:
                try:
                    instance.profile_image_file.delete(save=False)
                except Exception:
                    pass
        # Handle profile image upload
        else:
            profile_image = self.cleaned_data.get('upload_profile_image')
            if isinstance(profile_image, UploadedFile) and getattr(profile_image, 'size', 0) > 0:
                instance.profile_image_mime = _get_mime_type(profile_image, fallback='image/jpeg')
                instance.profile_image_file.save(getattr(profile_image, 'name', ''), profile_image, save=False)

        # Handle clear resume
        if self.cleaned_data.get('clear_resume'):
            instance.resume_url = ''
            instance.resume_filename = ''
            instance.resume_mime = ''
            if instance.resume_file:
                try:
                    instance.resume_file.delete(save=False)
                except Exception:
                    pass
        # If an external resume URL is provided, prefer it
        elif self.cleaned_data.get('resume_url'):
            instance.resume_url = self.cleaned_data.get('resume_url')
        # Handle resume upload - accept various file types
        else:
            resume = self.cleaned_data.get('upload_resume')
            if isinstance(resume, UploadedFile) and getattr(resume, 'size', 0) > 0:
                instance.resume_file.save(getattr(resume, 'name', ''), resume, save=False)
                instance.resume_filename = getattr(resume, 'name', '')
                # Determine MIME type
                content_type = getattr(resume, 'content_type', None) or _get_mime_type(resume)
                if not content_type:
                    # Fallback based on file extension
                    if resume.name.lower().endswith('.pdf'):
                        content_type = 'application/pdf'
                    elif resume.name.lower().endswith('.doc'):
                        content_type = 'application/msword'
                    elif resume.name.lower().endswith('.docx'):
                        content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    elif resume.name.lower().endswith('.txt'):
                        content_type = 'text/plain'
                    else:
                        content_type = 'application/octet-stream'
                instance.resume_mime = content_type

        if commit:
            instance.save()
        return instance


class EducationAdminForm(forms.ModelForm):
    """Custom form for Education model with logo upload or external URL"""
    logo_url = forms.URLField(required=False, label='Logo URL', help_text='External institution logo URL')
    upload_logo = forms.ImageField(required=False, label='Upload Institution Logo')
    clear_logo = forms.BooleanField(required=False, label='Clear Logo', help_text='Check to remove the logo')

    class Meta:
        model = Education
        exclude = ['logo_file']  # Exclude model FileField

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            if getattr(self.instance, 'logo_url', None):
                self.fields['logo_url'].help_text = f'✓ Current: External logo URL set ({self.instance.logo_url}). Upload file to replace or clear to remove.'
            elif self.instance.logo_file:
                size = getattr(self.instance.logo_file, 'size', 0)
                self.fields['upload_logo'].help_text = f'✓ Current: Logo file present ({size} bytes). Upload new file to replace.'

    def save(self, commit=True):
        instance = super().save(commit=False)

        # Handle clear checkbox
        if self.cleaned_data.get('clear_logo'):
            instance.logo_url = ''
            if instance.logo_file:
                try:
                    instance.logo_file.delete(save=False)
                except Exception:
                    pass
            instance.logo_mime = ''
        elif self.cleaned_data.get('logo_url'):
            instance.logo_url = self.cleaned_data.get('logo_url')
            if instance.logo_file:
                try:
                    instance.logo_file.delete(save=False)
                except Exception:
                    pass
        else:
            logo = self.cleaned_data.get('upload_logo')
            if isinstance(logo, UploadedFile) and getattr(logo, 'size', 0) > 0:
                instance.logo_file.save(getattr(logo, 'name', ''), logo, save=False)
                instance.logo_mime = _get_mime_type(logo, fallback='image/png')

        if commit:
            instance.save()
        return instance


class WorkExperienceAdminForm(forms.ModelForm):
    """Custom form for WorkExperience model with logo upload or external URL"""
    company_logo_url = forms.URLField(required=False, label='Company Logo URL', help_text='External company logo URL')
    upload_company_logo = forms.ImageField(required=False, label='Upload Company Logo')
    clear_company_logo = forms.BooleanField(required=False, label='Clear Logo', help_text='Check to remove the company logo')

    class Meta:
        model = WorkExperience
        exclude = ['company_logo_file']  # Exclude model FileField

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            if getattr(self.instance, 'company_logo_url', None):
                self.fields['company_logo_url'].help_text = f'✓ Current: External logo URL set ({self.instance.company_logo_url}). Upload file to replace or clear to remove.'
            elif self.instance.company_logo_file:
                size = getattr(self.instance.company_logo_file, 'size', 0)
                self.fields['upload_company_logo'].help_text = f'✓ Current: Company logo file present ({size} bytes). Upload new file to replace.'

    def save(self, commit=True):
        instance = super().save(commit=False)

        # Handle clear checkbox
        if self.cleaned_data.get('clear_company_logo'):
            instance.company_logo_url = ''
            if instance.company_logo_file:
                try:
                    instance.company_logo_file.delete(save=False)
                except Exception:
                    pass
            instance.company_logo_mime = ''
        elif self.cleaned_data.get('company_logo_url'):
            instance.company_logo_url = self.cleaned_data.get('company_logo_url')
            if instance.company_logo_file:
                try:
                    instance.company_logo_file.delete(save=False)
                except Exception:
                    pass
        else:
            logo = self.cleaned_data.get('upload_company_logo')
            if isinstance(logo, UploadedFile) and getattr(logo, 'size', 0) > 0:
                instance.company_logo_file.save(getattr(logo, 'name', ''), logo, save=False)
                instance.company_logo_mime = _get_mime_type(logo, fallback='image/png')

        if commit:
            instance.save()
        return instance


class ProjectAdminForm(forms.ModelForm):
    """Custom form for Project model with featured image upload or external URL"""
    featured_image_url = forms.URLField(required=False, label='Featured Image URL', help_text='External featured image URL (CDN)')
    upload_featured_image = forms.ImageField(required=False, label='Upload Featured Image')
    clear_featured_image = forms.BooleanField(required=False, label='Clear Image', help_text='Check to remove the featured image')

    class Meta:
        model = Project
        exclude = ['featured_image_file']  # Exclude model FileField

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            if getattr(self.instance, 'featured_image_url', None):
                self.fields['featured_image_url'].help_text = f'✓ Current: External featured image URL set ({self.instance.featured_image_url}). Upload file to replace or clear to remove.'
            elif self.instance.featured_image_file:
                size = getattr(self.instance.featured_image_file, 'size', 0)
                self.fields['upload_featured_image'].help_text = f'✓ Current: Featured image file present ({size} bytes). Upload new file to replace.'

    def save(self, commit=True):
        instance = super().save(commit=False)

        # Handle clear checkbox
        if self.cleaned_data.get('clear_featured_image'):
            instance.featured_image_url = ''
            if instance.featured_image_file:
                try:
                    instance.featured_image_file.delete(save=False)
                except Exception:
                    pass
            instance.featured_image_mime = ''
        elif self.cleaned_data.get('featured_image_url'):
            instance.featured_image_url = self.cleaned_data.get('featured_image_url')
            if instance.featured_image_file:
                try:
                    instance.featured_image_file.delete(save=False)
                except Exception:
                    pass
        else:
            image = self.cleaned_data.get('upload_featured_image')
            if isinstance(image, UploadedFile) and getattr(image, 'size', 0) > 0:
                instance.featured_image_file.save(getattr(image, 'name', ''), image, save=False)
                instance.featured_image_mime = _get_mime_type(image, fallback='image/jpeg')

        if commit:
            instance.save()
        return instance


class CertificateAdminForm(forms.ModelForm):
    """Custom form for Certificate model with image uploads or external URLs"""
    organization_logo_url = forms.URLField(required=False, label='Organization Logo URL', help_text='External organization logo URL')
    upload_organization_logo = forms.ImageField(required=False, label='Upload Organization Logo')
    clear_organization_logo = forms.BooleanField(required=False, label='Clear Org Logo', help_text='Check to remove the organization logo')
    certificate_image_url = forms.URLField(required=False, label='Certificate Image URL', help_text='External certificate image URL')
    upload_certificate_image = forms.ImageField(required=False, label='Upload Certificate Image')
    clear_certificate_image = forms.BooleanField(required=False, label='Clear Certificate Image', help_text='Check to remove the certificate image')

    class Meta:
        model = Certificate
        exclude = ['organization_logo_file', 'certificate_image_file']  # Exclude model FileFields

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            if getattr(self.instance, 'organization_logo_url', None):
                self.fields['organization_logo_url'].help_text = f'✓ Current: External org logo URL set ({self.instance.organization_logo_url}). Upload file to replace or clear to remove.'
            elif self.instance.organization_logo_file:
                size = getattr(self.instance.organization_logo_file, 'size', 0)
                self.fields['upload_organization_logo'].help_text = f'✓ Current: Org logo file present ({size} bytes). Upload new file to replace.'
            if getattr(self.instance, 'certificate_image_url', None):
                self.fields['certificate_image_url'].help_text = f'✓ Current: External certificate image URL set ({self.instance.certificate_image_url}).'
            elif self.instance.certificate_image_file:
                size = getattr(self.instance.certificate_image_file, 'size', 0)
                self.fields['upload_certificate_image'].help_text = f'✓ Current: Certificate image file present ({size} bytes). Upload new file to replace.'

    def save(self, commit=True):
        instance = super().save(commit=False)

        # Handle clear org logo
        if self.cleaned_data.get('clear_organization_logo'):
            instance.organization_logo_url = ''
            if instance.organization_logo_file:
                try:
                    instance.organization_logo_file.delete(save=False)
                except Exception:
                    pass
            instance.organization_logo_mime = ''
        elif self.cleaned_data.get('organization_logo_url'):
            instance.organization_logo_url = self.cleaned_data.get('organization_logo_url')
            if instance.organization_logo_file:
                try:
                    instance.organization_logo_file.delete(save=False)
                except Exception:
                    pass
        else:
            org_logo = self.cleaned_data.get('upload_organization_logo')
            if isinstance(org_logo, UploadedFile) and getattr(org_logo, 'size', 0) > 0:
                instance.organization_logo_file.save(getattr(org_logo, 'name', ''), org_logo, save=False)
                instance.organization_logo_mime = _get_mime_type(org_logo, fallback='image/png')

        # Handle clear certificate image
        if self.cleaned_data.get('clear_certificate_image'):
            instance.certificate_image_url = ''
            if instance.certificate_image_file:
                try:
                    instance.certificate_image_file.delete(save=False)
                except Exception:
                    pass
            instance.certificate_image_mime = ''
        elif self.cleaned_data.get('certificate_image_url'):
            instance.certificate_image_url = self.cleaned_data.get('certificate_image_url')
            if instance.certificate_image_file:
                try:
                    instance.certificate_image_file.delete(save=False)
                except Exception:
                    pass
        else:
            cert_image = self.cleaned_data.get('upload_certificate_image')
            if isinstance(cert_image, UploadedFile) and getattr(cert_image, 'size', 0) > 0:
                instance.certificate_image_file.save(getattr(cert_image, 'name', ''), cert_image, save=False)
                instance.certificate_image_mime = _get_mime_type(cert_image, fallback='image/jpeg')

        if commit:
            instance.save()
        return instance


class AchievementAdminForm(forms.ModelForm):
    """Custom form for Achievement model with image upload or external URL"""
    image_url = forms.URLField(required=False, label='Achievement Image URL', help_text='External achievement image URL')
    upload_achievement_image = forms.ImageField(required=False, label='Upload Achievement Image')
    clear_achievement_image = forms.BooleanField(required=False, label='Clear Image', help_text='Check to remove the achievement image')

    class Meta:
        model = Achievement
        exclude = ['image_file']  # Exclude model FileField

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            if getattr(self.instance, 'image_url', None):
                self.fields['image_url'].help_text = f'✓ Current: External achievement image URL set ({self.instance.image_url}). Upload file to replace or clear to remove.'
            elif self.instance.image_file:
                size = getattr(self.instance.image_file, 'size', 0)
                self.fields['upload_achievement_image'].help_text = f'✓ Current: Achievement image file present ({size} bytes). Upload new file to replace.'

    def save(self, commit=True):
        instance = super().save(commit=False)

        # Handle clear checkbox
        if self.cleaned_data.get('clear_achievement_image'):
            instance.image_url = ''
            if instance.image_file:
                try:
                    instance.image_file.delete(save=False)
                except Exception:
                    pass
            instance.image_mime = ''
        elif self.cleaned_data.get('image_url'):
            instance.image_url = self.cleaned_data.get('image_url')
            if instance.image_file:
                try:
                    instance.image_file.delete(save=False)
                except Exception:
                    pass
        else:
            image = self.cleaned_data.get('upload_achievement_image')
            if isinstance(image, UploadedFile) and getattr(image, 'size', 0) > 0:
                instance.image_file.save(getattr(image, 'name', ''), image, save=False)
                instance.image_mime = _get_mime_type(image, fallback='image/jpeg')

        if commit:
            instance.save()
        return instance


class BlogPostAdminForm(forms.ModelForm):
    """Custom form for BlogPost model with image uploads or external URLs"""
    featured_image_url = forms.URLField(required=False, label='Featured Image URL', help_text='External featured image URL (CDN)')
    upload_featured_image = forms.ImageField(required=False, label='Upload Featured Image')
    clear_featured_image = forms.BooleanField(required=False, label='Clear Featured Image', help_text='Check to remove the featured image')
    og_image_url = forms.URLField(required=False, label='OG Image URL', help_text='External OG image URL')
    upload_og_image = forms.ImageField(required=False, label='Upload OG Image')
    clear_og_image = forms.BooleanField(required=False, label='Clear OG Image', help_text='Check to remove the OG image')

    class Meta:
        model = BlogPost
        exclude = ['featured_image_file', 'og_image_file']  # Exclude model FileFields

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            if getattr(self.instance, 'featured_image_url', None):
                self.fields['featured_image_url'].help_text = f'✓ Current: External featured image URL set ({self.instance.featured_image_url}). Upload file to replace or clear to remove.'
            elif self.instance.featured_image_file:
                size = getattr(self.instance.featured_image_file, 'size', 0)
                self.fields['upload_featured_image'].help_text = f'✓ Current: Featured image file present ({size} bytes). Upload new file to replace.'
            if getattr(self.instance, 'og_image_url', None):
                self.fields['og_image_url'].help_text = f'✓ Current: External OG image URL set ({self.instance.og_image_url}).'
            elif self.instance.og_image_file:
                size = getattr(self.instance.og_image_file, 'size', 0)
                self.fields['upload_og_image'].help_text = f'✓ Current: OG image file present ({size} bytes). Upload new file to replace.'

    def save(self, commit=True):
        instance = super().save(commit=False)

        # Handle clear featured image
        if self.cleaned_data.get('clear_featured_image'):
            instance.featured_image_url = ''
            if instance.featured_image_file:
                try:
                    instance.featured_image_file.delete(save=False)
                except Exception:
                    pass
            instance.featured_image_mime = ''
        elif self.cleaned_data.get('featured_image_url'):
            instance.featured_image_url = self.cleaned_data.get('featured_image_url')
            if instance.featured_image_file:
                try:
                    instance.featured_image_file.delete(save=False)
                except Exception:
                    pass
        else:
            featured = self.cleaned_data.get('upload_featured_image')
            if isinstance(featured, UploadedFile) and getattr(featured, 'size', 0) > 0:
                instance.featured_image_file.save(getattr(featured, 'name', ''), featured, save=False)
                instance.featured_image_mime = _get_mime_type(featured, fallback='image/jpeg')

        # Handle clear OG image
        if self.cleaned_data.get('clear_og_image'):
            instance.og_image_url = ''
            if instance.og_image_file:
                try:
                    instance.og_image_file.delete(save=False)
                except Exception:
                    pass
            instance.og_image_mime = ''
        elif self.cleaned_data.get('og_image_url'):
            instance.og_image_url = self.cleaned_data.get('og_image_url')
            if instance.og_image_file:
                try:
                    instance.og_image_file.delete(save=False)
                except Exception:
                    pass
            og_image = self.cleaned_data.get('upload_og_image')
            if isinstance(og_image, UploadedFile) and getattr(og_image, 'size', 0) > 0:
                instance.og_image_file.save(getattr(og_image, 'name', ''), og_image, save=False)
                instance.og_image_mime = _get_mime_type(og_image, fallback='image/jpeg')

        if commit:
            instance.save()
        return instance


class TestimonialAdminForm(forms.ModelForm):
    """Custom form for Testimonial model with author image upload"""
    upload_author_image = forms.ImageField(required=False, label='Upload Author Image')
    clear_author_image = forms.BooleanField(required=False, label='Clear Image', help_text='Check to remove the author image')
    
    class Meta:
        model = Testimonial
        exclude = ['author_image_file']  # Exclude model FileField

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            if self.instance.author_image_url:
                self.fields['upload_author_image'].help_text = f'✓ Current: External author image URL set. Upload new file to replace or clear to remove.'
            elif self.instance.author_image_file:
                size = getattr(self.instance.author_image_file, 'size', 0)
                self.fields['upload_author_image'].help_text = f'✓ Current: Author image file present ({size} bytes). Upload new file to replace.'

    def save(self, commit=True):
        instance = super().save(commit=False)

        # Handle clear checkbox
        if self.cleaned_data.get('clear_author_image'):
            instance.author_image_url = ''
            if instance.author_image_file:
                try:
                    instance.author_image_file.delete(save=False)
                except Exception:
                    pass
            instance.author_image_mime = ''
        else:
            image = self.cleaned_data.get('upload_author_image')
            if isinstance(image, UploadedFile) and getattr(image, 'size', 0) > 0:
                instance.author_image_file.save(getattr(image, 'name', ''), image, save=False)
                instance.author_image_mime = _get_mime_type(image, fallback='image/jpeg')

        if commit:
            instance.save()
        return instance


# ============================================
# HELPER FUNCTIONS
# ============================================

def get_image_preview(image_source, mime_type=None, width=50, height=50):
    """Generate HTML image preview from external URL or FileField.
    image_source can be an absolute URL string or a Django FileField (has .url)."""
    if not image_source:
        return format_html('<span style="color:#999;">No image</span>')

    url = None
    # If a string is provided, treat it as a URL
    if isinstance(image_source, str):
        url = image_source
    else:
        # Try to get .url from FileField
        url = getattr(image_source, 'url', None)

    if url:
        return format_html(
            '<img src="{}" style="width:{}px; height:{}px; object-fit:cover; border-radius:4px;" />',
            url, width, height
        )
    return format_html('<span style="color:#999;">No image</span>')


# Helper to safely determine content type from uploaded or stored file-like objects
import mimetypes

def _get_mime_type(file_obj, fallback='application/octet-stream'):
    """Return a MIME type for a file-like object.

    This handles UploadedFile instances (which expose .content_type),
    ImageFieldFile/File objects (which have .name), and falls back to
    a guessed type from the filename.
    """
    if not file_obj:
        return fallback

    # Prefer explicit attribute (UploadedFile)
    ct = getattr(file_obj, 'content_type', None)
    if ct:
        return ct

    # Try nested file (some storages expose a .file with metadata)
    nested = getattr(file_obj, 'file', None)
    nested_ct = getattr(nested, 'content_type', None) if nested is not None else None
    if nested_ct:
        return nested_ct

    # Guess from filename
    name = getattr(file_obj, 'name', None)
    if name:
        guessed, _ = mimetypes.guess_type(name)
        if guessed:
            return guessed

    return fallback


# ============================================
# GENERIC IMAGE INLINE
# ============================================

class ImageInline(GenericTabularInline):
    model = Image
    form = ImageAdminForm
    extra = 1
    fields = ['image_preview', 'upload_image', 'image_type', 'alt_text', 'caption', 'order', 'show_on_home']
    readonly_fields = ['image_preview']
    ordering = ['order']

    def image_preview(self, obj):
        if obj.pk:
            return get_image_preview(obj.image_url or obj.image_file, obj.mime_type, 60, 60)
        return format_html("<span style=\"color:#999;\">Upload to preview</span>")
    image_preview.short_description = 'Preview'


# ============================================
# IMAGE ADMIN
# ============================================

@admin.register(Image, site=portfolio_admin_site)
class ImageAdmin(admin.ModelAdmin):
    form = ImageAdminForm
    list_display = ['image_preview', 'filename', 'image_type', 'content_type', 'file_size_display', 'show_on_home', 'created_at']
    list_display_links = ['filename']
    list_filter = ['image_type', 'content_type', 'show_on_home', 'created_at']
    search_fields = ['filename', 'alt_text', 'caption']
    readonly_fields = ['image_preview_large', 'file_size', 'width', 'height', 'created_at', 'updated_at']
    ordering = ['-created_at']
    list_editable = ['show_on_home']

    fieldsets = (
        ('Image Preview', {
            'fields': ('image_preview_large',)
        }),
        ('Upload Image', {
            'fields': ('external_image_url', 'upload_image', 'clear_image')
        }),
        ('Image Data', {
            'fields': ('filename', 'mime_type'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('file_size', 'width', 'height')
        }),
        ('Classification', {
            'fields': ('image_type', 'alt_text', 'caption', 'order', 'show_on_home')
        }),
        ('Linked Object', {
            'fields': ('content_type', 'object_id')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def image_preview(self, obj):
        return get_image_preview(obj.image_url or obj.image_file, obj.mime_type, 50, 50)
    image_preview.short_description = 'Preview'

    def image_preview_large(self, obj):
        return get_image_preview(obj.image_url or obj.image_file, obj.mime_type, 200, 200)
    image_preview_large.short_description = 'Preview'

    def file_size_display(self, obj):
        if obj.file_size:
            if obj.file_size < 1024:
                return f"{obj.file_size} B"
            elif obj.file_size < 1024 * 1024:
                return f"{obj.file_size / 1024:.1f} KB"
            else:
                return f"{obj.file_size / (1024 * 1024):.1f} MB"
        return "-"
    file_size_display.short_description = 'Size'


# ============================================
# PROFILE SECTION
# ============================================

class SocialLinkAdminForm(forms.ModelForm):
    """Custom form for SocialLink with auto icon assignment"""
    class Meta:
        model = SocialLink
        exclude = ['icon']  # Hide icon field since it's auto-assigned
    
    def save(self, commit=True):
        instance = super().save(commit=False)
        # Auto-fill icon based on platform when saving
        if instance.platform and instance.platform in SocialLink.ICON_MAPPING:
            instance.icon = SocialLink.ICON_MAPPING[instance.platform]
        if commit:
            instance.save()
        return instance


class SocialLinkInline(admin.TabularInline):
    model = SocialLink
    form = SocialLinkAdminForm
    extra = 1
    ordering = ['order']
    fields = ['platform', 'url', 'order', 'show_on_home']
    list_editable = ['show_on_home']


class SkillAdminForm(forms.ModelForm):
    """Custom form for Skill with selection dropdown and manual entry"""
    # Add an explicit blank choice so the form doesn't auto-select the first skill
    skill_select = forms.ChoiceField(
        choices=[('', '--- Select a skill ---')] + list(Skill.SKILL_CHOICES),
        required=False,
        initial='',
        label="Select Skill",
        help_text="Choose a pre-defined skill to auto-fill the icon automatically, or select 'Other' to enter manually."
    )
    manual_name = forms.CharField(
        required=False,
        label="Manual Name",
        help_text="Enter skill name manually if 'Other' is selected above."
    )

    class Meta:
        model = Skill
        exclude = ['name', 'icon']  # hide the real name and icon fields; we manage name via select/manual and icon is auto-set

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Initialize select/manual fields based on existing instance
        if self.instance and self.instance.pk:
            if self.instance.name in dict(Skill.SKILL_CHOICES):
                self.fields['skill_select'].initial = self.instance.name
            else:
                self.fields['skill_select'].initial = 'other'
                self.fields['manual_name'].initial = self.instance.name
        else:
            # Ensure no selection is pre-chosen for new instances
            self.fields['skill_select'].initial = ''

    def clean(self):
        cleaned_data = super().clean()
        skill_select = cleaned_data.get('skill_select')
        manual_name = cleaned_data.get('manual_name')

        # Determine final name field for saving
        # Require either a selected skill or a manual name
        if not skill_select or skill_select == '':
            if not manual_name:
                raise forms.ValidationError({'skill_select': 'Please select a skill or enter a manual name.'})
            cleaned_data['name'] = manual_name.strip()
        elif skill_select == 'other':
            if not manual_name:
                raise forms.ValidationError({'manual_name': 'Please enter a skill name manually.'})
            cleaned_data['name'] = manual_name.strip()
        else:
            cleaned_data['name'] = skill_select
        return cleaned_data

    def save(self, commit=True):
        # Save form (without name/icon fields) then set name and auto-fill icon
        instance = super().save(commit=False)
        instance.name = self.cleaned_data.get('name')

        # Auto-fill icon based on skill name if mapping exists
        mapped_icon = Skill.ICON_MAPPING.get(instance.name)
        if mapped_icon:
            instance.icon = mapped_icon
        # Otherwise keep existing icon (if editing) or leave blank

        if commit:
            instance.save()
        return instance


class SkillInline(admin.TabularInline):
    model = Skill
    form = SkillAdminForm
    extra = 1
    ordering = ['order', 'name']
    fields = ['skill_select', 'manual_name', 'skill_type', 'proficiency', 'order', 'show_on_home']


@admin.register(Profile, site=portfolio_admin_site)
class ProfileAdmin(admin.ModelAdmin):
    form = ProfileAdminForm
    list_display = ['profile_preview', 'full_name', 'headline', 'email', 'available_for_hire', 'updated_at']
    list_display_links = ['full_name']
    list_filter = ['available_for_hire', 'created_at']
    search_fields = ['full_name', 'headline', 'email', 'bio']
    readonly_fields = ['profile_preview_large', 'resume_info', 'created_at', 'updated_at']
    inlines = [SocialLinkInline, SkillInline, ImageInline]

    fieldsets = (
        ('Profile Image', {
            'fields': ('profile_preview_large', 'profile_image_url', 'upload_profile_image', 'clear_profile_image')
        }),
        ('Basic Information', {
            'fields': ('full_name', 'headline', 'bio')
        }),
        ('Contact', {
            'fields': ('email', 'phone', 'location')
        }),
        ('Professional Details', {
            'fields': ('current_role', 'current_company', 'years_of_experience', 'available_for_hire')
        }),
        ('Resume', {
            'fields': ('resume_info', 'resume_url', 'upload_resume', 'clear_resume', 'resume_filename'),
            'description': 'Upload PDF, DOC, DOCX, or TXT files or set an external resume URL. The resume filename will be auto-filled from uploaded file.'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        """Allow adding only if no Profile exists (singleton enforcement in admin)."""
        return not Profile.objects.exists()

    def has_delete_permission(self, request, obj=None):
        """Prevent deleting the singleton Profile via admin."""
        return False

    def profile_preview(self, obj):
        return get_image_preview(obj.profile_image_url or obj.profile_image_file, obj.profile_image_mime, 40, 40)
    profile_preview.short_description = 'Photo'

    def profile_preview_large(self, obj):
        return get_image_preview(obj.profile_image_url or obj.profile_image_file, obj.profile_image_mime, 150, 150)
    profile_preview_large.short_description = 'Profile Image'

    def resume_info(self, obj):
        """Display current resume information"""
        if obj.resume_file or obj.resume_url:
            if obj.resume_file:
                size_kb = (getattr(obj.resume_file, 'size', 0) or 0) / 1024
                download_url = f'/api/profiles/{obj.pk}/resume/' if obj.pk else '#'
                filename = obj.resume_filename or getattr(obj.resume_file, 'name', 'resume')
                mime = obj.resume_mime or 'Unknown'
            else:
                size_kb = None
                download_url = obj.resume_url
                filename = obj.resume_filename or (obj.resume_url.split('/')[-1] if obj.resume_url else '')
                mime = obj.resume_mime or 'External'

            size_str = f"{size_kb:.2f} KB" if size_kb is not None else 'External'
            return format_html(
                '<div style="padding: 10px; background: #e8f5e9; border-radius: 4px;">'
                '<strong>✓ Resume Available</strong><br>'
                'Filename: {}<br>'
                'Size: {}<br>'
                'Type: {}<br>'
                '<a href="{}" target="_blank" style="color: #1976d2;">Download Current Resume</a>'
                '</div>',
                filename,
                size_str,
                mime,
                download_url
            )
        return format_html(
            '<div style="padding: 10px; background: #fff3e0; border-radius: 4px;">'
            '<strong>⚠ No Resume Uploaded</strong><br>'
            'Use the "Upload Resume" field below to add a resume file or set an external resume URL.'
            '</div>'
        )
    resume_info.short_description = 'Current Resume Status' 


@admin.register(SocialLink, site=portfolio_admin_site)
class SocialLinkAdmin(admin.ModelAdmin):
    form = SocialLinkAdminForm
    exclude = ('profile',)
    list_display = ['platform', 'url', 'order', 'show_on_home']
    list_filter = ['platform', 'show_on_home']
    search_fields = ['url']
    ordering = ['order']
    list_editable = ['show_on_home']


@admin.register(Skill, site=portfolio_admin_site)
class SkillAdmin(admin.ModelAdmin):
    form = SkillAdminForm
    exclude = ('profile',)
    list_display = ['name', 'skill_type', 'proficiency', 'order', 'show_on_home']
    list_filter = ['skill_type', 'proficiency', 'show_on_home']
    search_fields = ['name']
    ordering = ['order', 'name']


# ============================================
# EDUCATION SECTION
# ============================================

@admin.register(Education, site=portfolio_admin_site)
class EducationAdmin(admin.ModelAdmin):
    form = EducationAdminForm
    exclude = ('profile',)
    list_display = ['logo_preview', 'degree', 'institution', 'field_of_study', 'start_date', 'end_date', 'is_current', 'show_on_home']
    list_display_links = ['degree']
    list_filter = ['is_current', 'show_on_home', 'start_date']
    search_fields = ['institution', 'degree', 'field_of_study']
    readonly_fields = ['logo_preview_large']
    inlines = [ImageInline]
    ordering = ['-start_date']
    list_editable = ['show_on_home']

    fieldsets = (
        ('Institution Logo', {
            'fields': ('logo_preview_large', 'logo_url', 'upload_logo', 'clear_logo')
        }),
        ('Education Details', {
            'fields': ('institution', 'degree', 'field_of_study', 'grade')
        }),
        ('Duration', {
            'fields': ('start_date', 'end_date', 'is_current')
        }),
        ('Additional Info', {
            'fields': ('location', 'description', 'show_on_home'),
            'classes': ('collapse',)
        }),
    )

    def logo_preview(self, obj):
        return get_image_preview(obj.logo_url or obj.logo_file, obj.logo_mime, 40, 40)
    logo_preview.short_description = 'Logo'

    def logo_preview_large(self, obj):
        return get_image_preview(obj.logo_url or obj.logo_file, obj.logo_mime, 100, 100)
    logo_preview_large.short_description = 'Institution Logo' 


# ============================================
# WORK EXPERIENCE SECTION
# ============================================

@admin.register(WorkExperience, site=portfolio_admin_site)
class WorkExperienceAdmin(admin.ModelAdmin):
    form = WorkExperienceAdminForm
    exclude = ('profile',)
    list_display = ['company_logo_preview', 'job_title', 'company_name', 'employment_type', 'work_mode', 'start_date', 'is_current', 'show_on_home']
    list_display_links = ['job_title']
    list_filter = ['is_current', 'employment_type', 'work_mode', 'show_on_home', 'start_date']
    search_fields = ['company_name', 'job_title', 'description', 'technologies_used']
    readonly_fields = ['company_logo_preview_large']
    inlines = [ImageInline]
    ordering = ['-is_current', '-start_date']
    list_editable = ['show_on_home']

    fieldsets = (
        ('Company Logo', {
            'fields': ('company_logo_preview_large', 'company_logo_url', 'upload_company_logo', 'clear_company_logo')
        }),
        ('Company Information', {
            'fields': ('company_name', 'company_url', 'location')
        }),
        ('Position Details', {
            'fields': ('job_title', 'employment_type', 'work_mode')
        }),
        ('Duration', {
            'fields': ('start_date', 'end_date', 'is_current')
        }),
        ('Description', {
            'fields': ('description', 'achievements', 'technologies_used')
        }),
        ('Display', {
            'fields': ('order', 'show_on_home'),
        }),
    )

    def company_logo_preview(self, obj):
        return get_image_preview(obj.company_logo_url or obj.company_logo_file, obj.company_logo_mime, 40, 40)
    company_logo_preview.short_description = 'Logo'

    def company_logo_preview_large(self, obj):
        return get_image_preview(obj.company_logo_url or obj.company_logo_file, obj.company_logo_mime, 100, 100)
    company_logo_preview_large.short_description = 'Company Logo' 


# ============================================
# PROJECTS SECTION
# ============================================

@admin.register(Project, site=portfolio_admin_site)
class ProjectAdmin(admin.ModelAdmin):
    form = ProjectAdminForm
    exclude = ('profile',)
    list_display = ['featured_preview', 'title', 'status', 'is_featured', 'is_visible', 'show_on_home', 'order', 'created_at']
    list_display_links = ['title']
    list_filter = ['status', 'is_featured', 'is_visible', 'show_on_home', 'created_at']
    search_fields = ['title', 'short_description', 'description', 'technologies']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['featured_preview_large', 'created_at', 'updated_at']
    inlines = [ImageInline]
    ordering = ['-is_featured', 'order', '-created_at']
    list_editable = ['is_featured', 'is_visible', 'show_on_home', 'order']

    fieldsets = (
        ('Featured Image', {
            'fields': ('featured_preview_large', 'upload_featured_image', 'clear_featured_image', 'featured_image_alt')
        }),
        ('Basic Information', {
            'fields': ('title', 'slug', 'short_description', 'description')
        }),
        ('Links', {
            'fields': ('live_url', 'github_url', 'demo_url')
        }),
        ('Technical Details', {
            'fields': ('technologies', 'role', 'team_size')
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date', 'status')
        }),
        ('Display Options', {
            'fields': ('is_featured', 'is_visible', 'show_on_home', 'order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def featured_preview(self, obj):
        return get_image_preview(obj.featured_image_url or obj.featured_image_file, obj.featured_image_mime, 60, 40)
    featured_preview.short_description = 'Image'

    def featured_preview_large(self, obj):
        return get_image_preview(obj.featured_image_url or obj.featured_image_file, obj.featured_image_mime, 300, 200)
    featured_preview_large.short_description = 'Featured Image'


# ============================================
# CERTIFICATES & ACHIEVEMENTS
# ============================================

@admin.register(Certificate, site=portfolio_admin_site)
class CertificateAdmin(admin.ModelAdmin):
    form = CertificateAdminForm
    exclude = ('profile',)
    list_display = ['org_logo_preview', 'title', 'issuing_organization', 'issue_date', 'does_not_expire', 'show_on_home', 'order']
    list_display_links = ['title']
    list_filter = ['does_not_expire', 'show_on_home', 'issue_date']
    search_fields = ['title', 'issuing_organization', 'credential_id', 'skills']
    readonly_fields = ['org_logo_preview_large', 'cert_preview_large']
    inlines = [ImageInline]
    ordering = ['order', '-issue_date']
    list_editable = ['show_on_home']

    fieldsets = (
        ('Images Preview', {
            'fields': (
                ('org_logo_preview_large', 'cert_preview_large'),
            )
        }),
        ('Upload Images', {
            'fields': ('organization_logo_url', 'upload_organization_logo', 'clear_organization_logo', 'certificate_image_url', 'upload_certificate_image', 'clear_certificate_image')
        }),
        ('Certificate Details', {
            'fields': ('title', 'issuing_organization', 'description')
        }),
        ('Validity', {
            'fields': ('issue_date', 'expiry_date', 'does_not_expire')
        }),
        ('Credential', {
            'fields': ('credential_id', 'credential_url')
        }),
        ('Additional', {
            'fields': ('skills', 'order', 'show_on_home'),
        }),
    )

    def org_logo_preview(self, obj):
        return get_image_preview(obj.organization_logo_url or obj.organization_logo_file, obj.organization_logo_mime, 40, 40)
    org_logo_preview.short_description = 'Logo'

    def org_logo_preview_large(self, obj):
        return get_image_preview(obj.organization_logo_url or obj.organization_logo_file, obj.organization_logo_mime, 100, 100)
    org_logo_preview_large.short_description = 'Organization Logo'

    def cert_preview_large(self, obj):
        return get_image_preview(obj.certificate_image_url or obj.certificate_image_file, obj.certificate_image_mime, 200, 150)
    cert_preview_large.short_description = 'Certificate Image' 


@admin.register(Achievement, site=portfolio_admin_site)
class AchievementAdmin(admin.ModelAdmin):
    form = AchievementAdminForm
    exclude = ('profile',)
    list_display = ['image_preview', 'title', 'achievement_type', 'issuer', 'date', 'order', 'show_on_home']
    list_display_links = ['title']
    list_filter = ['achievement_type', 'show_on_home', 'date']
    search_fields = ['title', 'issuer', 'description']
    readonly_fields = ['image_preview_large']
    inlines = [ImageInline]
    ordering = ['order', '-date']
    list_editable = ['show_on_home']

    fieldsets = (
        ('Achievement Image', {
            'fields': ('image_preview_large', 'image_url', 'upload_achievement_image', 'clear_achievement_image')
        }),
        ('Details', {
            'fields': ('title', 'achievement_type', 'issuer', 'date')
        }),
        ('Additional Info', {
            'fields': ('description', 'url', 'order', 'show_on_home')
        }),
    )

    def image_preview(self, obj):
        return get_image_preview(obj.image_url or obj.image_file, obj.image_mime, 40, 40)
    image_preview.short_description = 'Image'

    def image_preview_large(self, obj):
        return get_image_preview(obj.image_url or obj.image_file, obj.image_mime, 150, 150)
    image_preview_large.short_description = 'Achievement Image' 


# ============================================
# BLOG SECTION
# ============================================

@admin.register(BlogCategory, site=portfolio_admin_site)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'post_count', 'order', 'show_on_home']
    list_editable = ['order', 'show_on_home']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']

    def post_count(self, obj):
        return obj.posts.count()
    post_count.short_description = 'Posts'


@admin.register(BlogTag, site=portfolio_admin_site)
class BlogTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'post_count', 'show_on_home']
    list_editable = ['show_on_home']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']

    def post_count(self, obj):
        return obj.posts.count()
    post_count.short_description = 'Posts'


@admin.register(BlogPost, site=portfolio_admin_site)
class BlogPostAdmin(admin.ModelAdmin):
    form = BlogPostAdminForm
    exclude = ('profile',)
    list_display = ['featured_preview', 'title', 'category', 'status', 'is_featured', 'show_on_home', 'views_count', 'published_at']
    list_display_links = ['title']
    list_filter = ['status', 'is_featured', 'show_on_home', 'category', 'published_at', 'allow_comments']
    search_fields = ['title', 'excerpt', 'content', 'meta_keywords']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['featured_preview_large', 'og_preview', 'views_count', 'created_at', 'updated_at']
    filter_horizontal = ['tags']
    inlines = [ImageInline]
    ordering = ['-published_at', '-created_at']
    date_hierarchy = 'published_at'
    list_editable = ['status', 'is_featured', 'show_on_home']

    fieldsets = (
        ('Featured Image', {
            'fields': ('featured_preview_large', 'upload_featured_image', 'clear_featured_image', 'featured_image_alt')
        }),
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'content')
        }),
        ('Categorization', {
            'fields': ('category', 'tags')
        }),
        ('Publishing', {
            'fields': ('status', 'published_at', 'is_featured', 'show_on_home', 'allow_comments')
        }),
        ('Engagement', {
            'fields': ('reading_time', 'views_count'),
            'classes': ('collapse',)
        }),
        ('SEO - Meta Tags', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords', 'canonical_url'),
            'classes': ('collapse',)
        }),
        ('SEO - Open Graph', {
            'fields': ('og_preview', 'og_title', 'og_description', 'og_image_url', 'upload_og_image', 'clear_og_image'),
            'classes': ('collapse',)
        }),
        ('Schema.org', {
            'fields': ('schema_type',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def featured_preview(self, obj):
        return get_image_preview(obj.featured_image_url or obj.featured_image_file, obj.featured_image_mime, 60, 40)
    featured_preview.short_description = 'Image'

    def featured_preview_large(self, obj):
        return get_image_preview(obj.featured_image_url or obj.featured_image_file, obj.featured_image_mime, 300, 200)
    featured_preview_large.short_description = 'Featured Image'

    def og_preview(self, obj):
        return get_image_preview(obj.og_image_url or obj.og_image_file, obj.og_image_mime, 300, 157)
    og_preview.short_description = 'OG Image Preview' 

    actions = ['make_published', 'make_draft']

    @admin.action(description='Publish selected posts')
    def make_published(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='published', published_at=timezone.now())

    @admin.action(description='Set selected posts to draft')
    def make_draft(self, request, queryset):
        queryset.update(status='draft')


# ============================================
# TESTIMONIALS SECTION
# ============================================

@admin.register(Testimonial, site=portfolio_admin_site)
class TestimonialAdmin(admin.ModelAdmin):
    form = TestimonialAdminForm
    exclude = ('profile',)
    list_display = ['author_preview', 'author_name', 'author_title', 'author_company', 'rating_display', 'is_featured', 'is_visible', 'show_on_home', 'order']
    list_display_links = ['author_name']
    list_filter = ['is_featured', 'is_visible', 'show_on_home', 'rating', 'date']
    search_fields = ['author_name', 'author_company', 'content']
    readonly_fields = ['author_preview_large']
    inlines = [ImageInline]
    ordering = ['-is_featured', 'order', '-date']
    list_editable = ['is_featured', 'is_visible', 'show_on_home', 'order']

    fieldsets = (
        ('Author Image', {
            'fields': ('author_preview_large', 'author_image_url', 'upload_author_image', 'clear_author_image')
        }),
        ('Author Info', {
            'fields': ('author_name', 'author_title', 'author_company', 'linkedin_url')
        }),
        ('Testimonial', {
            'fields': ('content', 'rating', 'relationship', 'date')
        }),
        ('Display', {
            'fields': ('is_featured', 'is_visible', 'show_on_home', 'order')
        }),
    )

    def author_preview(self, obj):
        return get_image_preview(obj.author_image_url or obj.author_image_file, obj.author_image_mime, 40, 40)
    author_preview.short_description = 'Photo'

    def author_preview_large(self, obj):
        return get_image_preview(obj.author_image_url or obj.author_image_file, obj.author_image_mime, 100, 100)
    author_preview_large.short_description = 'Author Image'

    def rating_display(self, obj):
        stars = '★' * obj.rating + '☆' * (5 - obj.rating)
        return format_html('<span style="color:#f5a623;">{}</span>', stars)
    rating_display.short_description = 'Rating'


# ============================================
# CONTACT MESSAGES SECTION
# ============================================

@admin.register(ContactMessage, site=portfolio_admin_site)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['status_badge', 'name', 'email', 'subject', 'created_at', 'replied_at']
    list_display_links = ['name']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    list_editable = []

    fieldsets = (
        ('Contact Info', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('status', 'replied_at')
        }),
        ('Timestamps', {
            'fields': ('created_at',), 
            'classes': ('collapse',)
        }),
    )

    def status_badge(self, obj):
        colors = {
            'new': '#e74c3c',
            'read': '#3498db',
            'replied': '#27ae60',
            'archived': '#95a5a6'
        }
        color = colors.get(obj.status, '#95a5a6')
        return format_html(
            '<span style="background:{}; color:white; padding:3px 8px; border-radius:3px; font-size:11px;">{}</span>',
            color, obj.status.upper()
        )
    status_badge.short_description = 'Status'

    actions = ['mark_as_read', 'mark_as_replied', 'archive']

    @admin.action(description='Mark as read')
    def mark_as_read(self, request, queryset):
        queryset.update(status='read')

    @admin.action(description='Mark as replied')
    def mark_as_replied(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='replied', replied_at=timezone.now())

    @admin.action(description='Archive selected messages')
    def archive(self, request, queryset):
        queryset.update(status='archived')


# ============================================
# SITE CONFIGURATION ADMIN
# ============================================

@admin.register(SiteConfiguration, site=portfolio_admin_site)
class SiteConfigurationAdmin(admin.ModelAdmin):
    """Admin interface for SiteConfiguration"""
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('site_name', 'site_description', 'base_url')
        }),
        ('Theme & Style', {
            'fields': (
                'theme', 'neutral_color', 'brand_color', 'accent_color',
                'solid_style', 'border_style', 'surface_style',
                'transition_style', 'scaling', 'viz_style'
            ),
            'classes': ('collapse',)
        }),
        ('Display Options', {
            'fields': ('display_location', 'display_time', 'display_theme_switcher')
        }),
        ('Mailchimp Configuration', {
            'fields': ('mailchimp_action',),
            'classes': ('collapse',)
        }),
        ('SEO & Schema', {
            'fields': ('schema_type', 'schema_email'),
            'classes': ('collapse',)
        }),
        ('Social Links', {
            'fields': ('threads_url', 'linkedin_url', 'discord_url'),
            'classes': ('collapse',)
        }),
        ('Social Sharing Platforms', {
            'fields': (
                'enable_social_sharing',
                'share_on_x', 'share_on_linkedin', 'share_on_facebook',
                'share_on_pinterest', 'share_on_whatsapp', 'share_on_reddit',
                'share_on_telegram', 'share_email', 'share_copy_link'
            ),
            'classes': ('collapse',)
        }),
        ('Routes Configuration', {
            'fields': (
                'enable_route_home', 'enable_route_about', 'enable_route_work',
                'enable_route_blog', 'enable_route_gallery'
            ),
            'classes': ('collapse',)
        }),
        ('Protected Routes', {
            'fields': ('protected_routes',),
            'classes': ('collapse',),
            'description': 'Enter a JSON array of protected routes'
        }),
    )
    
    readonly_fields = ('updated_at',)
    
    def has_add_permission(self, request):
        """Only allow one configuration instance"""
        return SiteConfiguration.objects.count() == 0
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of the configuration"""
        return False
