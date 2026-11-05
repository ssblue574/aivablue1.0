#!/bin/bash
# Download product-specific images from Unsplash with better matching

cd public/images/products

echo "Downloading product-specific images..."

# Rabbit R1 - AI device with orange color
curl -L "https://images.unsplash.com/photo-1635514569146-9a9607ecf303?w=800&q=80" -o rabbit-r1.png &

# Humane Ai Pin - wearable pin device
curl -L "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&q=80" -o humane-ai-pin.png &

# Friend Necklace - pendant/necklace wearable
curl -L "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80" -o friend-necklace.png &

# Brilliant Frame - AR glasses
curl -L "https://images.unsplash.com/photo-1574068468668-a05a11f871da?w=800&q=80" -o brilliant-frame.png &

# Limitless Pendant - smart pendant
curl -L "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" -o limitless-pendant.png &

# Tab - wearable AI device
curl -L "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80" -o tab.png &

# Rewind Pendant - smart wearable
curl -L "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80" -o rewind-pendant.png &

# TP-7 - audio recorder device
curl -L "https://images.unsplash.com/photo-1619641805634-4c36c2f7f0a3?w=800&q=80" -o tp7.png &

# CM-15 - microphone device
curl -L "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80" -o cm15.png &

# Nothing Phone (2a) - smartphone with glyph lights
curl -L "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80" -o nothing-phone-2a.png &

# Google Pixel Fold - foldable phone
curl -L "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80" -o pixel-fold.png &

# Meta Quest 3 - VR headset
curl -L "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80" -o meta-quest-3.png &

wait

echo "✅ All product images updated with better matches!"
