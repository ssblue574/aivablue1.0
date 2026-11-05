#!/usr/bin/env python3
"""
Update keynotes.ts to use local image paths
"""

import re

# Keynote image mappings (local paths)
keynote_images = {
    "k_apple_wwdc_2024": "/images/keynotes/wwdc-2024.jpg",
    "k_google_io_2024": "/images/keynotes/google-io-2024.jpg",
    "k_openai_spring_update": "/images/keynotes/openai-spring.jpg",
    "k_microsoft_surface_2024": "/images/keynotes/surface-2024.jpg",
    "k_rabbit_r1_launch": "/images/keynotes/rabbit-r1-launch.jpg",
    "k_humane_ai_pin_reveal": "/images/keynotes/humane-reveal.jpg",
    "k_meta_connect_2023": "/images/keynotes/meta-connect-2023.jpg",
    "k_tesla_ai_day_2022": "/images/keynotes/tesla-ai-day.jpg",
    "k_nothing_phone_2a_launch": "/images/keynotes/nothing-phone-2a.jpg",
    "k_samsung_unpacked_2024": "/images/keynotes/samsung-unpacked.jpg",
    "k_apple_event_sept_2023": "/images/keynotes/apple-sept-2023.jpg",
    "k_snap_partner_summit_2024": "/images/keynotes/snap-summit.jpg",
    "k_amazon_devices_2024": "/images/keynotes/amazon-devices.jpg",
    "k_sony_state_of_play": "/images/keynotes/sony-state-of-play.jpg",
    "k_nintendo_direct": "/images/keynotes/nintendo-direct.jpg",
}

# Read keynotes file
with open('data/keynotes.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace each keynote's thumbnail
for keynote_id, image_path in keynote_images.items():
    # Find the keynote section and replace thumbnailUrl
    pattern = rf'("id":\s*"{keynote_id}".*?"thumbnailUrl":\s*)"[^"]*"'
    replacement = rf'\1"{image_path}"'
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    print(f"Updated thumbnail for {keynote_id} -> {image_path}")

# Write back
with open('data/keynotes.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nKeynotes thumbnails updated to local paths!")
print("All platform images now use local storage!")
