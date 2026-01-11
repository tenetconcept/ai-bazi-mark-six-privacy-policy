from PIL import Image, ImageEnhance, ImageFilter

def super_enhance(path, output_path, target_res=(1024, 1024)):
    try:
        print(f"Super-enhancing {path}...")
        img = Image.open(path).convert("RGBA")
        
        # 1. Super-sampling: Upscale to 4x (4096) to smooth out jagged edges
        work_res = (target_res[0] * 4, target_res[1] * 4)
        print(f"  Upscaling to {work_res} for processing")
        # Use Bicubic for smoother gradients during upscale
        img = img.resize(work_res, Image.Resampling.BICUBIC)
        
        # 2. Smooth (Blur) to accept the interpolated pixels as surface
        # A radius of 2 or 3 at 4096px is subtle but removes pixelation noise
        img = img.filter(ImageFilter.GaussianBlur(radius=3))
        
        # 3. Downscale halfway to 2048 (2x) to consolidate
        mid_res = (target_res[0] * 2, target_res[1] * 2)
        img = img.resize(mid_res, Image.Resampling.LANCZOS)
        
        # 4. Sharpening (Unsharp Mask) to define edges clearly
        # Radius 2 at 2048px
        print("  Applying Unsharp Mask...")
        img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
        
        # 5. Contrast / Solidify
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.2) # Make colors pop
        
        # 6. Final Downscale to target
        print(f"  Final downscale to {target_res}")
        img = img.resize(target_res, Image.Resampling.LANCZOS)
        
        # 7. Final light sharpen to counter downscale blur
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(1.1)

        img.save(output_path)
        print(f"  Saved {output_path}")
        return img
        
    except Exception as e:
        print(f"  Error processing {path}: {e}")
        return None

def merge_layers():
    print("\nMerging layers...")
    try:
        # Load enhanced layers directly from output path
        img_a = Image.open('assets/layer_image/layer_a_final.png').convert("RGBA")
        img_b = Image.open('assets/layer_image/layer_b_final.png').convert("RGBA")
        img_c = Image.open('assets/layer_image/layer_c.png').convert("RGBA")
        
        # Ensure sizes
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
    # We use new names for the final output
    super_enhance('assets/layer_image/layer_a.png', 'assets/layer_image/layer_a_final.png')
    super_enhance('assets/layer_image/layer_b.png', 'assets/layer_image/layer_b_final.png')
    
    # Overwrite originals for the app run time usage
    import shutil
    shutil.copy('assets/layer_image/layer_a_final.png', 'assets/layer_image/layer_a.png')
    shutil.copy('assets/layer_image/layer_b_final.png', 'assets/layer_image/layer_b.png')
    
    merge_layers()
