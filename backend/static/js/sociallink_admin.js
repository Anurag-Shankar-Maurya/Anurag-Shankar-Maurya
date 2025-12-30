// Icon mapping for social platforms
const iconMapping = {
    'linkedin': 'linkedin',
    'github': 'github',
    'twitter': 'twitter',
    'instagram': 'instagram',
    'facebook': 'facebook',
    'youtube': 'youtube',
    'dribbble': 'dribbble',
    'behance': 'behance',
    'medium': 'medium',
    'dev': 'dev',
    'stackoverflow': 'stackoverflow',
    'website': 'website',
    'discord': 'discord',
    'threads': 'threads',
    'pinterest': 'pinterest',
    'reddit': 'reddit',
    'telegram': 'telegram',
    'whatsapp': 'whatsapp',
    'email': 'email',
    'other': 'other',
};

(function() {
    'use strict';

    // Handle platform change in both inline and regular admin forms
    function setupPlatformChangeHandler() {
        // For inline forms
        const inlineFormset = document.querySelectorAll('[id*="sociallink_set"]');
        if (inlineFormset.length > 0) {
            // Use event delegation for inline forms
            document.addEventListener('change', function(e) {
                if (e.target && e.target.name && e.target.name.includes('platform')) {
                    const platform = e.target.value;
                    const row = e.target.closest('tr');
                    if (row) {
                        const iconField = row.querySelector('[name*="icon"]');
                        if (iconField && platform && iconMapping[platform]) {
                            iconField.value = iconMapping[platform];
                        }
                    }
                }
            });
        }

        // For regular form (edit/add page)
        const platformSelect = document.querySelector('[name="platform"]');
        if (platformSelect) {
            platformSelect.addEventListener('change', function() {
                const platform = this.value;
                const iconField = document.querySelector('[name="icon"]');
                if (iconField && platform && iconMapping[platform]) {
                    iconField.value = iconMapping[platform];
                    // Visual feedback
                    iconField.style.backgroundColor = '#e8f5e9';
                    setTimeout(() => {
                        iconField.style.backgroundColor = '';
                    }, 1500);
                }
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupPlatformChangeHandler);
    } else {
        setupPlatformChangeHandler();
    }

    // Handle dynamically added inline forms
    if (window.django && window.django.jQuery) {
        window.django.jQuery(document).on('formset:added', function(e, $row, formsetName) {
            if (formsetName.includes('sociallink')) {
                const platformSelect = $row.find('select[name*="platform"]')[0];
                if (platformSelect) {
                    platformSelect.addEventListener('change', function() {
                        const platform = this.value;
                        const iconField = $row.find('input[name*="icon"]')[0];
                        if (iconField && platform && iconMapping[platform]) {
                            iconField.value = iconMapping[platform];
                        }
                    });
                }
            }
        });
    }
})();
