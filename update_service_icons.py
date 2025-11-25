"""
Script to update service page icons with relevant, service-specific SVG icons
"""

# Icon definitions for each service
ICON_UPDATES = {
    'service-websites.html': [
        # AI Personalization - Brain/AI icon
        {
            'old_start': '<path d="M24 10L14 28H34L24 10Z" fill="white" />',
            'new': '''<!-- Brain/AI personalization icon -->
                            <circle cx="24" cy="20" r="10" fill="none" stroke="white" stroke-width="2" />
                            <path d="M18 18C18 18 20 16 24 16C28 16 30 18 30 18" stroke="white" stroke-width="2" fill="none" />
                            <circle cx="20" cy="20" r="1.5" fill="white" />
                            <circle cx="28" cy="20" r="1.5" fill="white" />
                            <path d="M20 24L24 26L28 24" stroke="white" stroke-width="2" stroke-linecap="round" />'''
        },
        # Premium Design - Palette icon  
        {
            'old_start': '<path\n                                d="M24 8L18 14L12 12L10 18L4 20L6 26L4 32L10 34L12 40L18 38L24 44L30 38L36 40L38 34L44 32L42 26L44 20L38 18L36 12L30 14L24 8Z"',
            'new': '''<!-- Design/palette icon -->
                            <circle cx="18" cy="24" r="12" fill="none" stroke="white" stroke-width="2" />
                            <circle cx="18" cy="20" r="2" fill="white" />
                            <circle cx="22" cy="26" r="2" fill="white" />
                            <circle cx="14" cy="26" r="2" fill="white" />
                            <circle cx="32" cy="18" r="3" fill="white" />'''
        },
        # SEO - Search/magnifying glass icon
        {
            'old_start': '<circle cx="16" cy="18" r="6" fill="white" />',
            'old_end': 'stroke="white" stroke-width="3" fill="none" />',
            'new': '''<!-- SEO/search icon -->
                            <circle cx="20" cy="20" r="8" fill="none" stroke="white" stroke-width="2.5" />
                            <path d="M26 26L32 32" stroke="white" stroke-width="2.5" stroke-linecap="round" />
                            <path d="M20 16V24M16 20H24" stroke="white" stroke-width="2" stroke-linecap="round" />'''
        },
        # Lightning Fast - Bolt icon
        {
            'old_start': '<rect x="10" y="28" width="6" height="12" fill="white" />',
            'old_end': '<rect x="32" y="12" width="6" height="28" fill="white" />',
            'new': '''<!-- Lightning bolt icon -->
                            <path d="M26 10L16 24H24L22 38L32 24H24L26 10Z" fill="white" />'''
        },
        # Secure - Shield with checkmark
        {
            'old_start': '<rect x="14" y="20" width="20" height="16" rx="2" fill="white" />',
            'old_end': '<circle cx="24" cy="28" r="2" fill="url(#grad-secure)" />',
            'new': '''<!-- Shield with checkmark -->
                            <path d="M24 8L14 12V20C14 27 18 32 24 36C30 32 34 27 34 20V12L24 8Z" fill="white" />
                            <path d="M19 22L22 25L29 18" stroke="url(#grad-secure)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />'''
        },
        # Analytics - Chart icon (already good, keep it)
    ],
    
    # Add more services here...
}

print("Icon update definitions created")
print(f"Services to update: {list(ICON_UPDATES.keys())}")
