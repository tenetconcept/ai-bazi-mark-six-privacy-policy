from PIL import Image

def resize_layer_c():
    path = 'assets/layer_image/layer_c.png'
    try:
        img = Image.open(path).convert('RGBA')
        print(f"Original Layer C Size: {img.size}")
        
        if img.size != (640, 640):
            img = img.resize((640, 640), Image.Resampling.LANCZOS)
            img.save(path)
            print(f"Resized Layer C to {img.size}")
        else:
            print("Layer C is already 640x640")
            
    except Exception as e:
        print(f"Error resizing Layer C: {e}")

if __name__ == "__main__":
    resize_layer_c()
