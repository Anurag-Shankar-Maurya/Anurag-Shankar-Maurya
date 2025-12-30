from django.core.management.base import BaseCommand
from api.models import SiteConfiguration


class Command(BaseCommand):
    help = 'Initialize the SiteConfiguration with default values'

    def handle(self, *args, **options):
        # Get or create the singleton configuration
        config, created = SiteConfiguration.objects.get_or_create(pk=1)
        
        if created:
            # Set defaults matching the frontend config
            config.site_name = 'Magic Portfolio'
            config.site_description = 'A portfolio website'
            config.base_url = 'https://demo.magic-portfolio.com'
            
            # Theme
            config.theme = 'system'
            config.neutral_color = 'gray'
            config.brand_color = 'cyan'
            config.accent_color = 'red'
            config.solid_style = 'flat'
            config.border_style = 'playful'
            config.surface_style = 'translucent'
            config.transition_style = 'all'
            config.scaling = 100
            
            # Display
            config.display_location = True
            config.display_time = True
            config.display_theme_switcher = True
            
            # Social
            config.threads_url = 'https://www.threads.com/@once_ui'
            config.linkedin_url = 'https://www.linkedin.com/company/once-ui/'
            config.discord_url = 'https://discord.com/invite/5EyAQ4eNdS'
            
            # Social sharing
            config.enable_social_sharing = True
            config.share_on_x = True
            config.share_on_linkedin = True
            config.share_email = True
            config.share_copy_link = True
            
            # Routes
            config.enable_route_home = True
            config.enable_route_about = True
            config.enable_route_work = True
            config.enable_route_blog = True
            config.enable_route_gallery = True
            
            # Protected routes
            config.protected_routes = '["/work/automate-design-handovers-with-a-figma-to-code-pipeline"]'
            
            config.save()
            self.stdout.write(
                self.style.SUCCESS(
                    'Successfully initialized SiteConfiguration with default values'
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    'SiteConfiguration already exists. No changes made.'
                )
            )
