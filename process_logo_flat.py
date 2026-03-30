import cv2
import numpy as np
import vtracer

def process():
    print("Reading logo_cleaned.png...", flush=True)
    img = cv2.imread("logo_cleaned.png", cv2.IMREAD_UNCHANGED)
    
    if img is None:
        print("Failed to read logo_cleaned.png", flush=True)
        return
        
    print(f"Original shape: {img.shape}", flush=True)
    
    # Make sure it's 4 channels
    if len(img.shape) == 2 or img.shape[2] != 4:
        print("Image does not have an alpha channel, converting.", flush=True)
        if len(img.shape) == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)
        elif img.shape[2] == 3:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

    # We want to make all non-transparent pixels a single flat color.
    # We will use solid black (BGR: 0, 0, 0)
    img[:, :, 0:3] = 0
    
    # Save the flat color image
    flat_png_path = "logo_flat.png"
    cv2.imwrite(flat_png_path, img)
    print(f"Saved {flat_png_path}", flush=True)
    
    # Vectorize it to SVG
    flat_svg_path = "logo_flat.svg"
    print("Tracing to SVG with vtracer...", flush=True)
    vtracer.convert_image_to_svg_py(
        image_path=flat_png_path,
        out_path=flat_svg_path,
        colormode='binary' # use binary for flat color
    )
    print(f"Done! SVG saved to {flat_svg_path}", flush=True)

if __name__ == '__main__':
    process()
