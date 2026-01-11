from PIL import Image

def remove_background(path, tolerance=10):
    img = Image.open(path).convert("RGBA")
    datas = img.getdata()
    
    # Get the background color from the top-left pixel
    bg_color = datas[0]
    
    newData = []
    for item in datas:
        # Check if the pixel matches the background color within tolerance
        if (abs(item[0] - bg_color[0]) <= tolerance and
            abs(item[1] - bg_color[1]) <= tolerance and
            abs(item[2] - bg_color[2]) <= tolerance):
            newData.append((0, 0, 0, 0))  # Transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(path)
    print(f"Processed {path}")

def flood_fill_transparency(path, tolerance=10):
    """
    More robust: clear from corners inwards to avoid deleting internal pixels 
    that match the background color.
    """
    img = Image.open(path).convert("RGBA")
    width, height = img.size
    
    # Get target color from corner
    target_color = img.getpixel((0, 0))
    
    # ImageDraw.floodfill is an option but might not handle alpha channel set easily
    # Instead, we traverse. But PIL doesn't have a built-in "flood fill to transparent".
    # We will use a simple BFS for flood fill.
    
    pixels = img.load()
    queue = [(0,0), (width-1, 0), (0, height-1), (width-1, height-1)]
    visited = set(queue)
    
    target_r, target_g, target_b, target_a = target_color
    
    # Directions for neighbors
    dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    # Only proceed if the corner is not already transparent
    if target_a == 0:
        print(f"{path} is already transparent at corner.")
        return

    print(f"Flood filling {path} starting with color {target_color}...")
    
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

# Apply to layer 1 (The background/base)
try:
    flood_fill_transparency('assets/layer_image/layer_1.png')
except Exception as e:
    print(f"Error processing layer_1: {e}")

# Layer 2 and 3 and 4 were reported as having Alpha 1, 0, 1. They are likely fine.
# But let's check layer_4 just in case it has a sheen that is blocked by white/black box?
# No, user didn't complain about white box, just "square icon". That refers to the red box.
