import os
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Canvas Size (Higher resolution for better quality)
WIDTH = 2048
HEIGHT = 4096
CENTER_X = WIDTH // 2
CENTER_Y = HEIGHT // 2

# Colors - Netflix/Disney+ Minimalist Palette
RED_DEEP = (36, 6, 14)         # Deep plum-red
RED_VIBRANT = (176, 24, 56)    # Rich crimson highlight
GOLD_METALLIC = (212, 175, 55)

def create_gradient(width, height):
    # Simple vertical gradient
    base = Image.new('RGB', (width, height), RED_DEEP)
    
    # Create a subtle radial gradient for depth
    radial = Image.new('L', (width, height))
    pixel_data = []
    max_dist = (width / 2) ** 2 + (height / 2) ** 2
    max_dist = max_dist ** 0.5

    for y in range(height):
        for x in range(width):
            dx = x - width // 2
            dy = y - height // 2
            dist = (dx * dx + dy * dy) ** 0.5
            norm = dist / max_dist
            val = int(255 * (1 - norm * 0.5))  # Very subtle
            val = max(0, min(255, val))
            pixel_data.append(val)

    radial.putdata(pixel_data)

    light_layer = Image.new('RGB', (width, height), RED_VIBRANT)
    base.paste(light_layer, (0, 0), radial)
    return base

def create_circular_icon_with_border(icon_path, total_size):
    if not os.path.exists(icon_path):
        return None
        
    # Load Icon
    icon = Image.open(icon_path).convert("RGBA")
    
    border_width = 20
    icon_inner_size = total_size - (border_width * 2)
    
    # 1. Resize/Crop Icon to Square
    w, h = icon.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    icon = icon.crop((left, top, left + min_dim, top + min_dim))
    icon = icon.resize((icon_inner_size, icon_inner_size), Image.Resampling.LANCZOS)
    
    # 2. Create Circular Mask for Icon
    mask = Image.new('L', (icon_inner_size, icon_inner_size), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.ellipse((0, 0, icon_inner_size, icon_inner_size), fill=255)
    
    # 3. Create Container
    container = Image.new('RGBA', (total_size, total_size), (0,0,0,0))
    draw_container = ImageDraw.Draw(container)
    
    # 4. Draw Gold Border Circle
    draw_container.ellipse([0, 0, total_size, total_size], fill=GOLD_METALLIC)
    
    # 5. Composite Icon onto Center
    icon_layer = Image.new('RGBA', (icon_inner_size, icon_inner_size), (0,0,0,0))
    icon_layer.paste(icon, (0,0), mask)
    
    container.paste(icon_layer, (border_width, border_width), icon_layer)
    return container

def main():
    print("Generating Netflix/Disney+ style Splash Screen...")
    
    # 1. Pure gradient background (Netflix/Disney+ style - minimal)
    img = create_gradient(WIDTH, HEIGHT)
    draw = ImageDraw.Draw(img)

    # 2. NO decorative elements - pure minimalism
    
    # 3. Main Icon (Round, centered, large) - Higher resolution
    icon_size = 600
    icon_path = 'store_assets/pro_icon.png' 
    if not os.path.exists(icon_path):
        icon_path = 'assets/icon.png'
        
    icon_comp = create_circular_icon_with_border(icon_path, icon_size)
    
    if icon_comp:
        # Perfect center
        pos_x = CENTER_X - (icon_size // 2)
        pos_y = CENTER_Y - (icon_size // 2)
        
        # Subtle glow behind icon (Netflix style)
        glow = Image.new('RGBA', (WIDTH, HEIGHT), (0,0,0,0))
        d_glow = ImageDraw.Draw(glow)
        glow_size = icon_size + 80
        glow_x = CENTER_X - (glow_size // 2)
        glow_y = CENTER_Y - (glow_size // 2)
        
        # Multiple layers for soft glow
        for i in range(3):
            alpha = 15 - (i * 4)
            offset = i * 30
            d_glow.ellipse([
                glow_x - offset, 
                glow_y - offset, 
                glow_x + glow_size + offset, 
                glow_y + glow_size + offset
            ], fill=(*GOLD_METALLIC, alpha))
        
        glow = glow.filter(ImageFilter.GaussianBlur(radius=40))
        img.paste(glow, (0,0), glow)
        
        # Paste Icon
        img.paste(icon_comp, (pos_x, pos_y), icon_comp)

    # 4. NO TEXT - pure branding like Netflix/Disney+

    # Save
    if not os.path.exists('assets'):
        os.makedirs('assets')
        
    output_path = 'assets/splash.png'
    img.save(output_path)
    print(f"Saved Netflix/Disney+ style splash to {output_path}")

if __name__ == "__main__":
    main()
