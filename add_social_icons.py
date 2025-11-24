"""
Script to safely add social media icons to the footer
"""

def add_social_icons_to_footer(filename):
    """Add social media icons to a single HTML file"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if social-icons.css is already linked
        if 'social-icons.css' not in content:
            # Add CSS link after animations.css
            content = content.replace(
                '<link rel="stylesheet" href="css/animations.css">',
                '<link rel="stylesheet" href="css/animations.css">\n    <link rel="stylesheet" href="css/social-icons.css">'
            )
        
        # Social media icons HTML
        social_icons_html = '''                <div class="footer-col">
                    <h4>Connect With Us</h4>
                    <p style="margin-bottom: 15px;"><a href="mailto:hello@praihub.com" style="color: var(--text-muted); text-decoration: none;">hello@praihub.com</a></p>
                    <div class="social-links">
                        <a href="#linkedin" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="Follow us on LinkedIn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                        <a href="#twitter" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Twitter" title="Follow us on Twitter">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                            </svg>
                        </a>
                        <a href="#instagram" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Follow us on Instagram">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a href="#facebook" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Follow us on Facebook">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a href="#youtube" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="Subscribe on YouTube">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                            </svg>
                        </a>
                    </div>
                </div>'''
        
        # Old contact section to replace
        old_contact = '''                <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="mailto:hello@praihub.com">hello@praihub.com</a></li>
                        <li><a href="#">LinkedIn</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">Twitter</a></li>
                    </ul>
                </div>'''
        
        # Replace old contact section with new social icons
        if old_contact in content:
            content = content.replace(old_contact, social_icons_html)
            
            # Write back to file
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ Updated: {filename}")
            return True
        else:
            print(f"⚠️  Contact section not found in {filename} (might already be updated)")
            return False
            
    except Exception as e:
        print(f"❌ Error updating {filename}: {str(e)}")
        return False

# Update index.html
print("🚀 Adding social media icons to footer...\n")
success = add_social_icons_to_footer('index.html')

if success:
    print("\n✨ Social media icons added successfully!")
    print("\n📝 Next steps:")
    print("1. Open index.html in your browser to see the animated icons")
    print("2. Replace #linkedin, #twitter, etc. with your actual social media URLs")
else:
    print("\n⚠️  Could not update the file. Please check if the footer structure matches.")
