import os
import random
from PIL import Image, ImageDraw, ImageFont

def generate_background():
    # Configuration
    bg_color = "#dd3e88"
    text_color = (255, 255, 255, 180)
    
    text = "Harry"
    font_size = 60
    rotation = 30
    image_size = (1080, 1920) # Mobile wallpaper size roughly
    
    # Paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    font_path = os.path.join(project_root, "assets", "fonts", "dynapuff.bold.ttf")
    output_path = os.path.join(project_root, "assets", "images", "background.png")

    # Create image
    img = Image.new('RGB', image_size, color=bg_color)
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype(font_path, font_size)
    except IOError:
        print(f"Error: Could not load font at {font_path}")
        return

    # Draw text sparsely with uniform pattern
    step_x = 350
    step_y = 250
    row_offset = 175  # Half of step_x

    # Calculate number of rows and columns needed to cover the image + padding
    # We start from negative coordinates to ensure edges are covered
    start_x = -step_x
    start_y = -step_y
    end_x = image_size[0] + step_x
    end_y = image_size[1] + step_y

    row_index = 0
    for y in range(start_y, end_y, step_y):
        # Calculate x offset for this row
        current_row_offset = row_offset if (row_index % 2 != 0) else 0
        
        for x in range(start_x, end_x, step_x):
            pos_x = x + current_row_offset
            pos_y = y
            
            # Create a separate image for the text to rotate it
            # We need a larger canvas for the text to avoid clipping when rotating
            txt_img = Image.new('RGBA', (400, 200), (255, 255, 255, 0))
            txt_draw = ImageDraw.Draw(txt_img)
            # Center text in the temp image
            txt_draw.text((100, 50), text, font=font, fill=text_color)
            
            rotated_txt = txt_img.rotate(rotation, expand=1)
            
            # Paste onto main image
            # We need to use the alpha channel as mask
            img.paste(rotated_txt, (pos_x, pos_y), rotated_txt)
        
        row_index += 1

    img.save(output_path)
    print(f"Background generated at {output_path}")

if __name__ == "__main__":
    generate_background()
