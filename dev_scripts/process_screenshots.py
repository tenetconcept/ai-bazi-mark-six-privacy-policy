import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

folder = r'C:\Users\cursor\Documents\GitHub Copilot\bazi_app\store_assets'
output_folder = folder

# Configuration
# Theme Colors (Premium Red/Gold)
BG_TOP = (100, 10, 20)      # Deep Rich Red
BG_BOTTOM = (20, 0, 5)      # Almost Black
ACCENT_GOLD = (255, 215, 0)
TEXT_TITLE = (255, 255, 255)
TEXT_SUB = (255, 230, 200)

texts = [
    {
        "file": "ssa.jpeg",  # 對應截圖3 - 精準幸運號碼 (現在改為 ssa)
        "title": "智能運算號碼", 
        "subtitle": "結合時辰吉位 · 提升中獎機率"
    },
    {
        "file": "ssb.jpeg",  # 對應截圖1 - 號碼建議記錄
        "title": "號碼建議記錄", 
        "subtitle": "追蹤過往運勢 · 掌握開獎先機" 
    },
    {
        "file": "ssc.jpeg", # 對應截圖2 - 八字命理分析
        "title": "八字命理分析", 
        "subtitle": "依出生時地 · 深度解讀個人運程"
    },
    {
        "file": "ssd.jpeg", # 第4張 - 重複利用或新圖 - 強調詳細解讀
        "title": "助您趨吉避凶", 
        "subtitle": "全方位剖析 · 掌握每日幸運機遇"
    }
]

# Fonts
def load_font(size):
    try:
        return ImageFont.truetype("msyh.ttc", size) # Windows Chinese Font
    except:
        try:
            return ImageFont.truetype("arial.ttf", size)
        except:
            return ImageFont.load_default()

font_title = load_font(80)
font_subtitle = load_font(42)

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

def draw_phone_frame(draw, x, y, w, h, radius=60):
    # Border/Bezel (Dark Gray/Metallic)
    border_color = (40, 40, 40)
    screen_bg = (0, 0, 0)
    
    # Outer Frame (Shadow/Bezel)
    draw.rounded_rectangle([x-15, y-15, x+w+15, y+h+15], radius=radius+10, fill=(20, 20, 20))
    # Main Body
    draw.rounded_rectangle([x-5, y-5, x+w+5, y+h+5], radius=radius+2, fill=(60, 60, 60))
    # Inner Screen Area (Black)
    draw.rounded_rectangle([x, y, x+w, y+h], radius=radius, fill=screen_bg)

    # Dynamic Island / Notch
    island_w = 180
    island_h = 45
    island_x = x + (w - island_w) // 2
    island_y = y + 20
    draw.rounded_rectangle([island_x, island_y, island_x+island_w, island_y+island_h], radius=20, fill=(0,0,0))

def process_screenshot(info, index):
    filepath = os.path.join(folder, info["file"])
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    # 1. Open and Prep Screenshot
    try:
        src = Image.open(filepath).convert("RGB")
    except:
        return

    # Remove status bar (Hack: Paint top 5% with header color)
    w, h = src.size
    header_color = src.getpixel((w//2, h//10)) # Sample color a bit down
    draw_src = ImageDraw.Draw(src)
    draw_src.rectangle([0, 0, w, int(h*0.05)], fill=header_color)
    # Remove bottom bar
    bottom_color = src.getpixel((w//2, int(h*0.95)))
    draw_src.rectangle([0, int(h*0.97), w, h], fill=bottom_color)

    # Target Canvas
    final_w, final_h = 1080, 1920
    canvas = create_gradient(final_w, final_h, BG_TOP, BG_BOTTOM)
    draw = ImageDraw.Draw(canvas)

    # 2. Add Background Decorations (Compass/Rings for "Pro" Bazi look)
    # Gold rings
    draw.ellipse([final_w//2 - 600, final_h//2 - 600, final_w//2 + 600, final_h//2 + 600], outline=(255, 215, 0, 30), width=2)
    draw.ellipse([final_w//2 - 800, final_h//2 - 800, final_w//2 + 800, final_h//2 + 800], outline=(255, 215, 0, 20), width=5)
    
    # 3. Phone Mockup Setup
    # Desired Phone Width on canvas
    phone_target_w = int(final_w * 0.82) # 820px
    ratio = phone_target_w / w
    phone_target_h = int(h * ratio)
    
    # Resize screenshot
    src_resized = src.resize((phone_target_w, phone_target_h), Image.Resampling.LANCZOS)
    
    # Apply Rounded Corners to Screenshot
    mask = Image.new("L", (phone_target_w, phone_target_h), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle([0, 0, phone_target_w, phone_target_h], radius=50, fill=255)
    
    rounded_scr = Image.new("RGBA", (phone_target_w, phone_target_h))
    rounded_scr.paste(src_resized, (0,0), mask=mask) # Paste rgb into rgba using mask alpha

    # Position: Lower part of screen
    phone_x = (final_w - phone_target_w) // 2
    phone_y = 500 # Push down to leave room for text header

    # Draw Shadow (Soft, diffused)
    shadow_w = int(phone_target_w * 0.9)
    shadow_h = 40
    shadow = Image.new("RGBA", (final_w, final_h), (0,0,0,0))
    d_sh = ImageDraw.Draw(shadow)
    d_sh.ellipse([phone_x + (phone_target_w-shadow_w)//2, phone_y + phone_target_h - 10, 
                  phone_x + (phone_target_w+shadow_w)//2, phone_y + phone_target_h + 50], 
                 fill=(0, 0, 0, 150))
    shadow = shadow.filter(ImageFilter.GaussianBlur(25))
    canvas.paste(shadow, (0,0), mask=shadow)

    # Draw Phone Bezel
    # Bezel is slightly larger than screen
    bezel_layer = Image.new("RGBA", (final_w, final_h), (0,0,0,0))
    d_bezel = ImageDraw.Draw(bezel_layer)
    draw_phone_frame(d_bezel, phone_x, phone_y, phone_target_w, phone_target_h, radius=50)
    canvas.paste(bezel_layer, (0,0), mask=bezel_layer)  # Paste Frame

    # Paste Screen
    canvas.paste(rounded_scr, (phone_x, phone_y), mask=rounded_scr)
    
    # Add Glass Reflection (Gloss)
    gloss = Image.new("RGBA", (phone_target_w, phone_target_h), (0,0,0,0))
    d_gloss = ImageDraw.Draw(gloss)
    d_gloss.polygon([(0,0), (phone_target_w, 0), (phone_target_w, phone_target_h//2), (0, phone_target_h//3)], fill=(255,255,255,20))
    # Mask gloss to corners
    final_gloss = Image.new("RGBA", (phone_target_w, phone_target_h), (0,0,0,0))
    final_gloss.paste(gloss, (0,0), mask=mask)
    canvas.paste(final_gloss, (phone_x, phone_y), mask=final_gloss)


    # 4. Text (Header Area)
    # Title
    t_bbox = draw.textbbox((0, 0), info["title"], font=font_title)
    t_w = t_bbox[2] - t_bbox[0]
    draw.text(((final_w - t_w)//2, 180), info["title"], font=font_title, fill=TEXT_TITLE)

    # Decor line under title
    draw.line([(final_w//2 - 50, 280), (final_w//2 + 50, 280)], fill=ACCENT_GOLD, width=4)

    # Subtitle
    s_bbox = draw.textbbox((0, 0), info["subtitle"], font=font_subtitle)
    s_w = s_bbox[2] - s_bbox[0]
    draw.text(((final_w - s_w)//2, 310), info["subtitle"], font=font_subtitle, fill=TEXT_SUB)

    # 5. Save
    out = os.path.join(output_folder, f"pro_screenshot_{index+1}.png")
    canvas.save(out)
    print(f"Generated Pro: {out}")

def generate_combo_screenshot():
    # Helper to create a single phone element
    def create_phone_element(filename, width_target):
        fp = os.path.join(folder, filename)
        if not os.path.exists(fp): return None
        
        try:
            src = Image.open(fp).convert("RGB")
        except: return None
        
        # Clean bars
        w, h = src.size
        draw_src = ImageDraw.Draw(src)
        draw_src.rectangle([0, 0, w, int(h*0.05)], fill=src.getpixel((w//2, h//10)))
        draw_src.rectangle([0, int(h*0.97), w, h], fill=src.getpixel((w//2, int(h*0.95))))

        # Resize
        ratio = width_target / w
        height_target = int(h * ratio)
        src_resized = src.resize((width_target, height_target), Image.Resampling.LANCZOS)
        
        # Container (frame + screen)
        # Margin for frame
        margin = 15
        full_w = width_target + margin*2
        full_h = height_target + margin*2
        
        container = Image.new("RGBA", (full_w, full_h), (0,0,0,0))
        d_cont = ImageDraw.Draw(container)
        
        # Draw Frame centered in container
        # Use simpler frame drawing here relative to container 0,0
        # Bezel
        d_cont.rounded_rectangle([0, 0, full_w, full_h], radius=60, fill=(20, 20, 20)) # Outer
        d_cont.rounded_rectangle([10, 10, full_w-10, full_h-10], radius=52, fill=(60, 60, 60)) # Body
        
        # Screen Mask
        mask = Image.new("L", (width_target, height_target), 0)
        dm = ImageDraw.Draw(mask)
        dm.rounded_rectangle([0, 0, width_target, height_target], radius=45, fill=255)
        
        # Paste Screen into container
        screen_layer = Image.new("RGBA", (width_target, height_target), (0,0,0,0))
        screen_layer.paste(src_resized, (0,0), mask=mask)
        container.paste(screen_layer, (margin, margin), mask=screen_layer)
        
        # Dynamic Island
        d_cont.rounded_rectangle([full_w//2 - 60, margin+15, full_w//2 + 60, margin+40], radius=20, fill=(0,0,0))

        return container

    print("Generating Combo Screenshot...")
    
    # 1. Setup Canvas
    final_w, final_h = 1080, 1920
    canvas = create_gradient(final_w, final_h, BG_TOP, BG_BOTTOM)
    draw = ImageDraw.Draw(canvas)
    
    # Background Rings
    draw.ellipse([final_w//2 - 700, final_h//2 - 500, final_w//2 + 700, final_h//2 + 900], outline=(255, 215, 0, 30), width=2)

    # 2. Text
    # User requested theme: "六合彩幸運號碼+八字分析"
    title = "六合彩號碼 + 八字分析"
    subtitle = "獨家結合 · 提升中獎機率"
    
    # Auto-scale font if title too long
    f_title_combo = font_title
    if len(title) > 8:
        f_title_combo = load_font(65)

    t_bbox = draw.textbbox((0, 0), title, font=f_title_combo)
    draw.text(((final_w - (t_bbox[2]-t_bbox[0]))//2, 150), title, font=f_title_combo, fill=TEXT_TITLE)
    
    draw.line([(final_w//2 - 50, 250), (final_w//2 + 50, 250)], fill=ACCENT_GOLD, width=4)
    
    s_bbox = draw.textbbox((0, 0), subtitle, font=font_subtitle)
    draw.text(((final_w - (s_bbox[2]-s_bbox[0]))//2, 280), subtitle, font=font_subtitle, fill=TEXT_SUB)

    # 3. Create Phones
    # Center phone bigger? Or same size?
    # Let's make side phones 550px wide, Center 600px wide
    # Total canvas 1080.
    
    phone_c = create_phone_element("ssa.jpeg", 600)  # Main Lucky Numbers
    phone_l = create_phone_element("ssb.jpeg", 520)  # History
    phone_r = create_phone_element("ssc.jpeg", 520)  # Bazi
    
    if not (phone_c and phone_l and phone_r):
        print("Missing source images for combo.")
        return

    # 4. Position & Rotate
    
    # Left Phone
    # Position: Left side, slightly lower, rotated +15 deg (tilted inward?) 
    # Usually visuals look like:  /  |  \
    # Left rotated -15, Right rotated +15
    
    # Left
    pl_rot = phone_l.rotate(15, expand=True, resample=Image.Resampling.BICUBIC)
    # Positioning is tricky with rotation expansion.
    # Place center at roughly 200, 1000
    canvas.paste(pl_rot, (-150, 700), mask=pl_rot)

    # Right
    pr_rot = phone_r.rotate(-15, expand=True, resample=Image.Resampling.BICUBIC)
    canvas.paste(pr_rot, (final_w - pr_rot.width + 150, 700), mask=pr_rot)

    # Center (Front)
    # Simply paste centered, lower down to overlap
    cx = (final_w - phone_c.width) // 2
    cy = 500
    
    # Shadow for center phone to separate it
    shad = Image.new("RGBA", (phone_c.width + 100, phone_c.height + 100), (0,0,0,0))
    ds = ImageDraw.Draw(shad)
    ds.ellipse([20, phone_c.height-20, phone_c.width+80, phone_c.height+80], fill=(0,0,0, 180))
    shad = shad.filter(ImageFilter.GaussianBlur(40))
    canvas.paste(shad, (cx-50, cy), mask=shad)

    canvas.paste(phone_c, (cx, cy), mask=phone_c)

    # Save
    out = os.path.join(output_folder, "pro_screenshot_4.png") # Overwrite the duplicate
    canvas.save(out)
    print(f"Generated Combo Pro: {out}")

# Run
print("Processing individual screenshots...")
for i, info in enumerate(texts):
    # Skip the 4th dummy one in the loop if we only have 3 text items originally or if index is 3
    # Actually the loop uses 'texts' list.
    # We added the 4th item to 'texts' in previous turn.
    # We should run the loop for 0,1,2 only, then run combo for 3.
    if i < 3:
        process_screenshot(info, i)

generate_combo_screenshot()
