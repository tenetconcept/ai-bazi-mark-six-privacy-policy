from PIL import Image

def flood_fill_center_transparency(path, tolerance=20):
    try:
        img = Image.open(path).convert("RGBA")
        width, height = img.size
        center = (width // 2, height // 2)
        
        target_color = img.getpixel(center)
        print(f"Target color at center: {target_color}")
        
        if target_color[3] == 0:
            print("Center is already transparent.")
            return

        pixels = img.load()
        queue = [center]
        visited = set(queue)
        
        target_r, target_g, target_b, target_a = target_color
        
        # Directions
        dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        
        count = 0
        while queue:
            x, y = queue.pop(0)
            
            # Make transparent
            pixels[x, y] = (0, 0, 0, 0)
            count += 1
            
            for dx, dy in dirs:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    r, g, b, a = pixels[nx, ny]
                    
                    if (abs(r - target_r) <= tolerance and
                        abs(g - target_g) <= tolerance and
                        abs(b - target_b) <= tolerance):
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                        
        img.save(path)
        print(f"Processed {path}, cleared {count} pixels from center.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    flood_fill_center_transparency('assets/layer_image/layer_b.png')
