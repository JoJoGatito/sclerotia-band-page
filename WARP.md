# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Design Theme: Mold/Lichen/Mushroom Aesthetic

This website follows a strict fungal/organic theme inspired by molds, lichens, and mushrooms. When making any additions or modifications:

### Visual Design Principles
- **Organic Shapes**: Avoid perfect geometric shapes. Use irregular borders, asymmetric border-radius values, and blob-like forms
- **Color Palette**: Stick to earthy, fungal colors:
  - `#8B7355` (dark mushroom brown)
  - `#D4C5B9` (light spore beige)
  - `#fff` for contrast/glow effects
  - Black backgrounds to simulate dark forest floor
- **Animations**: All animations should feel organic and alive:
  - Pulsing/breathing effects
  - Slow drifting movements
  - Growth and decay cycles
  - Particle effects resembling spores
- **Typography**: Uses custom "Mushroom" font (in assets/fonts/) for thematic consistency

### Interactive Elements
- Hover effects should simulate organic reactions (growing, glowing, releasing spores)
- Transitions should be smooth and natural, never mechanical
- Consider adding subtle random variations to make elements feel alive

### Background
- The slime mold animation (slime_mold.js) is central to the theme
- Keep it as the primary background element
- Any additional visual elements should complement, not compete with it

## High-level code architecture and structure

This is a simple static website for a band called "Sclerotia" with an animated slime mold background.

### Files
- `index.html`: The main HTML file for the website. Contains the canvas element for the slime mold animation and basic site structure.
- `style.css`: The stylesheet for the website. Positions the canvas as a fixed background behind the main content.
- `app.js`: Contains the main application logic.
- `slime_mold.js`: Contains the slime mold animation logic using the SAT.js collision library and Underscore.js utilities.

### External Dependencies
The site uses two CDN-hosted libraries for the slime mold animation:
- SAT.js (0.8.0): Collision detection library
- Underscore.js (1.11.0): Utility functions

## Development

To run the website locally, you can open the `index.html` file in your browser.

For local development with a web server:
```bash
python3 -m http.server 8000
```
Then navigate to http://localhost:8000
