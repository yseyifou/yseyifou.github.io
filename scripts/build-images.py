#!/usr/bin/env python3
"""
build-images.py — optimise les images du site.

Usage:
    python3 scripts/build-images.py

Entrée:  images/fond.jpg  (4320×2182, ~820 Ko)
Sorties: images/fond.webp (1920 px de large, ~100 Ko)
         images/fond.jpg  (1920 px de large, qualité 78, progressif)
"""
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow est requis: pip install Pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "images", "fond.jpg")
WEBP = os.path.join(ROOT, "images", "fond.webp")
JPG = os.path.join(ROOT, "images", "fond.jpg")

WIDTH = 1920

if not os.path.exists(SRC):
    sys.exit(f"Source introuvable: {SRC}")

img = Image.open(SRC)
print(f"Source: {img.size[0]}×{img.size[1]}")

# Redimensionner
ratio = WIDTH / img.size[0]
new_h = round(img.size[1] * ratio)
img = img.resize((WIDTH, new_h), Image.LANCZOS)
print(f"Redimensionné: {WIDTH}×{new_h}")

# WebP
img.save(WEBP, "WEBP", quality=82, method=6)
print(f"WebP: {os.path.getsize(WEBP) // 1024} Ko → {WEBP}")

# JPEG progressif
img.save(JPG, "JPEG", quality=78, progressive=True, optimize=True)
print(f"JPEG: {os.path.getsize(JPG) // 1024} Ko → {JPG}")
