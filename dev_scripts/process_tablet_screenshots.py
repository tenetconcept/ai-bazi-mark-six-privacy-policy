from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

# Configuration
folder = r'C:\Users\cursor\Documents\GitHub Copilot\bazi_app\store_assets'
output_folder = folder

# Themes
BG_TOP = (100, 10, 20)      # Deep Rich Red
BG_BOTTOM = (20, 0, 5)      # Almost Black
ACCENT_GOLD = (255, 215, 0)
TEXT_TITLE = (255, 255, 255)
TEXT_SUB = (255, 230, 200)

texts = [
    {
        "file": "ssa.jpeg",
        "title": "智能運算號碼", 
        "subtitle": "結合時辰吉位 · 提升中獎機率"
    },
    {
        "file": "ssb.jpeg",
        "title": "號碼建議記錄", 
        "subtitle": "追蹤過往運勢 · 掌握開獎先機" 
    },
    {
        "file": "ssc.jpeg",
        "title": "八字命理分析", 
        "subtitle": "依出生時地 · 深度解讀個人運程"
    }
]

# Shared Functions
def load_font(size):
    try:
        # Try Chinese font first
        return ImageFont.truetype("msyh.ttc", size)
    except:
        try:
            return ImageFont.truetype("arial.ttf", size)
        except:
            return ImageFont.load_default()

font_title = load_font(90)     # Slightly larger for tablet
font_subtitle = load_font(50)

def create_gradient(width, height, c1, c2):
    base = Image.new('RGB', (width, height), c1)
    top = Image.new('RGB', (width, height), c2)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        row = [int(255 * (y / height))] * width
        mask_data.extend(row)
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def draw_phone_frame(draw, x, y, w, h, radius=40):
    # Simplified Frame
    # Outer Frame
    draw.rounded_rectangle([x-12, y-12, x+w+12, y+h+12], radius=radius+8, fill=(30, 30, 30))
    # Bezel
    draw.rounded_rectangle([x-4, y-4, x+w+4, y+h+4], radius=radius+2, fill=(60, 60, 60))
    # Screen bg
    draw.rounded_rectangle([x, y, x+w, y+h], radius=radius, fill=(0,0,0))
    
    # Dynamic Island
    island_w = w * 0.25
    island_h = 35
    island_x = x + (w - island_w) // 2
    island_y = y + 15
    draw.rounded_rectangle([island_x, island_y, island_x+island_w, island_y+island_h], radius=15, fill=(0,0,0))

def process_tablet_screenshot(info, index):
    filepath = os.path.join(folder, info["file"])
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    # 1. Canvas Setup (1920x1080 Landscape)
    final_w, final_h = 1920, 1080
    canvas = create_gradient(final_w, final_h, BG_TOP, BG_BOTTOM)
    draw = ImageDraw.Draw(canvas)

    # 2. Background Decor (Gold Rings - Offset to Right for balance)
    center_x, center_y = int(final_w * 0.7), final_h // 2
    draw.ellipse([center_x - 700, center_y - 700, center_x + 700, center_y + 700], outline=(255, 215, 0, 20), width=2)
    draw.ellipse([center_x - 500, center_y - 500, center_x + 500, center_y + 500], outline=(255, 215, 0, 40), width=4)

    # 3. Prepare Phone Mockup
    try:
        src = Image.open(filepath).convert("RGB")
    except:
        return

    # Scale logic
    # We want the phone to be ~90% of height
    target_phone_h = int(final_h * 0.85) # ~918px
    ratio = target_phone_h / src.height
    target_phone_w = int(src.width * ratio)
    
    src_resized = src.resize((target_phone_w, target_phone_h), Image.Resampling.LANCZOS)
    
    # Masking
    mask = Image.new("L", (target_phone_w, target_phone_h), 0)
    d_mask = ImageDraw.Draw(mask)
    d_mask.rounded_rectangle([0,0, target_phone_w, target_phone_h], radius=40, fill=255)
    
    rounded_scr = Image.new("RGBA", (target_phone_w, target_phone_h))
    rounded_scr.paste(src_resized, (0,0), mask=mask)

    # Position: Right side
    phone_x = int(final_w * 0.6)  # Start at 60% width
    phone_y = (final_h - target_phone_h) // 2

    # Shadow
    shadow_offset_x = 30
    shadow_offset_y = 30
    shadow = Image.new("RGBA", (final_w, final_h), (0,0,0,0))
    d_sh = ImageDraw.Draw(shadow)
    d_sh.rounded_rectangle([phone_x+shadow_offset_x, phone_y+shadow_offset_y, 
                            phone_x+target_phone_w+shadow_offset_x, phone_y+target_phone_h+shadow_offset_y], 
                           radius=40, fill=(0,0,0, 100))
    shadow = shadow.filter(ImageFilter.GaussianBlur(20))
    canvas.paste(shadow, (0,0), mask=shadow)

    # Bezel
    bezel_layer = Image.new("RGBA", (final_w, final_h), (0,0,0,0))
    d_bezel = ImageDraw.Draw(bezel_layer)
    draw_phone_frame(d_bezel, phone_x, phone_y, target_phone_w, target_phone_h, radius=40)
    canvas.paste(bezel_layer, (0,0), mask=bezel_layer)

    # Place Phone
    canvas.paste(rounded_scr, (phone_x, phone_y), mask=rounded_scr)

    # Gloss
    gloss = Image.new("RGBA", (target_phone_w, target_phone_h), (0,0,0,0))
    d_gloss = ImageDraw.Draw(gloss)
    d_gloss.chord([-100, -100, target_phone_w*2, target_phone_h//2], 0, 180, fill=(255,255,255,30))
    final_gloss = Image.new("RGBA", (target_phone_w, target_phone_h), (0,0,0,0))
    final_gloss.paste(gloss, (0,0), mask=mask)
    canvas.paste(final_gloss, (phone_x, phone_y), mask=final_gloss)

    # 4. Text (Left side)
    text_x = 120
    text_y_center = final_h // 2 - 50

    # Title
    draw.text((text_x, text_y_center - 100), info["title"], font=font_title, fill=TEXT_TITLE)
    
    # Decor Line
    draw.line([(text_x, text_y_center + 10), (text_x + 200, text_y_center + 10)], fill=ACCENT_GOLD, width=6)

    # Subtitle
    # Wrap text manually if needed or just let it run (it's short enough usually)
    draw.text((text_x, text_y_center + 40), info["subtitle"], font=font_subtitle, fill=TEXT_SUB)

    # 5. Save
    out_filename = f"tablet_10in_screenshot_{index+1}.png"
    out_path = os.path.join(output_folder, out_filename)
    canvas.save(out_path)
    print(f"Generated Tablet Screenshot: {out_path}")

def generate_combo_tablet_screenshot():
    print("Generating Tablet Combo Screenshot...")
    
    # helper for creating phone element
    def create_phone_element(filename, height_target):
        fp = os.path.join(folder, filename)
        if not os.path.exists(fp): return None
        try:
            src = Image.open(fp).convert("RGB")
        except: return None
        
        # Resize
        ratio = height_target / src.height
        width_target = int(src.width * ratio)
        src_resized = src.resize((width_target, height_target), Image.Resampling.LANCZOS)
        
        # Container (frame + screen)
        # Margin for frame
        margin = 15
        full_w = width_target + margin*2
        full_h = height_target + margin*2
        
        container = Image.new("RGBA", (full_w, full_h), (0,0,0,0))
        d_cont = ImageDraw.Draw(container)
        
        # Draw Frame
        d_cont.rounded_rectangle([0, 0, full_w, full_h], radius=50, fill=(20, 20, 20)) # Outer
        d_cont.rounded_rectangle([8, 8, full_w-8, full_h-8], radius=45, fill=(60, 60, 60)) # Body
        
        # Screen Mask
        mask = Image.new("L", (width_target, height_target), 0)
        dm = ImageDraw.Draw(mask)
        dm.rounded_rectangle([0, 0, width_target, height_target], radius=40, fill=255)
        
        # Paste Screen into container
        screen_layer = Image.new("RGBA", (width_target, height_target), (0,0,0,0))
        screen_layer.paste(src_resized, (0,0), mask=mask)
        container.paste(screen_layer, (margin, margin), mask=screen_layer)
        
        # Dynamic Island
        d_cont.rounded_rectangle([full_w//2 - 50, margin+10, full_w//2 + 50, margin+35], radius=20, fill=(0,0,0))

        return container

    final_w, final_h = 1920, 1080
    canvas = create_gradient(final_w, final_h, BG_TOP, BG_BOTTOM)
    draw = ImageDraw.Draw(canvas)
    
    # Background Rings - Center Right
    cx, cy = int(final_w * 0.75), final_h // 2
    draw.ellipse([cx - 800, cy - 800, cx + 800, cy + 800], outline=(255, 215, 0, 15), width=2)
    draw.ellipse([cx - 600, cy - 600, cx + 600, cy + 600], outline=(255, 215, 0, 30), width=4)

    # Text Left Side
    title = "六合彩號碼 + 八字分析"
    subtitle = "獨家結合 · 提升中獎機率"
    
    text_x = 100
    text_y = final_h // 2 - 50
    
    # Break Title if too long
    # "六合彩號碼" line 1
    # "+ 八字分析" line 2
    draw.text((text_x, text_y - 120), "六合彩號碼", font=font_title, fill=TEXT_TITLE)
    draw.text((text_x, text_y - 20), "+ 八字分析", font=font_title, fill=TEXT_TITLE)
    
    draw.line([(text_x, text_y + 100), (text_x + 150, text_y + 100)], fill=ACCENT_GOLD, width=6)
    draw.text((text_x, text_y + 130), subtitle, font=font_subtitle, fill=TEXT_SUB)

    # 3 Phones on Right
    # Center (ssa)
    h_main = 800
    h_side = 700
    
    p_center = create_phone_element("ssa.jpeg", h_main)
    p_left = create_phone_element("ssb.jpeg", h_side)
    p_right = create_phone_element("ssc.jpeg", h_side)
    
    # Positioning
    # Anchor center phone at roughly 75% width
    cx_phone = int(final_w * 0.70)
    cy_phone = final_h // 2 - 50
    
    # Left Phone (Rotated +15) -> Behind Center
    # Position to the left of center
    pl_rot = p_left.rotate(15, expand=True, resample=Image.Resampling.BICUBIC)
    canvas.paste(pl_rot, (cx_phone - 350 - pl_rot.width//2, cy_phone - pl_rot.height//2 + 50), mask=pl_rot)

    # Right Phone (Rotated -15) -> Behind Center
    pr_rot = p_right.rotate(-15, expand=True, resample=Image.Resampling.BICUBIC)
    canvas.paste(pr_rot, (cx_phone + 350 - pr_rot.width//2, cy_phone - pr_rot.height//2 + 50), mask=pr_rot)
    
    # Center Phone -> In Front
    # Shadow
    shad = Image.new("RGBA", (p_center.width + 80, p_center.height + 80), (0,0,0,0))
    ds = ImageDraw.Draw(shad)
    ds.ellipse([20, p_center.height-20, p_center.width+60, p_center.height+60], fill=(0,0,0, 180))
    shad = shad.filter(ImageFilter.GaussianBlur(30))
    canvas.paste(shad, (cx_phone - p_center.width//2 - 40, cy_phone - p_center.height//2 + 20), mask=shad)

    canvas.paste(p_center, (cx_phone - p_center.width//2, cy_phone - p_center.height//2), mask=p_center)

    out_path = os.path.join(output_folder, "tablet_10in_screenshot_4.png")
    canvas.save(out_path)
    print(f"Generated Tablet Combo Screenshot: {out_path}")

if __name__ == "__main__":
    print("Generating 10-inch Tablet Screenshots...")
    for i, item in enumerate(texts):
        # Only process first 3 individual shots
        if i < 3:
            process_tablet_screenshot(item, i)
    
    # Generate the 4th combo shot
    generate_combo_tablet_screenshot()
