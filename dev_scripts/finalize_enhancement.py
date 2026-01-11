from PIL import Image, ImageEnhance, ImageFilter

def enhance_and_solidify(path, output_path, resolution=(1024, 1024)):
    try:
        print(f"Processing {path}...")
        img = Image.open(path).convert("RGBA")
        
        # 1. Upscale if needed
        if img.size != resolution:
            print(f"  Upscaling from {img.size} to {resolution}")
            img = img.resize(resolution, Image.Resampling.LANCZOS)
        
        # 2. Sharpen to make it look "more solid" / defined
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(2.0) # Increased sharpness
        
        # 3. Increase Contrast to make colors "solid"
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.2)
        
        # 4. Alpha boost (make semi-transparent pixels more opaque)
        # This addresses "not solid enough" if it means faint transparency
        r, g, b, a = img.split()
        # boost alpha: if alpha > 10, multiply by 1.2 but cap at 255
        a = a.point(lambda p: min(255, int(p * 1.5)) if p > 20 else 0)
        img = Image.merge("RGBA", (r, g, b, a))

        img.save(output_path)
        print(f"  Saved enhanced {output_path}")
        return img
        
    except Exception as e:
        print(f"  Error processing {path}: {e}")
        return None

def merge_layers():
    print("\nMerging layers...")
    try:
        # Load enhanced layers
        img_a = Image.open('assets/layer_image/layer_a_enhanced.png').convert("RGBA")
        img_b = Image.open('assets/layer_image/layer_b_enhanced.png').convert("RGBA")
        
        # Layer C is likely already good, but let's ensure it fits
        img_c = Image.open('assets/layer_image/layer_c.png').convert("RGBA")
        if img_c.size != (1024, 1024):
             img_c = img_c.resize((1024, 1024), Image.Resampling.LANCZOS)
        
        # Canvas
        canvas = Image.new("RGBA", (1024, 1024))
        
        # Composite: A (Bottom) -> B (Middle) -> C (Top)
        canvas.alpha_composite(img_a)
        canvas.alpha_composite(img_b)
        canvas.alpha_composite(img_c)
        
        canvas.save('assets/icon.png')
        canvas.save('assets/adaptive-icon.png')
        print("Merged icon saved to assets/icon.png")
        
    except Exception as e:
        print(f"Error merging: {e}")

if __name__ == "__main__":
    # Process A
    enhance_and_solidify('assets/layer_image/layer_a.png', 'assets/layer_image/layer_a_enhanced.png')
    
    # Process B
    enhance_and_solidify('assets/layer_image/layer_b.png', 'assets/layer_image/layer_b_enhanced.png')
    
    # We replace the original files with enhanced ones for the app (IntroAnimation) to use them too
    # But usually it's safer to keep originals? The user wants the app to use improved versions.
    # So I will overwrite the originals after processing.
    
    import shutil
    shutil.copy('assets/layer_image/layer_a_enhanced.png', 'assets/layer_image/layer_a.png')
    shutil.copy('assets/layer_image/layer_b_enhanced.png', 'assets/layer_image/layer_b.png')
    
    merge_layers()
