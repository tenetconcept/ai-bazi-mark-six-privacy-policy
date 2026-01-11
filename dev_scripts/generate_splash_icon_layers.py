from PIL import Image
import os

def create_splash_icon():
    print("Generating splash-icon.png from layers...")
    
    layer_a_path = 'assets/layer_image/layer_a.png'
    layer_b_path = 'assets/layer_image/layer_b.png'
    
    if not os.path.exists(layer_a_path) or not os.path.exists(layer_b_path):
        print("Error: Layer files not found!")
        return

    # Load layers
    img_a = Image.open(layer_a_path).convert("RGBA")
    img_b = Image.open(layer_b_path).convert("RGBA")
    
    # Create valid canvas
    # IntroAnimation uses a 240x240 container (styles.logoContainer)
    # Inside, layerLarge is 320x320.
    # We want a splash icon that represents this.
    # 512x512 is a good standard icon size.
    
    base_size = 1024
    canvas = Image.new('RGBA', (base_size, base_size), (0, 0, 0, 0))
    
    # Resize layers to fit canvas
    # In IntroAnimation, layers are 320x320.
    # We will make them occupy most of the canvas.
    # Let's say 800x800 for the main visual content.
    
    # Since layer_a and layer_b are already pre-processed/centered relative to each other?
    # No, in IntroAnimation, they are just placed.
    # layerA is 635x635 px (from source usually) or similar.
    # Let's inspect their sizes first.
    
    # Resize strategy: Keep aspect ratio, fit within 800x800
    target_size = (900, 900)
    
    # Resize A
    img_a_resized = img_a.resize(target_size, Image.Resampling.LANCZOS)
    
    # Resize B
    img_b_resized = img_b.resize(target_size, Image.Resampling.LANCZOS)
    
    # Center position
    pos_x = (base_size - target_size[0]) // 2
    pos_y = (base_size - target_size[1]) // 2
    
    # Compose
    canvas.paste(img_a_resized, (pos_x, pos_y), img_a_resized)
    canvas.paste(img_b_resized, (pos_x, pos_y), img_b_resized)
    
    # Save
    out_path = 'assets/splash-icon.png'
    canvas.save(out_path, "PNG")
    print(f"Saved {out_path}")

if __name__ == "__main__":
    create_splash_icon()
