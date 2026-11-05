#!/bin/bash
# Download all keynote thumbnail images

mkdir -p public/images/keynotes

cd public/images/keynotes

echo "Downloading keynote thumbnail images..."

# WWDC 2024
curl -L "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=800&q=80" -o wwdc-2024.jpg &

# Google I/O 2024
curl -L "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80" -o google-io-2024.jpg &

# OpenAI Spring Update
curl -L "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" -o openai-spring.jpg &

# Microsoft Surface 2024
curl -L "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" -o surface-2024.jpg &

# Rabbit R1 Launch
curl -L "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80" -o rabbit-r1-launch.jpg &

# Humane Ai Pin Reveal
curl -L "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80" -o humane-reveal.jpg &

# Meta Connect 2023
curl -L "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" -o meta-connect-2023.jpg &

# Tesla AI Day 2022
curl -L "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80" -o tesla-ai-day.jpg &

# Nothing Phone 2a Launch
curl -L "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80" -o nothing-phone-2a.jpg &

# Samsung Unpacked 2024
curl -L "https://images.unsplash.com/photo-1616423664045-60dd55eb3cc1?w=800&q=80" -o samsung-unpacked.jpg &

# Apple Event Sept 2023
curl -L "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80" -o apple-sept-2023.jpg &

# Snap Partner Summit 2024
curl -L "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80" -o snap-summit.jpg &

# Amazon Devices 2024
curl -L "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&q=80" -o amazon-devices.jpg &

# Sony State of Play
curl -L "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80" -o sony-state-of-play.jpg &

# Nintendo Direct
curl -L "https://images.unsplash.com/photo-1612287230217-969e0c12c7d9?w=800&q=80" -o nintendo-direct.jpg &

wait

echo "✅ All keynote images downloaded!"
