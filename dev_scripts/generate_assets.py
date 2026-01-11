import os
from PIL import Image, ImageDraw, ImageFont

folder = r'C:\Users\cursor\Documents\GitHub Copilot\bazi_app\store_assets'
if not os.path.exists(folder):
    os.makedirs(folder)

# Colors
RED_DARK = (180, 0, 20)
RED_BRIGHT = (220, 20, 60)
GOLD = (255, 215, 0)
GOLD_DARK = (218, 165, 32)
WHITE = (255, 255, 255)
BG_COLOR = (20, 5, 5) # Dark reddish black
TEXT_COLOR = (255, 255, 255)

# Fonts
# Try to load Arial, otherwise default
try:
    # Large font
    font_large = ImageFont.truetype("arial.ttf", 60)
    font_medium = ImageFont.truetype("arial.ttf", 40)
    font_small = ImageFont.truetype("arial.ttf", 24)
    # Huge for Icon
    font_icon = ImageFont.truetype("arial.ttf", 250)
    font_fg = ImageFont.truetype("arial.ttf", 80)
except IOError:
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()
    font_icon = ImageFont.load_default()
    font_fg = ImageFont.load_default()

def draw_gradient(draw, rect, color1, color2):
    width = rect[2] - rect[0]
    height = rect[3] - rect[1]
    for y in range(height):
        r = int(color1[0] + (color2[0] - color1[0]) * y / height)
        g = int(color1[1] + (color2[1] - color1[1]) * y / height)
        b = int(color1[2] + (color2[2] - color1[2]) * y / height)
        draw.line([(rect[0], rect[1]+y), (rect[2], rect[1]+y)], fill=(r,g,b))

# 1. App Icon (512x512)
print("Generating Icon...")
img_icon = Image.new('RGB', (512, 512), color=RED_DARK)
draw_icon = ImageDraw.Draw(img_icon)
# Background Gradient
draw_gradient(draw_icon, [0, 0, 512, 512], RED_BRIGHT, (100, 0, 0))
# Gold Ring
draw_icon.ellipse([56, 56, 456, 456], outline=GOLD, width=15)
draw_icon.ellipse([80, 80, 432, 432], outline=GOLD_DARK, width=5)
# Text "8" (Lucky 8 or Bazi)
w, h = 512, 512
# Draw a stylized 6 or 8. Let's do a '6' for Mark Six.
# anchor="mm" is center/middle
draw_icon.text((256, 256), "6", font=font_icon, fill=GOLD, anchor="mm")
img_icon.save(os.path.join(folder, 'icon.png'))

# 2. Feature Graphic (1024x500)
print("Generating Feature Graphic...")
img_fg = Image.new('RGB', (1024, 500), color=BG_COLOR)
draw_fg = ImageDraw.Draw(img_fg)
draw_gradient(draw_fg, [0, 0, 1024, 500], (50, 0, 10), (10, 0, 0))
# Balls
def draw_ball(draw, x, y, r, color, num):
    draw.ellipse([x-r, y-r, x+r, y+r], fill=color, outline=WHITE, width=2)
    draw.text((x, y), str(num), font=font_medium, fill=WHITE, anchor="mm")

draw_ball(draw_fg, 800, 150, 60, RED_BRIGHT, "8")
draw_ball(draw_fg, 900, 350, 40, (30, 144, 255), "26") # Blue
draw_ball(draw_fg, 150, 300, 50, (34, 139, 34), "18") # Green

# Text
draw_fg.text((512, 200), "Mark Six Analysis", font=font_fg, fill=GOLD, anchor="mm")
draw_fg.text((512, 280), "Bazi Fortune Version", font=font_medium, fill=WHITE, anchor="mm")
img_fg.save(os.path.join(folder, 'feature_graphic.png'))

# 3. Screenshots (1080x1920)
def create_base_screenshot(title):
    img = Image.new('RGB', (1080, 1920), color=BG_COLOR)
    draw = ImageDraw.Draw(img)
    # Header
    draw.rectangle([0, 0, 1080, 150], fill=(180, 0, 20))
    draw.text((540, 75), title, font=font_large, fill=WHITE, anchor="mm")
    # Tab Bar
    draw.rectangle([0, 1770, 1080, 1920], fill=(30, 30, 30))
    return img, draw

# Screenshot 1: Input Screen
print("Generating Screenshot 1...")
img_s1, draw_s1 = create_base_screenshot("Lucky Numbers")
# Form fields mimic
start_y = 250
for i, label in enumerate(["Birth Date", "Birth Time", "Birth Place", "Gender"]):
    y = start_y + i * 200
    draw_s1.text((100, y), label, font=font_medium, fill=GOLD)
    draw_s1.rectangle([100, y+60, 980, y+160], outline=GOLD_DARK, width=3, fill=(50, 20, 20))
    draw_s1.text((140, y+110), "Select...", font=font_medium, fill=WHITE, anchor="lm")
# Button
draw_s1.rectangle([100, 1100, 980, 1250], fill=RED_BRIGHT, outline=GOLD, width=3)
draw_s1.text((540, 1175), "GENERATE NUMBERS", font=font_large, fill=WHITE, anchor="mm")
img_s1.save(os.path.join(folder, 'phone_screenshot_1.png'))

# Screenshot 2: Results
print("Generating Screenshot 2...")
img_s2, draw_s2 = create_base_screenshot("Your Lucky Numbers")
# Results Card
draw_s2.rectangle([50, 250, 1030, 1000], fill=(50, 0, 0), outline=GOLD, width=5)
# Message
draw_s2.text((540, 350), "Bazi Calculated!", font=font_medium, fill=WHITE, anchor="mm")
# Balls Row
ball_y = 500
colors = [RED_BRIGHT, RED_BRIGHT, (30,144,255), (30,144,255), (34,139,34), (34,139,34)]
nums = ["2", "8", "16", "24", "33", "45"]
for i in range(6):
    x = 180 + i * 140
    draw_ball(draw_s2, x, ball_y, 60, colors[i], nums[i])
# Special Ball
draw_s2.text((540, 650), "Special", font=font_medium, fill=GOLD, anchor="mm")
draw_ball(draw_s2, 540, 750, 65, RED_BRIGHT, "49")

draw_s2.text((540, 900), "Suggested Bet: 5:00 PM - Central", font=font_small, fill=WHITE, anchor="mm")
img_s2.save(os.path.join(folder, 'phone_screenshot_2.png'))

# Screenshot 3: Bazi Analysis
print("Generating Screenshot 3...")
img_s3, draw_s3 = create_base_screenshot("Fortune Analysis")
# Chart Grid
grid_y = 300
draw_s3.text((540, 250), "Your Four Pillars", font=font_medium, fill=GOLD, anchor="mm")
# 4 columns
cols = ["Year", "Month", "Day", "Time"]
stems = ["Yi", "Jia", "Bing", "Ding"]
branches = ["Chou", "Zi", "Yin", "Mao"]
elements = ["Wood", "Wood", "Fire", "Fire"]
for i in range(4):
    x = 140 + i * 260
    # Column Header
    draw_s3.text((x, grid_y), cols[i], font=font_small, fill=WHITE, anchor="mm")
    # Box
    draw_s3.rectangle([x-100, grid_y+50, x+100, grid_y+400], outline=GOLD_DARK, width=2)
    # Content
    draw_s3.text((x, grid_y+150), stems[i], font=font_large, fill=RED_BRIGHT, anchor="mm")
    draw_s3.text((x, grid_y+250), branches[i], font=font_large, fill=GOLD, anchor="mm")
    draw_s3.text((x, grid_y+350), elements[i], font=font_medium, fill=WHITE, anchor="mm")

# Analysis Text
draw_s3.text((100, 800), "Analysis Report:", font=font_medium, fill=GOLD)
draw_s3.rectangle([50, 850, 1030, 1400], fill=(40, 40, 40))
draw_s3.text((80, 900), "Lucky Color: Red, Gold\nLucky Direction: South\nCareer: Excellent opportunities.\nWealth: Strong in second half.", font=font_medium, fill=WHITE)

img_s3.save(os.path.join(folder, 'phone_screenshot_3.png'))

# Screenshot 4: History or Settings
print("Generating Screenshot 4...")
img_s4, draw_s4 = create_base_screenshot("History")
# List of items
for i in range(5):
    y = 250 + i * 250
    draw_s4.rectangle([50, y, 1030, y+220], fill=(40, 40, 40), outline=(60,60,60))
    draw_s4.text((100, y+50), f"2026-01-0{i+1} Calculation", font=font_medium, fill=GOLD)
    # Mini balls
    for b in range(6):
        bx = 120 + b * 80
        draw_s4.ellipse([bx-30, y+130, bx+30, y+190], fill=RED_BRIGHT)
        draw_s4.text((bx, y+160), str(b+1), font=font_small, fill=WHITE, anchor="mm")

img_s4.save(os.path.join(folder, 'phone_screenshot_4.png'))

print("All PNG assets generated successfully in " + folder)
