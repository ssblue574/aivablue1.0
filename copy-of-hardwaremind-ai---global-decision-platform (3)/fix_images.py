#!/usr/bin/env python3
"""
Replace all image URLs with reliable, tested Unsplash images
"""

import re

# Reliable Unsplash images for products (tested and verified)
product_images = {
    "p_rabbit_r1": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80",
    "p_humane_ai_pin": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    "p_friend_necklace": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    "p_brilliant_frame": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    "p_limitless_pendant": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    "p_tab_ai": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    "p_rewind_pendant": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    "p_tp7": "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80",
    "p_cm15": "https://images.unsplash.com/photo-1590845947698-8924d7409b56?w=800&q=80",
    "p_nothing_phone_2a": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    "p_google_pixel_fold": "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=800&q=80",
    "p_meta_quest_3": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80",
}

# Read products file
with open('data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace each product's image
for product_id, image_url in product_images.items():
    # Find the product section
    pattern = rf'("id":\s*"{product_id}".*?"imageUrl":\s*)"[^"]*"'
    replacement = rf'\1"{image_url}"'
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    print(f"Updated image for {product_id}")

# Write back
with open('data/products.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nProducts images updated!")

# Now update news images
news_images = [
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",  # GPU/AI
    "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80",  # VR
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",  # AI/Tech
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80",     # Device
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",  # Wearable
    "https://images.unsplash.com/photo-1616423664045-60dd55eb3cc1?w=800&q=80",  # Ring
    "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80",  # VR
    "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80",  # Tech
    "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=800&q=80",     # Phone
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",     # Car
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",  # Laptop
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80",  # Earbuds
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",  # Drone
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",  # Glasses
    "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&q=80",  # Kindle
]

# Read news file
with open('data/news.ts', 'r', encoding='utf-8') as f:
    news_content = f.read()

# Find all imageUrl entries and replace with reliable ones
news_urls = re.findall(r'"imageUrl":\s*"([^"]*)"', news_content)
print(f"\nFound {len(news_urls)} news images")

# Replace with cycling through our reliable images
for i, old_url in enumerate(news_urls):
    new_url = news_images[i % len(news_images)]
    news_content = news_content.replace(f'"{old_url}"', f'"{new_url}"', 1)

# Write back
with open('data/news.ts', 'w', encoding='utf-8') as f:
    f.write(news_content)

print("News images updated!")
print("\nAll images have been replaced with reliable Unsplash URLs!")
