#!/bin/bash
# Download all news images using curl

cd public/images/news

echo "Downloading news images..."

curl -L "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80" -o nvidia-h200.jpg &
curl -L "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80" -o vision-pro.jpg &
curl -L "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" -o openai-devday.jpg &
curl -L "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80" -o rabbit-r1-ces.jpg &
curl -L "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80" -o humane-shipping.jpg &
curl -L "https://images.unsplash.com/photo-1616423664045-60dd55eb3cc1?w=800&q=80" -o galaxy-ring.jpg &
curl -L "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80" -o meta-connect.jpg &
curl -L "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80" -o google-io.jpg &
curl -L "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=800&q=80" -o ios-18.jpg &
curl -L "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80" -o tesla-robotaxi.jpg &
curl -L "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" -o surface-event.jpg &
curl -L "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80" -o nothing-ear.jpg &
curl -L "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80" -o dji-neo.jpg &
curl -L "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80" -o spectacles-5.jpg &
curl -L "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&q=80" -o kindle-colorsoft.jpg &

wait

echo "✅ All news images downloaded!"
