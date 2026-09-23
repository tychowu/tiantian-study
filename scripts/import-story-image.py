"""Losslessly preserve dimensions while encoding generated scene assets as WebP."""
import sys
from pathlib import Path
from PIL import Image

source, target = map(Path, sys.argv[1:3])
target.parent.mkdir(parents=True, exist_ok=True)
with Image.open(source) as image:
    image.save(target, "WEBP", quality=85, method=6)
    print(f"{target.name}: {image.width}x{image.height}, {target.stat().st_size} bytes")
