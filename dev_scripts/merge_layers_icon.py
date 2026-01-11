from PIL import Image

def merge_layers_to_icon():
    base_size = (1024, 1024)
    
    # Load layers
    try:
        layer_a = Image.open('assets/layer_image/layer_a.png').convert('RGBA')
        layer_b = Image.open('assets/layer_image/layer_b.png').convert('RGBA')
        layer_c = Image.open('assets/layer_image/layer_c.png').convert('RGBA')
    except Exception as e:
        print(f"Error loading layers: {e}")
        return

    # Create base canvas
    final_icon = Image.new('RGBA', base_size)
    
    # Resize and paste Layer A (Background)
    # Assuming Layer A should fill the icon
    a_resized = layer_a.resize(base_size, Image.Resampling.LANCZOS)
    final_icon.alpha_composite(a_resized)
    
    # Resize and paste Layer B (Middle)
    # Assuming Layer B should be centered and relatively scaled
    # If the user wants it "large", and it's 512 same as A, then scaling to 1024 matches A's scale.
    b_resized = layer_b.resize(base_size, Image.Resampling.LANCZOS)
    final_icon.alpha_composite(b_resized)
    
    # Resize and paste Layer C (Top)
    c_resized = layer_c.resize(base_size, Image.Resampling.LANCZOS)
    final_icon.alpha_composite(c_resized)
    
    # Save standard icon
    final_icon.save('assets/icon.png')
    print("Generated assets/icon.png")
    
    # Save adaptive icon (keep background, maybe identical for now or removing alpha if any)
    # Adaptive icons usually need a background layer and a foreground layer.
    # For simplicity in Expo without native config, we often just use the full icon.
    final_icon.save('assets/adaptive-icon.png')
    print("Generated assets/adaptive-icon.png")

if __name__ == "__main__":
    merge_layers_to_icon()
