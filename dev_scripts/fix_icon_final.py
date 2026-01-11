from PIL import Image

def fix_and_merge():
    # 1. Fix Layer B Centering
    path_b = 'assets/layer_image/layer_b.png'
    try:
        img_b = Image.open(path_b).convert("RGBA")
        bbox = img_b.getbbox()
        
        if bbox:
            # content center
            cx = (bbox[0] + bbox[2]) // 2
            cy = (bbox[1] + bbox[3]) // 2
            
            # canvas center
            w, h = img_b.size
            mid_x, mid_y = w // 2, h // 2
            
            dx = mid_x - cx
            dy = mid_y - cy
            
            if dx != 0 or dy != 0:
                print(f"Centering Layer B... Offset: ({dx}, {dy})")
                # Create new canvas
                new_b = Image.new("RGBA", (w, h), (0,0,0,0))
                # Paste at offset
                new_b.paste(img_b, (dx, dy), img_b)
                img_b = new_b
                img_b.save(path_b)
            else:
                print("Layer B is already centered.")
        else:
            print("Layer B is empty?!")
            
    except Exception as e:
        print(f"Error fixing Layer B: {e}")
        return

    # 2. Merge A + B -> Icon
    print("Merging A + B -> Icons...")
    try:
        path_a = 'assets/layer_image/layer_a.png'
        img_a = Image.open(path_a).convert("RGBA")
        
        # Ensure sizes match
        base_size = (1024, 1024)
        if img_a.size != base_size: img_a = img_a.resize(base_size, Image.Resampling.LANCZOS)
        if img_b.size != base_size: img_b = img_b.resize(base_size, Image.Resampling.LANCZOS)
        
        canvas = Image.new("RGBA", base_size)
        canvas.alpha_composite(img_a)
        canvas.alpha_composite(img_b)
        
        canvas.save('assets/icon.png')
        canvas.save('assets/adaptive-icon.png')
        canvas.save('assets/splash-icon.png')
        print("Icons updated.")
        
    except Exception as e:
        print(f"Error merging: {e}")

if __name__ == "__main__":
    fix_and_merge()
