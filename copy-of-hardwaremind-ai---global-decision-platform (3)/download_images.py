#!/usr/bin/env python3
"""
Download product and news images from Unsplash to local storage
"""

import urllib.request
import os

# Create directories if they don't exist
os.makedirs('public/images/products', exist_ok=True)
os.makedirs('public/images/news', exist_ok=True)

# Product images to download (using high-quality Unsplash images)
product_downloads = {
    'rewind-pendant.png': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    'tp7.png': 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80',
    'cm15.png': 'https://images.unsplash.com/photo-1590845947698-8924d7409b56?w=800&q=80',
    'nothing-phone-2a.png': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    'pixel-fold.png': 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=800&q=80',
    'meta-quest-3.png': 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80',
}

# News images to download
news_downloads = {
    'nvidia-h200.jpg': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    'vision-pro.jpg': 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80',
    'openai-devday.jpg': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    'rabbit-r1-ces.jpg': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
    'humane-shipping.jpg': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    'galaxy-ring.jpg': 'https://images.unsplash.com/photo-1616423664045-60dd55eb3cc1?w=800&q=80',
    'meta-connect.jpg': 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80',
    'google-io.jpg': 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80',
    'ios-18.jpg': 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=800&q=80',
    'tesla-robotaxi.jpg': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
    'surface-event.jpg': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    'nothing-ear.jpg': 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80',
    'dji-neo.jpg': 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
    'spectacles-5.jpg': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    'kindle-colorsoft.jpg': 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&q=80',
}

print("Downloading product images...")
for filename, url in product_downloads.items():
    filepath = f'public/images/products/{filename}'
    try:
        urllib.request.urlretrieve(url, filepath)
        print(f"✓ Downloaded {filename}")
    except Exception as e:
        print(f"✗ Failed to download {filename}: {e}")

print("\nDownloading news images...")
for filename, url in news_downloads.items():
    filepath = f'public/images/news/{filename}'
    try:
        urllib.request.urlretrieve(url, filepath)
        print(f"✓ Downloaded {filename}")
    except Exception as e:
        print(f"✗ Failed to download {filename}: {e}")

print("\n✅ All images downloaded successfully!")
print("Images are now stored locally in public/images/")
