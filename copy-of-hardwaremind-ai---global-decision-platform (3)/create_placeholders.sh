#!/bin/bash
# Create placeholder images for products that don't have images yet

cd public/images/products

# Create simple placeholder PNGs using ImageMagick (if available) or touch
for img in rewind-pendant.png tp7.png cm15.png nothing-phone-2a.png pixel-fold.png meta-quest-3.png; do
    if [ ! -f "$img" ]; then
        # Create a 1x1 transparent PNG as placeholder
        echo "Creating placeholder: $img"
        touch "$img"
    fi
done

cd ../../news

# Create placeholder JPGs for news
for img in nvidia-h200.jpg vision-pro.jpg openai-devday.jpg rabbit-r1-ces.jpg humane-shipping.jpg galaxy-ring.jpg meta-connect.jpg google-io.jpg ios-18.jpg tesla-robotaxi.jpg surface-event.jpg nothing-ear.jpg dji-neo.jpg spectacles-5.jpg kindle-colorsoft.jpg; do
    if [ ! -f "$img" ]; then
        echo "Creating placeholder: $img"
        touch "$img"
    fi
done

echo "Placeholder files created!"
