import os
import sys
from PIL import Image, ImageDraw, ImageFont

# --- Configuration ---
ICON_SIZE = (1024, 1024)  # Standard Expo/App Store size
TOP_COLOR_HEX = "#dfadb9"
BOTTOM_COLOR_HEX = "#dd3e88"
TEXT_CONTENT = "Harry's"
TEXT_COLOR = "white"
FONT_FILENAME = "dynapuff.bold.ttf"
OUTPUT_FILENAME = "icon.png"

# --- Helper Functions ---

def hex_to_rgb(hex_color):
    """Converts hex string (e.g., #ffffff) to rgb tuple (255, 255, 255)."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_gradient(width, height, start_hex, end_hex):
    """Creates a vertical gradient image."""
    base = Image.new('RGB', (width, height), start_hex)
    draw = ImageDraw.Draw(base)
    
    start_r, start_g, start_b = hex_to_rgb(start_hex)
    end_r, end_g, end_b = hex_to_rgb(end_hex)

    for y in range(height):
        # Calculate the interpolation factor (0.0 at top, 1.0 at bottom)
        factor = y / height
        
        # Interpolate the colors
        r = int(start_r + (end_r - start_r) * factor)
        g = int(start_g + (end_g - start_g) * factor)
        b = int(start_b + (end_b - start_b) * factor)
        
        # Draw a line for this row
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return base

def main():
    # 1. Setup Paths
    # Get the directory where this script lives (scripts/)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up one level to project root
    project_root = os.path.dirname(script_dir)
    
    font_path = os.path.join(project_root, 'assets', 'fonts', FONT_FILENAME)
    output_path = os.path.join(project_root, 'assets', 'images', OUTPUT_FILENAME)

    # Check if font exists
    if not os.path.exists(font_path):
        print(f"Error: Could not find font at {font_path}")
        print("Please check the filename and ensure it matches exactly.")
        sys.exit(1)

    print("Generating gradient background...")
    # 2. Create Background
    image = create_gradient(ICON_SIZE[0], ICON_SIZE[1], TOP_COLOR_HEX, BOTTOM_COLOR_HEX)
    draw = ImageDraw.Draw(image)

    # 3. Setup Font
    # We estimate a font size. 250 looks usually good for 1024px, 
    # but we can calculate it relative to width roughly.
    font_size = int(ICON_SIZE[0] * 0.225) 
    
    try:
        font = ImageFont.truetype(font_path, font_size)
    except Exception as e:
        print(f"Error loading font: {e}")
        sys.exit(1)

    # 4. Draw Text Centered
    # anchor="mm" aligns the text to the Middle-Middle of the coordinates provided
    center_x = ICON_SIZE[0] / 2
    center_y = ICON_SIZE[1] / 2
    
    print(f"Drawing text '{TEXT_CONTENT}'...")
    draw.text(
        (center_x, center_y), 
        TEXT_CONTENT, 
        font=font, 
        fill=TEXT_COLOR, 
        anchor="mm"
    )

    # 5. Save
    image.save(output_path)
    print(f"Success! Icon created at: {output_path}")

if __name__ == "__main__":
    main()