from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math
import os

# Configuration
WIDTH = 1024
HEIGHT = 1024
CENTER = (WIDTH // 2, HEIGHT // 2)

# Colors - Based on detailed specification
CRIMSON_RED = (178, 34, 52)  # Outer background
METALLIC_GOLD = (218, 165, 32)  # Main gold ring
BRIGHT_GOLD = (255, 223, 100)  # Highlights
DARK_BURGUNDY_EDGE = (80, 30, 30)  # Inner gradient edge
DARK_CENTER = (20, 10, 10)  # Center behind character
SHADOW_GOLD = (100, 70, 20)  # Shadow accents

def create_gradient_background(width, height):
    # Outer crimson background with inner radial gradient
    base = Image.new('RGB', (width, height), CRIMSON_RED)
    draw = ImageDraw.Draw(base)
    
    # Inside the gold ring area, create gradient from burgundy to black
    center_x, center_y = width // 2, height // 2
    inner_radius = 400  # Inside the thick gold ring
    
    # Draw radial gradient: burgundy edge -> black center
    for r in range(inner_radius, 0, -1):
        ratio = r / inner_radius
        ratio = ratio ** 0.8  # Smooth transition
        
        red = int(DARK_BURGUNDY_EDGE[0] * ratio + DARK_CENTER[0] * (1-ratio))
        green = int(DARK_BURGUNDY_EDGE[1] * ratio + DARK_CENTER[1] * (1-ratio))
        blue = int(DARK_BURGUNDY_EDGE[2] * ratio + DARK_CENTER[2] * (1-ratio))
        
        draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r], fill=(red, green, blue))
    
    return base

def draw_radar_ticks(draw, center, radius, count, length, width, color):
    """Draw tick marks around a circle like clock markers"""
    cx, cy = center
    for i in range(count):
        angle = math.radians(i * (360 / count) - 90)  # Start from top
        # Inner point
        x1 = cx + math.cos(angle) * (radius - length)
        y1 = cy + math.sin(angle) * (radius - length)
        # Outer point
        x2 = cx + math.cos(angle) * radius
        y2 = cy + math.sin(angle) * radius
        
        draw.line([(x1, y1), (x2, y2)], fill=color, width=width)

def draw_small_squares(draw, center, radius, count, size, color):
    """Draw small square markers scattered around circles"""
    cx, cy = center
    for i in range(count):
        angle = math.radians(i * (360 / count) - 90)
        x = cx + math.cos(angle) * radius
        y = cy + math.sin(angle) * radius
        
        half = size // 2
        draw.rectangle([x - half, y - half, x + half, y + half], fill=color)

def generate_icon(output_path):
    print(f"Generating icon at {output_path}...")
    img = create_gradient_background(WIDTH, HEIGHT)
    draw = ImageDraw.Draw(img)
    
    # === 1. THICK OUTER GOLD RING (60-80px wide) ===
    outer_r = 480  # Outer edge
    ring_thickness = 70  # 60-80px range
    inner_r = outer_r - ring_thickness  # 410
    
    # Draw the solid gold band
    draw.ellipse(
        [CENTER[0] - outer_r, CENTER[1] - outer_r, CENTER[0] + outer_r, CENTER[1] + outer_r],
        fill=METALLIC_GOLD
    )
    # Cut out the center hole
    draw.ellipse(
        [CENTER[0] - inner_r, CENTER[1] - inner_r, CENTER[0] + inner_r, CENTER[1] + inner_r],
        fill=DARK_BURGUNDY_EDGE  # Will be covered by gradient but sets the edge
    )
    
    # Redraw inner gradient after cutting hole
    for r in range(inner_r, 0, -1):
        ratio = r / inner_r
        ratio = ratio ** 0.8
        red = int(DARK_BURGUNDY_EDGE[0] * ratio + DARK_CENTER[0] * (1-ratio))
        green = int(DARK_BURGUNDY_EDGE[1] * ratio + DARK_CENTER[1] * (1-ratio))
        blue = int(DARK_BURGUNDY_EDGE[2] * ratio + DARK_CENTER[2] * (1-ratio))
        draw.ellipse([CENTER[0] - r, CENTER[1] - r, CENTER[0] + r, CENTER[1] + r], fill=(red, green, blue))
    
    # Add bright yellow highlight lines on outer and inner edges
    draw.ellipse(
        [CENTER[0] - outer_r, CENTER[1] - outer_r, CENTER[0] + outer_r, CENTER[1] + outer_r],
        outline=BRIGHT_GOLD, width=5
    )
    draw.ellipse(
        [CENTER[0] - inner_r, CENTER[1] - inner_r, CENTER[0] + inner_r, CENTER[1] + inner_r],
        outline=BRIGHT_GOLD, width=5
    )
    
    # === 2. THIN BRIGHT SEPARATOR RING ===
    # Just inside the thick gold ring
    separator_r = inner_r - 8
    draw.ellipse(
        [CENTER[0] - separator_r, CENTER[1] - separator_r, CENTER[0] + separator_r, CENTER[1] + separator_r],
        outline=BRIGHT_GOLD, width=3
    )
    
    # === 3. CONCENTRIC TECHNICAL CIRCLES (3-4 circles) ===
    tech_circles = [385, 330, 275, 220]  # 4 circles at different radii
    for circle_r in tech_circles:
        draw.ellipse(
            [CENTER[0] - circle_r, CENTER[1] - circle_r, CENTER[0] + circle_r, CENTER[1] + circle_r],
            outline=SHADOW_GOLD, width=2
        )
    
    # === 4. TICK MARKS (Clock/Compass style) ===
    # 60 small minute markers
    draw_radar_ticks(draw, CENTER, 395, 60, 10, 2, SHADOW_GOLD)
    # 12 large hour markers
    draw_radar_ticks(draw, CENTER, 395, 12, 20, 5, BRIGHT_GOLD)
    
    # === 5. SMALL SQUARE MARKERS ===
    # Scattered around the circles
    draw_small_squares(draw, CENTER, 350, 24, 4, SHADOW_GOLD)
    draw_small_squares(draw, CENTER, 295, 16, 3, (60, 40, 10))
    
    # === 6. CENTER CHARACTER "六" WITH 3D EFFECT ===
    font_size = 420
    font = None
    
    # Load Chinese font
    font_candidates = [
        "msjhbd.ttc",  # Microsoft JhengHei Bold
        "msyhbd.ttc",  # Microsoft YaHei Bold
        "msjh.ttc",
        "simhei.ttf",
    ]
    
    font_folder = os.path.join(os.environ.get('WINDIR', 'C:\\Windows'), 'Fonts')
    
    for fname in font_candidates:
        fpath = os.path.join(font_folder, fname)
        if os.path.exists(fpath):
            try:
                font = ImageFont.truetype(fpath, font_size)
                print(f"Loaded font: {fname}")
                break
            except Exception as e:
                continue
    
    if not font:
        try:
            font = ImageFont.truetype("arial.ttf", 480)
        except:
            font = ImageFont.load_default()
    
    text = "六"
    
    # 3D Effect: Multiple shadow layers
    # Dark shadow (bottom-right)
    shadow_offset = 8
    draw.text(
        (CENTER[0] + shadow_offset, CENTER[1] + shadow_offset), 
        text, font=font, fill=SHADOW_GOLD, anchor="mm"
    )
    
    # Medium shadow
    draw.text(
        (CENTER[0] + shadow_offset//2, CENTER[1] + shadow_offset//2), 
        text, font=font, fill=(140, 100, 30), anchor="mm"
    )
    
    # Main character - metallic gold
    draw.text(CENTER, text, font=font, fill=METALLIC_GOLD, anchor="mm")
    
    # Bright highlight (top-left to simulate light)
    highlight_offset = 3
    draw.text(
        (CENTER[0] - highlight_offset, CENTER[1] - highlight_offset), 
        text, font=font, fill=BRIGHT_GOLD, anchor="mm"
    )

    # Save
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else ".", exist_ok=True)
    img.save(output_path)
    print(f"Saved {output_path}")

if __name__ == "__main__":
    generate_icon("assets/icon.png")
    generate_icon("assets/adaptive-icon.png")
    generate_icon("assets/splash-icon.png")
