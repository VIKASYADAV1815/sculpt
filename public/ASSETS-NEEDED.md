# Required Assets

This project requires the following assets to be placed in the `/public` folder:

## Images (7 files)

### Hero Section
- **plaster.png** - Plain plaster texture (top layer for reveal effect)
- **relief.png** - Carved relief texture (revealed underneath)

### Portfolio Works
- **work1.jpg** - Vesper Wing (plaster relief artwork)
- **work2.jpg** - Rose Ledger (plaster relief artwork)
- **work3.jpg** - Quiet Profile (plaster relief artwork)
- **work4.jpg** - Crown Fragment (plaster relief artwork)

### Video
- **relief-film.mp4** - Video showing light moving across plaster relief (24fps recommended)

## Image Specifications

### Recommended Dimensions
- **plaster.png & relief.png**: 1920×1080px or larger (same dimensions for both)
- **work1.jpg through work4.jpg**: 1200×1600px (portrait orientation) or similar high-resolution images
- **relief-film.mp4**: 1920×1080px, H.264 codec, 24fps

### Format Requirements
- **Images**: PNG (for plaster/relief) or JPG (for works)
- **Video**: MP4 with H.264 codec for broad browser compatibility

## Where to Place Files

All files should be placed directly in the `/public` folder:

```
relief-frontend/
  public/
    plaster.png
    relief.png
    work1.jpg
    work2.jpg
    work3.jpg
    work4.jpg
    relief-film.mp4
    favicon.ico (optional)
```

## Note

The project is configured to load these assets from the root path (e.g., `/plaster.png`). 
Make sure filenames match exactly as listed above.

If you don't have these assets yet, you can:
1. Use placeholder images temporarily
2. Generate them using AI image tools
3. Source royalty-free plaster/relief textures online
