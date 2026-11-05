#!/usr/bin/env python3
"""
Update all product and news images to use local paths
"""

import re

# Product image mappings (local paths)
product_images = {
    "p_rabbit_r1": "/images/products/rabbit-r1.png",
    "p_humane_ai_pin": "/images/products/humane-ai-pin.png",
    "p_friend_necklace": "/images/products/friend-necklace.png",
    "p_brilliant_frame": "/images/products/brilliant-frame.png",
    "p_limitless_pendant": "/images/products/limitless-pendant.png",
    "p_tab_ai": "/images/products/tab.png",
    "p_rewind_pendant": "/images/products/rewind-pendant.png",
    "p_tp7": "/images/products/tp7.png",
    "p_cm15": "/images/products/cm15.png",
    "p_nothing_phone_2a": "/images/products/nothing-phone-2a.png",
    "p_google_pixel_fold": "/images/products/pixel-fold.png",
    "p_meta_quest_3": "/images/products/meta-quest-3.png",
}

# Read products file
with open('data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace each product's image
for product_id, image_path in product_images.items():
    # Find the product section and replace imageUrl
    pattern = rf'("id":\s*"{product_id}".*?"imageUrl":\s*)"[^"]*"'
    replacement = rf'\1"{image_path}"'
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    print(f"Updated image path for {product_id} -> {image_path}")

# Write back
with open('data/products.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nProducts images updated to local paths!")

# Update news images to local paths
news_image_mapping = {
    "n_nvidia_h200": "/images/news/nvidia-h200.jpg",
    "n_apple_vision_pro_launch": "/images/news/vision-pro.jpg",
    "n_openai_dev_day": "/images/news/openai-devday.jpg",
    "n_rabbit_r1_announcement": "/images/news/rabbit-r1-ces.jpg",
    "n_humane_shipping": "/images/news/humane-shipping.jpg",
    "n_samsung_galaxy_ring": "/images/news/galaxy-ring.jpg",
    "n_meta_connect_2024": "/images/news/meta-connect.jpg",
    "n_google_io_2024": "/images/news/google-io.jpg",
    "n_ios_18_preview": "/images/news/ios-18.jpg",
    "n_tesla_robotaxi": "/images/news/tesla-robotaxi.jpg",
    "n_microsoft_surface_event": "/images/news/surface-event.jpg",
    "n_nothing_ear_open": "/images/news/nothing-ear.jpg",
    "n_dji_neo": "/images/news/dji-neo.jpg",
    "n_snap_spectacles_5": "/images/news/spectacles-5.jpg",
    "n_kindle_colorsoft": "/images/news/kindle-colorsoft.jpg",
}

# Read news file
with open('data/news.ts', 'r', encoding='utf-8') as f:
    news_content = f.read()

# Replace news images
for news_id, image_path in news_image_mapping.items():
    pattern = rf'("id":\s*"{news_id}".*?"imageUrl":\s*)"[^"]*"'
    replacement = rf'\1"{image_path}"'
    news_content = re.sub(pattern, replacement, news_content, flags=re.DOTALL)
    print(f"Updated news image: {news_id} -> {image_path}")

# Write back
with open('data/news.ts', 'w', encoding='utf-8') as f:
    f.write(news_content)

print("\nNews images updated to local paths!")
print("\nAll images now use local paths in /public/images/")
