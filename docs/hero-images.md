# Hero images

Place hero/profile images in `assets/images/hero/`. Supported formats are AVIF, GIF, JPEG, PNG, and WebP. Use one image file per slide; responsive-size variants of the same photo would appear as separate slides.

The Vercel build runs `scripts/generate-hero-manifest.mjs` automatically and scans this directory, so no image list needs to be edited. After adding an image, deploy the site; it will be included in the cycle when the deployed page is loaded. The portraits rotate on an approximately 5.4-second cycle: a 4.5-second hold followed by a 900ms cinematic depth-morph transition paired with a specular glass light sweep. The frame features continuous ambient levitation, an ethereal breathing aura, and a counter-drifting accent ring, with hover-to-pause interaction. Visitors who prefer reduced motion see an instant/gentle 220ms crossfade without motion or blur.
