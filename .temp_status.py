import os

# Template for service pages - I'll create all 6 remaining pages
# This is just a status tracker
services_remaining = [
    'service-3d.html',
    'service-gpt.html', 
    'service-dashboards.html',
    'service-content.html',
    'service-marketing.html',
    'service-security.html'
]

print("Creating 6 remaining service pages...")
for service in services_remaining:
    print(f"  - {service}")
print("\nAll pages will have:")
print("  ✓ SVG icons (no emojis)")
print("  ✓ Stat cards with descriptions")
print("  ✓ 6 benefits, 6 features, 6 use cases, 6 FAQs")
print("  ✓ Compact, well-aligned layout")
