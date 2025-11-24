#!/usr/bin/env python3
"""
Generate all remaining service pages with complete content
"""

# Service configurations
services = {
    'service-3d.html': {
        'title': '3D Experiences',
        'hero_title': '3D <span class="gradient-text">Experiences</span>',
        'hero_desc': 'Immersive 3D visualizations and interactive experiences',
        'about_title': 'Immersive Visual Experiences',
        'about_p1': 'We create stunning 3D experiences using Three.js, WebGL, and cutting-edge rendering technologies. From product visualizations to interactive virtual tours, we bring your ideas to life in three dimensions.',
        'about_p2': 'Our 3D solutions run smoothly on all devices, from smartphones to high-end desktops. We optimize performance without sacrificing visual quality, ensuring your users get an amazing experience every time.',
        'stats': [
            ('60 FPS', 'Smooth Performance', 'Optimized 3D rendering maintains 60 frames per second on all devices for fluid interactions.'),
            ('WebGL', 'Browser-Based', 'No downloads or plugins required. 3D experiences run directly in the browser.'),
            ('100%', 'Device Compatible', 'Works perfectly on desktop, tablet, and mobile with adaptive quality settings.')
        ]
    },
    'service-gpt.html': {
        'title': 'Custom GPTs',
        'hero_title': 'Custom <span class="gradient-text">GPTs</span>',
        'hero_desc': 'Specialized AI assistants trained for your specific needs',
        'about_title': 'Your Personal AI Expert',
        'about_p1': 'We build custom GPT models trained on your business data, industry knowledge, and specific use cases. These AI assistants understand your domain and provide expert-level responses tailored to your needs.',
        'about_p2': 'From customer support to internal knowledge bases, our custom GPTs integrate seamlessly with your existing systems and workflows, providing instant, accurate answers 24/7.',
        'stats': [
            ('95%', 'Accuracy Rate', 'Custom training on your data ensures highly accurate and relevant responses.'),
            ('10x', 'Faster Responses', 'Instant answers to complex questions that would take humans hours to research.'),
            ('24/7', 'Always Available', 'Your AI expert never sleeps, providing support around the clock.')
        ]
    },
    'service-dashboards.html': {
        'title': 'AI Dashboards',
        'hero_title': 'AI-Powered <span class="gradient-text">Dashboards</span>',
        'hero_desc': 'Intelligent data visualization and business intelligence',
        'about_title': 'Data-Driven Decision Making',
        'about_p1': 'We build AI-powered dashboards that transform raw data into actionable insights. Our dashboards use machine learning to identify trends, predict outcomes, and highlight what matters most to your business.',
        'about_p2': 'Real-time data visualization, automated reporting, and intelligent alerts ensure you always have the information you need to make informed decisions quickly.',
        'stats': [
            ('Real-time', 'Live Data Updates', 'See your metrics update in real-time with automatic data synchronization.'),
            ('AI Insights', 'Smart Analytics', 'Machine learning algorithms identify trends and anomalies automatically.'),
            ('Custom', 'Fully Tailored', 'Every dashboard is customized to your specific KPIs and business needs.')
        ]
    },
    'service-content.html': {
        'title': 'AI Content Generation',
        'hero_title': 'AI Content <span class="gradient-text">Generation</span>',
        'hero_desc': 'High-quality content created by advanced AI',
        'about_title': 'Content at Scale',
        'about_p1': 'We leverage advanced AI models to generate high-quality content for blogs, social media, product descriptions, and marketing materials. Our AI understands your brand voice and creates content that resonates with your audience.',
        'about_p2': 'From SEO-optimized blog posts to engaging social media content, we help you maintain a consistent content pipeline without the overhead of a large content team.',
        'stats': [
            ('10x', 'Faster Production', 'Generate content 10 times faster than traditional methods while maintaining quality.'),
            ('SEO', 'Optimized Content', 'All content is optimized for search engines with proper keywords and structure.'),
            ('Brand', 'Voice Consistency', 'AI trained on your brand guidelines ensures consistent tone and messaging.')
        ]
    },
    'service-marketing.html': {
        'title': 'AI Marketing',
        'hero_title': 'AI-Powered <span class="gradient-text">Marketing</span>',
        'hero_desc': 'Intelligent marketing automation and optimization',
        'about_title': 'Marketing That Learns',
        'about_p1': 'We implement AI-powered marketing solutions that optimize campaigns in real-time, personalize customer experiences, and maximize ROI. Our systems learn from every interaction to continuously improve performance.',
        'about_p2': 'From predictive analytics to automated A/B testing, we help you make data-driven marketing decisions that drive growth and reduce customer acquisition costs.',
        'stats': [
            ('3x', 'Higher ROI', 'AI optimization increases marketing ROI by an average of 300%.'),
            ('Auto', 'Campaign Optimization', 'Campaigns automatically adjust based on performance data in real-time.'),
            ('Personalized', 'Customer Experiences', 'Each customer sees content tailored to their preferences and behavior.')
        ]
    },
    'service-security.html': {
        'title': 'AI Security',
        'hero_title': 'AI-Powered <span class="gradient-text">Security</span>',
        'hero_desc': 'Intelligent threat detection and protection',
        'about_title': 'Proactive Security',
        'about_p1': 'We implement AI-powered security solutions that detect and prevent threats before they cause damage. Our systems use machine learning to identify unusual patterns, potential vulnerabilities, and security risks in real-time.',
        'about_p2': 'From fraud detection to network security, our AI continuously monitors your systems, learns from new threats, and adapts to protect your business and customer data.',
        'stats': [
            ('99.9%', 'Threat Detection', 'AI identifies and blocks threats with 99.9% accuracy rate.'),
            ('Real-time', 'Instant Response', 'Threats are detected and neutralized in milliseconds, not hours.'),
            ('Adaptive', 'Continuous Learning', 'System learns from new threats and updates defenses automatically.')
        ]
    }
}

print("Service configurations loaded for 6 pages")
print("Ready to generate complete HTML files")
