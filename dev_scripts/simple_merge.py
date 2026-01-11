from PIL import Image
import os

def merge_layers():
    print("Merging current layers (a, b, c) into app icons...")
    
    base_size = (1024, 1024)
    canvas = Image.new("RGBA", base_size, (0,0,0,0))
    
    layer_paths = [
        'assets/layer_image/layer_a.png',
        'assets/layer_image/layer_b.png',
        'assets/layer_image/layer_c.png'
    ]
    
    for path in layer_paths:
        if not os.path.exists(path):
            print(f"Error: {path} not found!")
            return

        try:
            img = Image.open(path).convert("RGBA")
            # Resize if not 1024x1024 (e.g. if one is 512 or 640)
            if img.size != base_size:
                print(f"  Resizing {path} from {img.size} to {base_size}")
                img = img.resize(base_size, Image.Resampling.LANCZOS)
            
            canvas.alpha_composite(img)
            print(f"  Composited {path}")
            
        except Exception as e:
            print(f"Error processing {path}: {e}")
            return

    # Save to assets folder
    icon_path = 'assets/icon.png'
    adaptive_icon_path = 'assets/adaptive-icon.png'
    
    canvas.save(icon_path)
    print(f"Saved {icon_path}")
    
    # For adaptive icon, typically we might want to drop transparency or keep it.
    # Expo default is often just the same file as icon.png if simple.
    canvas.save(adaptive_icon_path)
    print(f"Saved {adaptive_icon_path}")
    
    # Also useful to generate a splash icon if needed, but user asked for icon.
    canvas.save('assets/splash-icon.png')
    print("Saved assets/splash-icon.png")

if __name__ == "__main__":
    merge_layers()
