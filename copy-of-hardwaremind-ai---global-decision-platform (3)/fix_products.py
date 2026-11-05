#!/usr/bin/env python3
"""
Script to fix product data structure by adding missing localized fields
"""

# Product metadata for each product
products_meta = [
    {
        "id": "p_rabbit_r1",
        "name_en": "Rabbit R1",
        "name_zh": "Rabbit R1",
        "brand": "Rabbit Inc.",
        "category_en": "AI Assistant",
        "category_zh": "AI 助手",
        "price_en": "$199",
        "price_zh": "¥1399",
        "tags_en": '["LAM", "Teenage Engineering", "Voice First"]',
        "tags_zh": '["LAM", "Teenage Engineering", "语音优先"]',
    },
    {
        "id": "p_humane_ai_pin",
        "name_en": "Humane Ai Pin",
        "name_zh": "Humane Ai Pin",
        "brand": "Humane",
        "category_en": "Wearable",
        "category_zh": "可穿戴设备",
        "price_en": "$699",
        "price_zh": "¥4999",
        "tags_en": '["Laser Projection", "Voice OS", "Privacy"]',
        "tags_zh": '["激光投影", "语音系统", "隐私"]',
    },
    {
        "id": "p_friend_necklace",
        "name_en": "Friend",
        "name_zh": "Friend",
        "brand": "Friend",
        "category_en": "Wearable",
        "category_zh": "可穿戴设备",
        "price_en": "$99",
        "price_zh": "¥699",
        "tags_en": '["Open Source", "Companion", "Audio"]',
        "tags_zh": '["开源", "伴侣", "音频"]',
    },
    {
        "id": "p_brilliant_frame",
        "name_en": "Frame",
        "name_zh": "Frame",
        "brand": "Brilliant Labs",
        "category_en": "AR Glasses",
        "category_zh": "AR 眼镜",
        "price_en": "$349",
        "price_zh": "¥2499",
        "tags_en": '["Multimodal", "Open Source", "Lightweight"]',
        "tags_zh": '["多模态", "开源", "轻量级"]',
    },
    {
        "id": "p_limitless_pendant",
        "name_en": "Limitless Pendant",
        "name_zh": "Limitless Pendant",
        "brand": "Limitless",
        "category_en": "Wearable",
        "category_zh": "可穿戴设备",
        "price_en": "$99",
        "price_zh": "¥699",
        "tags_en": '["Productivity", "Meeting Recorder", "Privacy"]',
        "tags_zh": '["生产力", "会议记录", "隐私"]',
    },
    {
        "id": "p_tab_ai",
        "name_en": "Tab",
        "name_zh": "Tab",
        "brand": "Tab",
        "category_en": "Wearable",
        "category_zh": "可穿戴设备",
        "price_en": "$600",
        "price_zh": "¥4299",
        "tags_en": '["Companion", "Privacy", "Design"]',
        "tags_zh": '["伴侣", "隐私", "设计"]',
    },
    {
        "id": "p_rewind_pendant",
        "name_en": "Rewind Pendant",
        "name_zh": "Rewind Pendant",
        "brand": "Rewind",
        "category_en": "Wearable",
        "category_zh": "可穿戴设备",
        "price_en": "$59/mo",
        "price_zh": "¥399/月",
        "tags_en": '["Memory", "AI", "Privacy"]',
        "tags_zh": '["记忆", "AI", "隐私"]',
    },
    {
        "id": "p_tp7",
        "name_en": "TP-7",
        "name_zh": "TP-7",
        "brand": "Teenage Engineering",
        "category_en": "Audio",
        "category_zh": "音频设备",
        "price_en": "$1499",
        "price_zh": "¥10999",
        "tags_en": '["Design", "Field Recorder", "Premium"]',
        "tags_zh": '["设计", "录音机", "高端"]',
    },
    {
        "id": "p_cm15",
        "name_en": "CM-15",
        "name_zh": "CM-15",
        "brand": "Teenage Engineering",
        "category_en": "Audio",
        "category_zh": "音频设备",
        "price_en": "$1199",
        "price_zh": "¥8999",
        "tags_en": '["Microphone", "Studio", "Portable"]',
        "tags_zh": '["麦克风", "录音棚", "便携"]',
    },
    {
        "id": "p_nothing_phone_2a",
        "name_en": "Nothing Phone (2a)",
        "name_zh": "Nothing Phone (2a)",
        "brand": "Nothing",
        "category_en": "Smartphone",
        "category_zh": "智能手机",
        "price_en": "$349",
        "price_zh": "¥2499",
        "tags_en": '["Budget", "Design", "Glyph"]',
        "tags_zh": '["性价比", "设计", "Glyph"]',
    },
    {
        "id": "p_google_pixel_fold",
        "name_en": "Google Pixel Fold",
        "name_zh": "Google Pixel Fold",
        "brand": "Google",
        "category_en": "Smartphone",
        "category_zh": "智能手机",
        "price_en": "$1799",
        "price_zh": "¥12999",
        "tags_en": '["Foldable", "Android", "Tablet"]',
        "tags_zh": '["折叠屏", "Android", "平板"]',
    },
    {
        "id": "p_meta_quest_3",
        "name_en": "Meta Quest 3",
        "name_zh": "Meta Quest 3",
        "brand": "Meta",
        "category_en": "VR Headset",
        "category_zh": "VR 头显",
        "price_en": "$499",
        "price_zh": "¥3599",
        "tags_en": '["MR", "Gaming", "Spatial"]',
        "tags_zh": '["MR", "游戏", "空间计算"]',
    },
]

# Read the file
with open('data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# For each product, add the missing fields
for product in products_meta:
    # Find the product's locales section
    product_id = product['id']
    
    # Pattern to find: "en": {
    # And insert after it: "name": "...", "brand": "...", etc.
    
    # Find the position of this product
    id_pos = content.find(f'"{product_id}"')
    if id_pos == -1:
        print(f"Warning: Product {product_id} not found")
        continue
    
    # Find the "en": { after this product
    en_start = content.find('"en": {', id_pos)
    if en_start == -1:
        continue
    
    # Find the next line after "en": {
    next_line_pos = content.find('\n', en_start) + 1
    
    # Check if "name" already exists
    check_section = content[next_line_pos:next_line_pos+500]
    if '"name":' in check_section:
        print(f"Product {product_id} already has name field, skipping")
        continue
    
    # Insert English fields
    en_fields = f'''                "name": "{product['name_en']}",
                "brand": "{product['brand']}",
                "category": "{product['category_en']}",
                "priceEstimate": "{product['price_en']}",
                "buyingChannel": "Official",
                "tags": {product['tags_en']},
'''
    
    content = content[:next_line_pos] + en_fields + content[next_line_pos:]
    
    # Now find and update zh section
    # Re-find the product position (content has changed)
    id_pos = content.find(f'"{product_id}"')
    zh_start = content.find('"zh": {', id_pos)
    if zh_start == -1:
        continue
    
    next_line_pos = content.find('\n', zh_start) + 1
    
    # Insert Chinese fields
    zh_fields = f'''                "name": "{product['name_zh']}",
                "brand": "{product['brand']}",
                "category": "{product['category_zh']}",
                "priceEstimate": "{product['price_zh']}",
                "buyingChannel": "官网",
                "tags": {product['tags_zh']},
'''
    
    content = content[:next_line_pos] + zh_fields + content[next_line_pos:]
    
    print(f"Fixed product: {product_id}")

# Write back
with open('data/products.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("All products fixed!")
