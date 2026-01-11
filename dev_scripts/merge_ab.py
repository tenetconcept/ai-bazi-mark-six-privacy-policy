from PIL import Image
import os

def merge_layers_ab():
    print("Merging layer_a and layer_b into app icons...")
    
    base_size = (1024, 1024)
    canvas = Image.new("RGBA", base_size, (0,0,0,0))
    
    layer_paths = [
        'assets/layer_image/layer_a.png',
        'assets/layer_image/layer_b.png'
    ]
    
    for path in layer_paths:
        if not os.path.exists(path):
            print(f"Error: {path} not found!")
            return

        try:
            img = Image.open(path).convert("RGBA")
            if img.size != base_size:
                print(f"  Resizing {path} from {img.size} to {base_size}")
                img = img.resize(base_size, Image.Resampling.LANCZOS)
            
            canvas.alpha_composite(img)
            print(f"  Composited {path}")
            
        except Exception as e:
            print(f"Error processing {path}: {e}")
            return

    # Save
    canvas.save('assets/icon.png')
    canvas.save('assets/adaptive-icon.png')
    canvas.save('assets/splash-icon.png')
    print("Saved icon.png, adaptive-icon.png, splash-icon.png")

if __name__ == "__main__":
    merge_layers_ab()
