import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

folder = r'C:\Users\cursor\Documents\GitHub Copilot\bazi_app\store_assets'

# Configuration (Matching Pro Screenshot)
BG_TOP = (100, 10, 20)      # Deep Rich Red
BG_BOTTOM = (20, 0, 5)      # Almost Black
ACCENT_GOLD = (255, 215, 0)
GOLD_DARK = (218, 165, 32)
ICON_SIZE = (512, 512)

# Fonts
# Try to load a Chinese compatible font using absolute paths for Windows
def get_chinese_font(size):
    font_paths = [
        r"C:\Windows\Fonts\kaiu.ttf",   # DFKai-SB (Traditional Chinese Brush) - Preferred for Bazi
        r"C:\Windows\Fonts\simkai.ttf", # KaiTi (Simplified Chinese Brush)
        r"C:\Windows\Fonts\mingliu.ttc", # MingLiU
        r"C:\Windows\Fonts\msyh.ttc",   # Microsoft YaHei
        r"C:\Windows\Fonts\msyh.ttf",
    ]
    
    for path in font_paths:
        if os.path.exists(path):
            try:
                print(f"Loading font from: {path}")
                return ImageFont.truetype(path, size)
            except Exception as e:
                print(f"Failed to load {path}: {e}")
                
    # Fallback to default if no Chinese font found
    print("Warning: No Chinese font found, falling back to default.")
    return ImageFont.load_default()

font_icon = get_chinese_font(280) # Slightly larger for KaiTi as it's often smaller visually

def create_gradient(width, height, c1, c2):
    base = Image.new('RGB', (width, height), c1)
    top = Image.new('RGB', (width, height), c2)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        mask_data.extend([int(255 * (y / height))] * width)
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

# Generate Icon
print("Generating Pro Icon...")
img_icon = create_gradient(512, 512, BG_TOP, BG_BOTTOM)
img_icon = img_icon.convert("RGBA")  # Ensure RGBA for transparency
draw_icon = ImageDraw.Draw(img_icon)

# 1. Background Pattern - Detailed Luopan / Bazi Compass
# Replaces simple rings with text-based compass rings
cx, cy = 256, 256

def draw_text_ring(draw, radius, text_list, font_size=12, color=ACCENT_GOLD, orientation="upright"):
    # try loading a smaller chinese font
    try:
        f = ImageFont.truetype(font_path, font_size)
    except:
        f = ImageFont.load_default()
        
    count = len(text_list)
    angle_step = 360 / count
    
    # Draw ring circle
    draw.ellipse([cx-radius-15, cy-radius-15, cx+radius+15, cy+radius+15], outline=(255, 215, 0, 50), width=1)
    
    for i, char in enumerate(text_list):
        # Angle starts at -90 (top)
        # But Luopan usually starts South at top? Let's stick to standard clock
        angle = i * angle_step - 90
        rad = math.radians(angle)
        
        # Position
        x = cx + radius * math.cos(rad)
        y = cy + radius * math.sin(rad)
        
        # Rotate text
        # Create temp image for char
        c_img = Image.new('RGBA', (font_size*2, font_size*2), (0,0,0,0))
        c_draw = ImageDraw.Draw(c_img)
        # Center char
        bbox = c_draw.textbbox((0,0), char, font=f)
        w = bbox[2]-bbox[0]
        h = bbox[3]-bbox[1]
        c_draw.text(((font_size*2-w)//2, (font_size*2-h)//2), char, font=f, fill=color)
        
        if orientation == "radial":
            # Rotate character to point to center
            # +90 so text bottom points to center? or top? 
            # Usually text top points to center or upright relative to reading position
            # Let's verify standard: usually bottoms in.
            rot = - (angle + 90)
            c_img = c_img.rotate(rot, resample=Image.Resampling.BICUBIC)
        
        # Paste
        # Calculate paste pos to center the temp img
        px = int(x - font_size)
        py = int(y - font_size)
        
        img_icon.alpha_composite(c_img, dest=(px, py))

# Ring 1: The 8 Trigrams (Bagua) - Inner
trigrams = ["乾", "兌", "離", "震", "巽", "坎", "艮", "坤"]
draw_text_ring(draw_icon, 140, trigrams, 24, color=(255, 200, 100, 150), orientation="radial")

# Ring 2: The 12 Earthly Branches (Zodiac)
branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
draw_text_ring(draw_icon, 180, branches, 20, color=(255, 215, 0, 180), orientation="radial")

# Ring 3: The 24 Mountains (Dense outer ring)
# Simplified list for visual effect
mountains = list("甲卯乙辰巽巳丙午丁未坤申庚酉辛戌乾亥壬子癸丑艮寅") # 24 chars
draw_text_ring(draw_icon, 220, mountains, 16, color=(255, 215, 0, 120), orientation="radial")

# Ring 4: Degree Ticks (Outermost)
draw_icon.ellipse([cx-240, cy-240, cx+240, cy+240], outline=ACCENT_GOLD, width=3)
for i in range(0, 360, 5): # Every 5 degrees
    rad = math.radians(i)
    x1 = cx + 230 * math.cos(rad)
    y1 = cy + 230 * math.sin(rad)
    x2 = cx + 240 * math.cos(rad)
    y2 = cy + 240 * math.sin(rad)
    width = 2 if i % 15 == 0 else 1
    alpha = 255 if i % 45 == 0 else 100
    draw_icon.line([x1, y1, x2, y2], fill=(255, 215, 0, alpha), width=width)

# Center Darkening (Vignette)
# Make the center darker so the "Six" pops out against the rings
vignette = Image.new('RGBA', ICON_SIZE, (0,0,0,0))
v_draw = ImageDraw.Draw(vignette)
v_draw.ellipse([cx-130, cy-130, cx+130, cy+130], fill=(0, 0, 0, 120))
vignette = vignette.filter(ImageFilter.GaussianBlur(30))
img_icon = Image.alpha_composite(img_icon, vignette)
draw_icon = ImageDraw.Draw(img_icon) # Re-get draw object for composite


# 3. Center Element - Large "六"
text_char = "六"

# Removed previous complex logic that caused "White Glow" issues.
# New Strategy: "Solid Imperial Gold"
# 1. Dark Shadow for lift
# 2. Dark Outline for contrast
# 3. Solid Gold Fill (No fancy gradients that might turn white)

# A. Drop Shadow (Heavy)
draw_icon.text((cx+8, cy-17), text_char, font=font_icon, fill=(0, 0, 0, 150), anchor="mm")

# B. Strong Outline (Dark Red/Brown) - To separate from background
# Draw text multiple times for thick stroke, standard PIL method
stroke_col = (60, 10, 0)
draw_icon.text((cx, cy-25), text_char, font=font_icon, fill=stroke_col, anchor="mm", stroke_width=12, stroke_fill=stroke_col)

# C. Inner Rim (Dark Gold)
draw_icon.text((cx, cy-25), text_char, font=font_icon, fill=GOLD_DARK, anchor="mm", stroke_width=4, stroke_fill=GOLD_DARK)

# D. Main Face (Pure Gold)
draw_icon.text((cx, cy-25), text_char, font=font_icon, fill=(255, 204, 0), anchor="mm")

# E. Simple Gloss (Top to Bottom Linear Gradient overlay)
# Create a gradient mask
txt_mask = Image.new('L', ICON_SIZE, 0)
tm_draw = ImageDraw.Draw(txt_mask)
tm_draw.text((cx, cy-25), text_char, font=font_icon, fill=255, anchor="mm")

gradient = Image.new('RGBA', ICON_SIZE, (0,0,0,0))
g_draw = ImageDraw.Draw(gradient)
# White at top -> Transparent -> Gold Dark at bottom
for y in range(cy-165, cy+115):
    # Normalized Y from 0 to 1
    ny = (y - (cy-165)) / 280.0
    if ny < 0.5:
        # Top half: White shine fading out
        alpha = int(100 * (1 - ny*2))
        col = (255, 255, 255, alpha)
    else:
        # Bottom half: Darkening
        alpha = int(100 * ((ny-0.5)*2))
        col = (180, 100, 0, alpha)
    g_draw.line([(0, y), (512, y)], fill=col)

# Correct way: paste gradient using mask
img_icon.paste(gradient, (0,0), mask=txt_mask)

# F. Subtle hard highlight curve on top of text
# Manually offset mask
highlight_mask = Image.new('L', ICON_SIZE, 0)
hm_draw = ImageDraw.Draw(highlight_mask)
hm_draw.text((cx, cy-25), text_char, font=font_icon, fill=255, anchor="mm")
# Shift down to subtract
subtract_mask = Image.new('L', ICON_SIZE, 0)
sm_draw = ImageDraw.Draw(subtract_mask)
sm_draw.text((cx, cy-20), text_char, font=font_icon, fill=255, anchor="mm")
# Invert logic? No, just draw white text with clip?
# Too complex for PIL simple usage, skip for reliability. 
# Just stick to the reliable gold fill above.

# 4. Realistic Gloss/Glass Effect
shine_layer = Image.new('RGBA', ICON_SIZE, (0,0,0,0))
shine_draw = ImageDraw.Draw(shine_layer)

# A. Top Specular Highlight (The "Softbox" reflection)
# large gradient rectangle fading out
for y in range(200):
    alpha = int(60 * (1 - y/200)) 
    shine_draw.line([(0, y), (512, y)], fill=(255, 255, 255, alpha))

# B. Hard Gloss Reflection (The "Glass Dome" top cut)
shine_draw.chord([-120, -180, 632, 260], 0, 180, fill=(255, 255, 255, 35))

# C. Bottom Rim Light (Reflected ambient light)
# A crescent at the bottom
bbox = [20, 20, 492, 492]
shine_draw.arc(bbox, 40, 140, fill=(255, 255, 255, 120), width=4)
shine_draw.arc(bbox, 140, 220, fill=(255, 255, 255, 40), width=2) # Fade out sides

# Composite the shine
img_icon = Image.alpha_composite(img_icon, shine_layer)

img_icon.save(os.path.join(folder, 'pro_icon.png'))
print(f"Generated Pro Icon: {os.path.join(folder, 'pro_icon.png')}")
