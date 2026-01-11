from PIL import Image, ImageFilter

def thin_lines(path):
    try:
        img = Image.open(path).convert("RGBA")
        print(f"Original size: {img.size}")
        
        # Split channels
        r, g, b, a = img.split()
        
        # Erode the alpha channel to make lines thinner.
        # MinFilter(3) uses a 3x3 kernel. For each pixel, it takes the minimum value in the 3x3 neighborhood.
        # Since transparent is 0 and opaque is 255, this shrinks the opaque area by 1 pixel on all sides.
        new_a = a.filter(ImageFilter.MinFilter(3))
        
        # Merge back
        new_img = Image.merge("RGBA", (r, g, b, new_a))
        
        new_img.save(path)
        print(f"Successfully processed {path}: Lines should appear thinner.")
        
    except Exception as e:
        print(f"Error processing {path}: {e}")

if __name__ == "__main__":
    thin_lines('assets/layer_image/layer_4.png')
