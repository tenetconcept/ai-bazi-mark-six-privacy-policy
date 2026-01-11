from PIL import Image, ImageFilter, ImageEnhance

def make_center_transparent(img, tolerance=30):
    # Check center pixel
    width, height = img.size
    center = (width // 2, height // 2)
    
    # If center already transparent, skip
    if img.getpixel(center)[3] == 0:
        return img
        
    print("  Removing opaque center...")
    target_color = img.getpixel(center)
    target_r, target_g, target_b, target_a = target_color
    
    pixels = img.load()
    queue = [center]
    visited = set(queue)
    dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    count = 0
    while queue:
        x, y = queue.pop(0)
        pixels[x, y] = (0, 0, 0, 0)
        count += 1
        
        for dx, dy in dirs:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                r, g, b, a = pixels[nx, ny]
                if (abs(r - target_r) <= tolerance and
                    abs(g - target_g) <= tolerance and
                    abs(b - target_b) <= tolerance):
                    visited.add((nx, ny))
                    queue.append((nx, ny))
                    
    return img

def enhance_layer(path, target_size=(1024, 1024)):
    print(f"Processing {path}...")
    try:
        img = Image.open(path).convert("RGBA")
        
        # 1. Opacity check (specifically for layer_b, but harmless for others if center is empty)
        # However, layer_a might have a center? Layer A is "Background/Outer Ring". 
        # Usually Layer A is full background. We should only clear center for Layer B ideally.
        if "layer_b" in path:
            img = make_center_transparent(img)

        # 2. Super-sampling for smoothness
        # Upscale 2x larger than target
        work_size = (target_size[0] * 2, target_size[1] * 2)
        img = img.resize(work_size, Image.Resampling.LANCZOS)
        
        # 3. Smooth Edges (Blur alpha)
        r, g, b, a = img.split()
        # Radius 2 at 2048px is soft but not too blurry
        a = a.filter(ImageFilter.GaussianBlur(radius=2))
        img = Image.merge("RGBA", (r, g, b, a))
        
        # 4. Sharpen Details? 
        # Sometimes upscaling blurs texture. Applying slight sharpen.
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(1.2)
        
        # 5. Downscale to target high-res
        img = img.resize(target_size, Image.Resampling.LANCZOS)
        
        img.save(path)
        print(f"  Saved enhanced {path} ({target_size})")
        return img
        
    except Exception as e:
        print(f"  Error: {e}")
        return None

def merge_icons():
    print("\nMerging for App Icon...")
    base_size = (1024, 1024)
    canvas = Image.new("RGBA", base_size)
    
    # Load processed images directly
    try:
        img_a = Image.open('assets/layer_image/layer_a.png').convert('RGBA').resize(base_size, Image.Resampling.LANCZOS)
        img_b = Image.open('assets/layer_image/layer_b.png').convert('RGBA').resize(base_size, Image.Resampling.LANCZOS)
        img_c = Image.open('assets/layer_image/layer_c.png').convert('RGBA').resize(base_size, Image.Resampling.LANCZOS)
        
        canvas.alpha_composite(img_a)
        canvas.alpha_composite(img_b)
        canvas.alpha_composite(img_c)
        
        canvas.save('assets/icon.png')
        canvas.save('assets/adaptive-icon.png')
        print("  Generated assets/icon.png & assets/adaptive-icon.png")
        
    except Exception as e:
        print(f"  Merge Error: {e}")

if __name__ == "__main__":
    # Enhanced target size: 1024x1024 for all layers
    enhance_layer('assets/layer_image/layer_a.png')
    enhance_layer('assets/layer_image/layer_b.png')
    enhance_layer('assets/layer_image/layer_c.png')
    
    merge_icons()
