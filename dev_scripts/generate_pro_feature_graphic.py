from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

# Configuration
OUTPUT_DIR = r"C:\Users\cursor\Documents\GitHub Copilot\bazi_app\store_assets"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "pro_feature_graphic.png")

# Colors
BG_TOP = (100, 10, 20)      # Deep Red
BG_BOTTOM = (0, 0, 0)       # Black
ACCENT_GOLD = (255, 215, 0) # Gold
TEXT_COLOR = (255, 255, 255) # White

def create_gradient(width, height, top_color, bottom_color):
    base = Image.new('RGB', (width, height), top_color)
    top = Image.new('RGB', (width, height), top_color)
    bottom = Image.new('RGB', (width, height), bottom_color)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        for x in range(width):
            mask_data.append(int(255 * (y / height)))
    mask.putdata(mask_data)
    base.paste(bottom, (0, 0), mask)
    return base

def draw_rings(draw, width, height):
    # Pro Bazi Compass (Luopan) Background
    cx, cy = width // 2, height // 2
    
    # Text Data for Compass Rings
    tian_gan = list("甲乙丙丁戊己庚辛壬癸")
    di_zhi = list("子丑寅卯辰巳午未申酉戌亥")
    trigrams = list("乾坎艮震巽離坤兌")
    
    # Helper for font
    font_paths = [r"C:\Windows\Fonts\msyh.ttc", r"C:\Windows\Fonts\simhei.ttf", r"C:\Windows\Fonts\arial.ttf"]
    font_path = font_paths[-1]
    for p in font_paths:
        if os.path.exists(p):
            font_path = p
            break
            
    def get_bg_font(size):
        try:
            return ImageFont.truetype(font_path, size)
        except:
            return ImageFont.load_default()

    # Draw Concentric Golden Rings
    for r in [180, 220, 260, 320, 400, 500]:
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(255, 215, 0, 40), width=1)

    # Helper to draw text in a ring
    def draw_ring_text(radius, chars, size=16, color=(255, 215, 0, 50)):
        f_ring = get_bg_font(size)
        count = len(chars)
        step = 360 / count
        for i, char in enumerate(chars):
            angle = i * step - 90
            rad = math.radians(angle)
            x = cx + radius * math.cos(rad)
            y = cy + radius * math.sin(rad)
            # Draw rotated text for "Pro" feel
            # To scale, we render small image then paste? No, too slow. Just draw upright for background texture.
            draw.text((x, y), char, font=f_ring, fill=color, anchor="mm")

    # Draw Layers of Destiny
    draw_ring_text(200, trigrams * 3, 20)      # Trigrams
    draw_ring_text(240, tian_gan * 4, 18)      # Heavenly Stems
    draw_ring_text(290, di_zhi * 5, 18)        # Earthly Branches
    
    # Crosshairs (Luopan Thread)
    draw.line([cx, 0, cx, height], fill=(220, 20, 60, 80), width=2)
    draw.line([0, cy, width, cy], fill=(220, 20, 60, 80), width=2)

def generate_pro_feature_graphic():
    width = 1024
    height = 500
    
    # 1. Create Base Background with Gradient
    bg = create_gradient(width, height, BG_TOP, BG_BOTTOM)
    bg = bg.convert("RGBA")
    
    # 2. Draw Background Rings
    overlay = Image.new('RGBA', (width, height), (0,0,0,0))
    d_overlay = ImageDraw.Draw(overlay)
    draw_rings(d_overlay, width, height)
    
    # Composite Rings onto BG
    img = Image.alpha_composite(bg, overlay)
    
    # 3. Draw Text directly onto 'img'
    draw = ImageDraw.Draw(img)
    
    # Fonts
    # Try to load a Chinese compatible font using absolute paths for Windows
    def get_chinese_font(size):
        font_paths = [
            r"C:\Windows\Fonts\kaiu.ttf",   # DFKai-SB (Traditional Chinese Brush)
            r"C:\Windows\Fonts\msyh.ttc",   # Microsoft YaHei
            r"C:\Windows\Fonts\msyh.ttf",
            r"C:\Windows\Fonts\simhei.ttf",
            r"C:\Windows\Fonts\arial.ttf",
        ]
        
        for path in font_paths:
            if os.path.exists(path):
                try:
                    return ImageFont.truetype(path, size)
                except Exception as e:
                    pass
        return ImageFont.load_default()

    font_large = get_chinese_font(90)
    font_small = get_chinese_font(40)

    # Draw Title: "六合彩智能分析"
    # User requested "Chinese feeling" for AI part, replacing "AI" with "智能" (Smart/Intelligent)
    title_text = "六合彩智能分析"
    sub1_text = "八字命理版"
    sub2_text = "Mark Six Bazi Analysis"

    def draw_centered_text(text, font, y_offset, color):
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        x = (width - text_w) // 2
        y = (height - text_h) // 2 + y_offset
        # Shadow
        draw.text((x+2, y+2), text, font=font, fill=(0,0,0, 100))
        # Text
        draw.text((x, y), text, font=font, fill=color)

    # Draw Curves
    draw.arc([-100, 100, 600, 800], 0, 90, fill=(139, 69, 19, 100), width=3)
    draw.arc([300, -200, 1200, 600], 90, 220, fill=(160, 82, 45, 120), width=2)
    draw.arc([100, 300, 900, 900], 180, 300, fill=(205, 133, 63, 80), width=3)

    draw_centered_text(title_text, font_large, -60, (255, 223, 0)) # Gold
    draw_centered_text(sub1_text, font_small, 30, (255, 255, 255)) # White
    
    try:
        font_eng = get_chinese_font(30)
    except:
        font_eng = font_small
    draw_centered_text(sub2_text, font_eng, 80, (255, 165, 0)) # Orange

    # 4. Draw Balls on a separate "Balls Layer"
    # This prevents referencing issues with 'img'
    balls_layer = Image.new('RGBA', (width, height), (0,0,0,0))
    # We will draw ball components onto temp images and paste onto balls_layer
    
    def render_ball_onto_layer(layer, x, y, radius, color, number_str):
        ball_diam = radius * 2
        
        # --- A. Shadow ---
        shadow_w = int(radius * 1.8)
        shadow_h = int(radius * 0.6)
        # Draw shadow directly on layer? No, create temp to blur
        shad = Image.new('RGBA', (shadow_w + 40, shadow_h + 40), (0,0,0,0))
        s_d = ImageDraw.Draw(shad)
        s_d.ellipse([20, 20, 20+shadow_w, 20+shadow_h], fill=(0,0,0, 120))
        shad = shad.filter(ImageFilter.GaussianBlur(15))
        
        # Paste shadow centered at bottom of ball
        sx = x - (shad.width // 2) + 10
        sy = y + radius - (shad.height // 2) + 5
        layer.paste(shad, (int(sx), int(sy)), mask=shad)
        
        # --- B. Ball Body ---
        ball_img = Image.new('RGBA', (ball_diam, ball_diam), (0,0,0,0))
        b_draw = ImageDraw.Draw(ball_img)
        
        # 1. Base Color
        b_draw.ellipse([0,0, ball_diam, ball_diam], fill=color)
        
        # 2. Patches (The white spots)
        patch_size = int(radius * 1.3)
        
        def create_patch(p_text, p_w, p_h):
            p = Image.new('RGBA', (p_w, p_h), (0,0,0,0))
            pd = ImageDraw.Draw(p)
            pd.ellipse([0,0, p_w, p_h], fill=(245, 245, 245)) # Slightly off-white
            
            # Text
            try:
                # Bold Arial usually available
                # If not, try others
                font_name = "arialbd.ttf"
                f = ImageFont.truetype(font_name, int(min(p_w, p_h)*0.6))
            except:
                f = ImageFont.load_default()
            
            bbox = pd.textbbox((0,0), p_text, font=f)
            tw = bbox[2]-bbox[0]
            th = bbox[3]-bbox[1]
            pd.text(((p_w-tw)//2, (p_h-th)//2 - int(p_h*0.1)), p_text, font=f, fill=(0,0,0))
            return p

        # Main Front Patch
        p_main = create_patch(number_str, patch_size, patch_size)
        cx = (ball_diam - patch_size) // 2
        cy = (ball_diam - patch_size) // 2
        ball_img.paste(p_main, (cx, cy), mask=p_main)
        
        # Side Patches (Simulate perspective with flattened/rotated ellipses)
        # Top Left
        p_side = create_patch(number_str, patch_size, int(patch_size * 0.6))
        p_side = p_side.rotate(45, expand=True, resample=Image.Resampling.BICUBIC)
        ball_img.paste(p_side, (-10, -10), mask=p_side)
        
        # Bottom Right
        p_side2 = create_patch(number_str, patch_size, int(patch_size * 0.6))
        p_side2 = p_side2.rotate(45, expand=True, resample=Image.Resampling.BICUBIC)
        ball_img.paste(p_side2, (ball_diam - int(radius), ball_diam - int(radius)), mask=p_side2)

        # Top Right
        p_side3 = create_patch(number_str, patch_size, int(patch_size * 0.6))
        p_side3 = p_side3.rotate(-45, expand=True, resample=Image.Resampling.BICUBIC)
        ball_img.paste(p_side3, (ball_diam - int(radius*0.8), -10), mask=p_side3)

        # --- C. Masking to Sphere Shape ---
        mask = Image.new('L', (ball_diam, ball_diam), 0)
        md = ImageDraw.Draw(mask)
        md.ellipse([0,0, ball_diam, ball_diam], fill=255)
        
        clean_ball = Image.new('RGBA', (ball_diam, ball_diam), (0,0,0,0))
        clean_ball.paste(ball_img, (0,0), mask=mask)
        
        # --- D. Shading Overlay ---
        # Inner shadow
        shade = Image.new('RGBA', (ball_diam, ball_diam), (0,0,0,0))
        sd = ImageDraw.Draw(shade)
        # Dark gradient bottom right
        sd.ellipse([int(radius*0.6), int(radius*0.6), int(ball_diam*1.2), int(ball_diam*1.2)], fill=(0,0,0,90))
        shade = shade.filter(ImageFilter.GaussianBlur(10))
        clean_ball.paste(shade, (0,0), mask=mask)
        
        # --- E. Highlight Overlay ---
        glint = Image.new('RGBA', (ball_diam, ball_diam), (0,0,0,0))
        gd = ImageDraw.Draw(glint)
        # Soft top left
        gd.ellipse([int(radius*0.2), int(radius*0.2), int(radius*1.2), int(radius*1.2)], fill=(255,255,255,80))
        glint = glint.filter(ImageFilter.GaussianBlur(8))
        # Hard white spot
        gd.ellipse([int(radius*0.35), int(radius*0.4), int(radius*0.7), int(radius*0.65)], fill=(255,255,255,220))
        clean_ball.paste(glint, (0,0), mask=mask)
        
        # Paste onto layer
        layer.paste(clean_ball, (int(x-radius), int(y-radius)), mask=clean_ball)

    # Render Balls
    # Left: 28 (Green)
    render_ball_onto_layer(balls_layer, 160, 320, 65, (50, 180, 70), "28")
    
    # Bottom Right: 18 (Red)
    render_ball_onto_layer(balls_layer, 900, 380, 55, (220, 40, 50), "18")
    
    # Top Right: 38 (Green)
    render_ball_onto_layer(balls_layer, 850, 140, 45, (50, 180, 70), "38")
    
    # 5. Composite Balls Layer onto Background
    final_img = Image.alpha_composite(img, balls_layer)
    
    # Save
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    final_img.save(OUTPUT_FILE)
    print(f"Generated Pro Feature Graphic: {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_pro_feature_graphic()
