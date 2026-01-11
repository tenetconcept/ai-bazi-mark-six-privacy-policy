from PIL import Image
import os

# Load the actual app icon
icon_path = "assets/App Icons/appstore.png"
img = Image.open(icon_path).convert("RGBA")

# Get dimensions
width, height = img.size
center = (width // 2, height // 2)

print(f"Icon size: {width}x{height}")

# We need to extract:
# 1. Outer ring only (static)
# 2. Inner disc with radar elements but WITHOUT the character (rotating)
# 3. Character only (static)

# Since we can't easily separate the character from the inner disc programmatically,
# let's use a different approach:
# Just copy the whole icon as the base, but we'll only animate part of it in code

# For now, let's resize the icon to 512x512 for the intro animation
size = 512
resized = img.resize((size, size), Image.Resampling.LANCZOS)

# Save as the intro icon
resized.save("assets/intro_full_icon.png")
print("Saved assets/intro_full_icon.png")

# The actual layer separation would require image editing software
# or the original layered source file.
# 
# As a workaround, we'll use the full icon and simulate rotation
# by overlaying a static character on top.

print("\nNote: For proper layer separation, you may need to:")
print("1. Use the original design files")
print("2. Or manually separate layers in image editing software")
