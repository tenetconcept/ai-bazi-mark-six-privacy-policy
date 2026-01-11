from PIL import Image, ImageDraw, ImageFont
import math
import os

# Configuration
WIDTH = 512
HEIGHT = 512
CENTER = (WIDTH // 2, HEIGHT // 2)

# Colors matching the App Icon
METALLIC_GOLD = (218, 165, 32)
BRIGHT_GOLD = (255, 223, 100)
DARK_BURGUNDY = (60, 25, 25)
DARK_CENTER = (30, 15, 15)
SHADOW_GOLD = (100, 70, 20)

def draw_radar_ticks(draw, center, radius, count, length, width, color):
    """Draw tick marks around a circle"""
    cx, cy = center
    for i in range(count):
        angle = math.radians(i * (360 / count) - 90)
        x1 = cx + math.cos(angle) * (radius - length)
        y1 = cy + math.sin(angle) * (radius - length)
        x2 = cx + math.cos(angle) * radius
        y2 = cy + math.sin(angle) * radius
        draw.line([(x1, y1), (x2, y2)], fill=color, width=width)

def draw_small_squares(draw, center, radius, count, size, color):
    """Draw small square markers"""
    cx, cy = center
    for i in range(count):
        angle = math.radians(i * (360 / count) - 90)
        x = cx + math.cos(angle) * radius
        y = cy + math.sin(angle) * radius
        half = size // 2
        draw.rectangle([x - half, y - half, x + half, y + half], fill=color)

def generate_outer_ring():
    """Generate the static outer gold ring layer - TRANSPARENT PNG"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Reduced outer radius and ring thickness
    outer_r = 230
    ring_thickness = 22  # Thinner ring
    inner_r = outer_r - ring_thickness
    
    # Draw solid gold band
    draw.ellipse(
        [CENTER[0] - outer_r, CENTER[1] - outer_r, CENTER[0] + outer_r, CENTER[1] + outer_r],
        fill=METALLIC_GOLD
    )
    # Cut out the center (transparent)
    draw.ellipse(
        [CENTER[0] - inner_r, CENTER[1] - inner_r, CENTER[0] + inner_r, CENTER[1] + inner_r],
        fill=(0, 0, 0, 0)
    )
    
    # Add highlights
    draw.ellipse(
        [CENTER[0] - outer_r, CENTER[1] - outer_r, CENTER[0] + outer_r, CENTER[1] + outer_r],
        outline=BRIGHT_GOLD, width=2
    )
    draw.ellipse(
        [CENTER[0] - inner_r, CENTER[1] - inner_r, CENTER[0] + inner_r, CENTER[1] + inner_r],
        outline=BRIGHT_GOLD, width=2
    )
    
    img.save("assets/intro_outer_ring.png")
    print("Saved assets/intro_outer_ring.png")

def generate_inner_disc():
    """Generate the rotating inner disc with radar elements - TRANSPARENT PNG"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Inner disc radius - closer to outer ring
    inner_r = 205
    
    # Draw dark burgundy background circle
    for r in range(inner_r, 0, -1):
        ratio = r / inner_r
        ratio = ratio ** 0.8
        red = int(DARK_BURGUNDY[0] * ratio + DARK_CENTER[0] * (1-ratio))
        green = int(DARK_BURGUNDY[1] * ratio + DARK_CENTER[1] * (1-ratio))
        blue = int(DARK_BURGUNDY[2] * ratio + DARK_CENTER[2] * (1-ratio))
        draw.ellipse([CENTER[0] - r, CENTER[1] - r, CENTER[0] + r, CENTER[1] + r], fill=(red, green, blue, 255))
    
    # Separator ring
    draw.ellipse(
        [CENTER[0] - 198, CENTER[1] - 198, CENTER[0] + 198, CENTER[1] + 198],
        outline=BRIGHT_GOLD, width=2
    )
    
    # Concentric circles (radar style)
    draw.ellipse(
        [CENTER[0] - 175, CENTER[1] - 175, CENTER[0] + 175, CENTER[1] + 175],
        outline=SHADOW_GOLD, width=1
    )
    draw.ellipse(
        [CENTER[0] - 140, CENTER[1] - 140, CENTER[0] + 140, CENTER[1] + 140],
        outline=(80, 55, 15, 200), width=1
    )
    draw.ellipse(
        [CENTER[0] - 100, CENTER[1] - 100, CENTER[0] + 100, CENTER[1] + 100],
        outline=(70, 50, 15, 150), width=1
    )
    
    # Tick marks
    draw_radar_ticks(draw, CENTER, 192, 60, 8, 1, SHADOW_GOLD)  # Minutes
    draw_radar_ticks(draw, CENTER, 192, 12, 15, 3, BRIGHT_GOLD)  # Hours
    
    # Small squares
    draw_small_squares(draw, CENTER, 160, 24, 3, SHADOW_GOLD)
    draw_small_squares(draw, CENTER, 120, 8, 4, (60, 40, 10, 200))
    
    img.save("assets/intro_inner_disc.png")
    print("Saved assets/intro_inner_disc.png")

def generate_character():
    """Generate the static '六' character layer - TRANSPARENT PNG"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    font_size = 200
    font = None
    
    # Try to find the same font used in the app icon
    # The app icon uses a rounder, more stylized font
    font_candidates = [
        "STXINGKA.TTF",   # 华文行楷 - Calligraphic style
        "STKAITI.TTF",    # 华文楷体 - Kai style
        "kaiti.ttf",      # KaiTi
        "simkai.ttf",     # SimKai
        "DFKai-SB.ttf",   # DFKai
        "msjhbd.ttc",     # Microsoft JhengHei Bold
        "msyhbd.ttc",     # Microsoft YaHei Bold
    ]
    
    font_folder = os.path.join(os.environ.get('WINDIR', 'C:\\Windows'), 'Fonts')
    
    for fname in font_candidates:
        fpath = os.path.join(font_folder, fname)
        if os.path.exists(fpath):
            try:
                font = ImageFont.truetype(fpath, font_size)
                print(f"Loaded font: {fname}")
                break
            except:
                continue
    
    if not font:
        # Fallback
        for fname in ["msjhbd.ttc", "simhei.ttf"]:
            fpath = os.path.join(font_folder, fname)
            if os.path.exists(fpath):
                try:
                    font = ImageFont.truetype(fpath, font_size)
                    print(f"Fallback font: {fname}")
                    break
                except:
                    continue
    
    if not font:
        font = ImageFont.load_default()
    
    text = "六"
    
    # Shadow
    draw.text((CENTER[0]+4, CENTER[1]+4), text, font=font, fill=(0, 0, 0, 200), anchor="mm")
    # Main character
    draw.text(CENTER, text, font=font, fill=BRIGHT_GOLD + (255,), anchor="mm")
    
    img.save("assets/intro_character.png")
    print("Saved assets/intro_character.png")

if __name__ == "__main__":
    generate_outer_ring()
    generate_inner_disc()
    generate_character()
    print("\nAll intro layers generated!")
