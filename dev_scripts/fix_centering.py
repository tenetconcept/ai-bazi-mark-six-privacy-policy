from PIL import Image

def force_center_layers():
    paths = ['assets/layer_image/layer_a.png', 'assets/layer_image/layer_b.png']
    
    for path in paths:
        try:
            img = Image.open(path).convert("RGBA")
            bbox = img.getbbox()
            
            if not bbox:
                print(f"{path} is empty, skipping.")
                continue
                
            # Current content center
            content_cx = (bbox[0] + bbox[2]) / 2
            content_cy = (bbox[1] + bbox[3]) / 2
            
            # Target center (Canvas center)
            target_cx = img.width / 2
            target_cy = img.height / 2
            
            dx = int(target_cx - content_cx)
            dy = int(target_cy - content_cy)
            
            if dx == 0 and dy == 0:
                print(f"{path} is already perfectly centered.")
            else:
                print(f"Centering {path}: Moving content by ({dx}, {dy})")
                new_img = Image.new("RGBA", img.size, (0, 0, 0, 0))
                # Paste the original image shifted by dx, dy. 
                # Does not crop, but content needs to stay within bounds.
                # Since we are centering, it should be fine unless content is larger than canvas.
                new_img.paste(img, (dx, dy), img) 
                
                # Check bbox again to confirm
                # new_bbox = new_img.getbbox()
                # new_cy = (new_bbox[1] + new_bbox[3]) / 2
                # print(f"  New Y Center: {new_cy} (Target: {target_cy})")
                
                new_img.save(path)
                print(f"  Saved {path}")
                
        except Exception as e:
            print(f"Error processing {path}: {e}")

def merge_icons():
    print("Regenerating icons...")
    base_size = (1024, 1024)
    canvas = Image.new("RGBA", base_size)
    
    img_a = Image.open('assets/layer_image/layer_a.png').convert("RGBA")
    img_b = Image.open('assets/layer_image/layer_b.png').convert("RGBA")
    
    canvas.alpha_composite(img_a)
    canvas.alpha_composite(img_b)
    
    canvas.save('assets/icon.png')
    canvas.save('assets/adaptive-icon.png')
    canvas.save('assets/splash-icon.png')
    print("Icons saved.")

if __name__ == "__main__":
    force_center_layers()
    merge_icons()
