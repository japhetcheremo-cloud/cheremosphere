import os
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = r"C:\Users\Administrator\.gemini\antigravity\scratch\cheremosphere\mobile\assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

# Colors
NAVY = (13, 42, 92)        # #0D2A5C
NAVY_DARK = (7, 24, 54)     # #071836
ORANGE = (255, 122, 0)      # #FF7A00
ORANGE_LIGHT = (255, 179, 102)
WHITE = (255, 255, 255)

def create_icon(size=512, background=NAVY, is_adaptive=False):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0) if is_adaptive else background)
    draw = ImageDraw.Draw(img)
    
    # Scale factor
    s = size / 512.0
    
    # Draw orbit (ellipse ring)
    orbit_bbox = [int(80 * s), int(120 * s), int(430 * s), int(390 * s)]
    draw.arc(orbit_bbox, start=30, end=330, fill=ORANGE, width=int(18 * s))
    
    # Draw C symbol
    c_bbox = [int(110 * s), int(110 * s), int(370 * s), int(402 * s)]
    draw.arc(c_bbox, start=50, end=310, fill=WHITE, width=int(48 * s))
    
    # Draw orange sphere on orbit
    sphere_center = (int(375 * s), int(195 * s))
    radius = int(40 * s)
    draw.ellipse([
        sphere_center[0] - radius, sphere_center[1] - radius,
        sphere_center[0] + radius, sphere_center[1] + radius
    ], fill=ORANGE)
    
    # Highlight inside sphere
    hl_center = (int(365 * s), int(185 * s))
    hl_radius = int(12 * s)
    draw.ellipse([
        hl_center[0] - hl_radius, hl_center[1] - hl_radius,
        hl_center[0] + hl_radius, hl_center[1] + hl_radius
    ], fill=WHITE)
    
    return img

def create_splash():
    width, height = 1242, 2436
    img = Image.new("RGBA", (width, height), NAVY)
    draw = ImageDraw.Draw(img)
    
    # Center logo mark
    s = 1.6
    cx, cy = width // 2, height // 2 - 120
    
    orbit_bbox = [int(cx - 175 * s), int(cy - 135 * s), int(cx + 175 * s), int(cy + 135 * s)]
    draw.arc(orbit_bbox, start=30, end=330, fill=ORANGE, width=int(16 * s))
    
    c_bbox = [int(cx - 130 * s), int(cy - 146 * s), int(cx + 130 * s), int(cy + 146 * s)]
    draw.arc(c_bbox, start=50, end=310, fill=WHITE, width=int(40 * s))
    
    sphere_center = (int(cx + 135 * s), int(cy - 60 * s))
    radius = int(32 * s)
    draw.ellipse([
        sphere_center[0] - radius, sphere_center[1] - radius,
        sphere_center[0] + radius, sphere_center[1] + radius
    ], fill=ORANGE)
    
    # Bottom brand text fallback
    # In PIL without Poppins ttf, let's draw clean geometric text or basic shapes
    return img

icon = create_icon(512, background=NAVY)
icon.save(os.path.join(ASSETS_DIR, "icon.png"), "PNG")

adaptive = create_icon(512, background=(0,0,0,0), is_adaptive=True)
adaptive.save(os.path.join(ASSETS_DIR, "adaptive-icon.png"), "PNG")

favicon = create_icon(128, background=NAVY)
favicon.save(os.path.join(ASSETS_DIR, "favicon.png"), "PNG")

splash = create_splash()
splash.save(os.path.join(ASSETS_DIR, "splash.png"), "PNG")

print("Generated all mobile assets successfully!")
