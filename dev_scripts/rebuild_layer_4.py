from PIL import Image, ImageDraw
import math

def generate_clean_layer_4():
    # Canvas setup
    width, height = 640, 640
    center_x, center_y = width // 2, height // 2
    
    # Create transparent image
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Style configuration
    # Gold color similar to the theme
    gold_color = (255, 215, 0, 255)  # #FFD700
    
    # Dimensions based on Layer 2 analysis (W~625 -> R~312)
    # We want this overlay to sit nicely on top or just inside
    outer_radius = 300
    inner_radius = 230  # Leave space for the character in the middle
    
    # 1. Main Outer Ring
    # Draw two circles close to each other to simulate thickness or just one thick line
    draw.ellipse(
        [center_x - outer_radius, center_y - outer_radius, 
         center_x + outer_radius, center_y + outer_radius],
        outline=gold_color, 
        width=4
    )
    
    # 2. Inner Ring
    draw.ellipse(
        [center_x - inner_radius, center_y - inner_radius, 
         center_x + inner_radius, center_y + inner_radius],
        outline=gold_color, 
        width=2
    )
    
    # 3. Tick Marks
    # 12 Major ticks (Hours)
    # 60 Minor ticks (Minutes)
    
    for i in range(60):
        is_major = (i % 5 == 0)
        
        angle_deg = i * 6
        angle_rad = math.radians(angle_deg - 90)
        
        # Calculate start and end points for ticks
        # Align them relative to the outer ring
        if is_major:
            tick_length = 20
            stroke_width = 4
        else:
            tick_length = 10
            stroke_width = 2
            
        # Draw ticks pointed inwards from the outer ring
        start_x = center_x + (outer_radius - 2) * math.cos(angle_rad)
        start_y = center_y + (outer_radius - 2) * math.sin(angle_rad)
        
        end_x = center_x + (outer_radius - tick_length) * math.cos(angle_rad)
        end_y = center_y + (outer_radius - tick_length) * math.sin(angle_rad)
        
        draw.line([(start_x, start_y), (end_x, end_y)], fill=gold_color, width=stroke_width)
        
    # 4. Save
    output_path = 'assets/layer_image/layer_4.png'
    img.save(output_path)
    print(f"Generated clean, centered {output_path}")

if __name__ == "__main__":
    generate_clean_layer_4()
