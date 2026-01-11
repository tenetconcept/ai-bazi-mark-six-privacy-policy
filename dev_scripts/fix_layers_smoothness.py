from PIL import Image, ImageFilter

def process_layer_a_thinning(img):
    print("Thinning Layer A...")
    r, g, b, a = img.split()
    # MinFilter(3) erodes by 1 pixel radius (approx)
    new_a = a.filter(ImageFilter.MinFilter(3))
    return Image.merge("RGBA", (r, g, b, new_a))

def smooth_image(img, factor=4):
    print(f"Smoothing image (Super-sampling {factor}x)...")
    original_size = img.size
    new_size = (original_size[0] * factor, original_size[1] * factor)
    
    # 1. Upscale
    # Use Nearest to preserve jagged structure 
    # (so we can smooth it ourselves cleanly) or Bilinear. 
    # Usually Bicubic is better for general upscaling.
    resized = img.resize(new_size, Image.Resampling.BICUBIC)
    
    # 2. Extract Alpha to smooth edges
    r, g, b, a = resized.split()
    
    # 3. Blur Alpha slightly to create soft edges (gradient)
    # Radius depends on upscale factor. 
    # At 4x, a 1-2px blur represents 0.25-0.5px in original scale.
    # Let's use radius=2.
    a = a.filter(ImageFilter.GaussianBlur(radius=2))
    
    # 4. Merge back
    resized = Image.merge("RGBA", (r, g, b, a))
    
    # 5. Downscale with high quality filter
    final = resized.resize(original_size, Image.Resampling.LANCZOS)
    return final

def process_all():
    files = {
        'layer_a': 'assets/layer_image/layer_a.png',
        'layer_b': 'assets/layer_image/layer_b.png',
        'layer_c': 'assets/layer_image/layer_c.png'
    }
    
    for name, path in files.items():
        print(f"Processing {name} ({path})...")
        try:
            img = Image.open(path).convert("RGBA")
            
            # Special processing for Layer A
            if name == 'layer_a':
                img = process_layer_a_thinning(img)
            
            # Smooth all layers
            img = smooth_image(img)
            
            img.save(path)
            print(f"Saved updated {path}")
            
        except Exception as e:
            print(f"Failed to process {path}: {e}")

if __name__ == "__main__":
    process_all()
