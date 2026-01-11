from PIL import Image
import os

def flood_fill_transparency(path, tolerance=30):
    try:
        img = Image.open(path).convert("RGBA")
    except Exception as e:
        print(f"Could not open {path}: {e}")
        return

    width, height = img.size
    
    # Get target color from corner
    target_color = img.getpixel((0, 0))
    target_r, target_g, target_b, target_a = target_color
    
    # If already transparent, skip
    if target_a == 0:
        print(f"{path} is already transparent at corner.")
        return

    print(f"Flood filling {path} starting with color {target_color}...")
    
    pixels = img.load()
    queue = [(0,0), (width-1, 0), (0, height-1), (width-1, height-1)]
    visited = set(queue)
    
    # Directions for neighbors
    dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    count = 0
    while queue:
        x, y = queue.pop(0)
        
        # Set to transparent
        pixels[x, y] = (0, 0, 0, 0)
        count += 1
        
        for dx, dy in dirs:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                r, g, b, a = pixels[nx, ny]
                # Check match
                if (abs(r - target_r) <= tolerance and
                    abs(g - target_g) <= tolerance and
                    abs(b - target_b) <= tolerance):
                    visited.add((nx, ny))
                    queue.append((nx, ny))
                    
    img.save(path)
    print(f"Processed {path}, cleared {count} pixels.")

# Process all layers
for i in range(1, 5):
    flood_fill_transparency(f'assets/layer_image/layer_{i}.png')
