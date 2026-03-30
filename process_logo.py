import cv2
import numpy as np
import vtracer
import sys

def process():
    print("Reading logo.png...", flush=True)
    img = cv2.imread("logo.png", cv2.IMREAD_UNCHANGED)
    
    if img is None:
        print("Failed to read logo.png", flush=True)
        return
        
    print(f"Original shape: {img.shape}", flush=True)
    
    if len(img.shape) == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)
    elif img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
        
    # We will assume that nearly white pixels are the background, IF the edges touch white.
    # Actually, simpler: make anything close to white transparent.
    # BGRA order
    lower_white = np.array([240, 240, 240, 0], dtype=np.uint8)
    upper_white = np.array([255, 255, 255, 255], dtype=np.uint8)
    white_mask = cv2.inRange(img, lower_white, upper_white)
    img[white_mask == 255] = [0, 0, 0, 0]
    
    print("Background removed. Removing text...", flush=True)
    
    alpha_channel = img[:, :, 3]
    y_coords, x_coords = np.nonzero(alpha_channel)
    if len(y_coords) == 0:
        print("Image is entirely empty?", flush=True)
        return
        
    min_y, max_y = np.min(y_coords), np.max(y_coords)
    height = max_y - min_y
    
    row_sums = np.sum(alpha_channel > 0, axis=1)
    gap_y = None
    # Looking from bottom up for an empty row
    for y in range(max_y, min_y + height // 2, -1):
        if row_sums[y] < 5:
            gap_y = y
            print(f"Found gap at y={y}", flush=True)
            break
            
    if gap_y is not None:
        img[gap_y:, :, :] = 0
    else:
        # We couldn't find a clean gap. The text might be very close to the logo.
        # But looking at the logo from memory, "ART CIRCLE" is quite clearly below the logo.
        # Let's just cut the bottom 25% of the bounding box
        cut_y = max_y - int(height * 0.25)
        img[cut_y:, :, :] = 0
        print(f"No gap found, cutting manually below y={cut_y}", flush=True)
        
    cv2.imwrite("logo_cleaned.png", img)
    print("Saved logo_cleaned.png", flush=True)
    
    print("Tracing to SVG with vtracer...", flush=True)
    vtracer.convert_image_to_svg_py(
        image_path="logo_cleaned.png",
        out_path="logo.svg"
    )
    print("Done! SVG saved to logo.svg", flush=True)

if __name__ == '__main__':
    process()
