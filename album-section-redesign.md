# Album Section Redesign Plan

## Overview
Transform the current album section from a space-consuming, disjointed layout to a more efficient, centered side-scrolling carousel with track information displayed below the selected album.

## Current Issues
- Albums take up too much vertical space
- Layout feels disjointed
- Albums only get bigger when clicked but don't provide informative interaction
- Track information is overlaid on the album art, obscuring the artwork

## Redesign Goals
- Create a centered, horizontally-scrollable album carousel
- Display track information below the selected album instead of overlaid
- Maintain the laboratory/petri dish theme while improving space efficiency
- Implement smooth animations for a cohesive user experience

## Implementation Plan

### 1. HTML Structure Changes

```html
<section id="albums" aria-label="Album Laboratory">
  <h2>The Lab</h2>
  
  <!-- Album Carousel Container -->
  <div class="carousel-container">
    <!-- Optional Navigation Buttons -->
    <button class="carousel-nav prev" aria-label="Previous album">◀</button>
    <button class="carousel-nav next" aria-label="Next album">▶</button>
    
    <!-- Album List - Modified from current structure -->
    <ul class="albums-carousel" role="list">
      <!-- Each album item structure remains similar but with modified behavior -->
      <li class="dish" data-album-id="liquid-culture" data-palette-primary="#8B7355" data-palette-secondary="#D4C5B9" data-glow="#ffffff">
        <button class="dish-btn" aria-expanded="false" aria-controls="liquid-culture-details">
          <!-- Existing visual elements remain -->
          <div class="dish-glass" aria-hidden="true"></div>
          <img class="cover" src="assets/album-art/liquid-culture.webp" alt="Liquid Culture album cover" loading="lazy" decoding="async">
          <div class="colony" aria-hidden="true" data-growth-state="dormant"></div>
          <div class="gills-overlay" aria-hidden="true"></div>
          <div class="label" aria-hidden="true">
            <span class="title">Liquid Culture</span>
            <span class="year">2025</span>
          </div>
        </button>
      </li>
      <!-- Repeat for other albums -->
    </ul>
  </div>
  
  <!-- NEW: Album Details Section (Initially Hidden) -->
  <div class="album-details-container">
    <div id="liquid-culture-details" class="album-details" hidden>
      <div class="album-info">
        <h3>Liquid Culture</h3>
        <span class="year">2025</span>
        
        <!-- Quick Actions (moved from label) -->
        <div class="quick-actions">
          <button class="action play-btn" aria-label="Play Liquid Culture">
            <span class="icon">▶</span>
          </button>
          <a href="https://sclerotia.bandcamp.com/album/liquid-culture" target="_blank" rel="noopener" class="action" aria-label="Listen on Bandcamp">
            <span class="icon">BC</span>
          </a>
          <a href="https://open.spotify.com/album/liquid-culture" target="_blank" rel="noopener" class="action" aria-label="Listen on Spotify">
            <span class="icon">SP</span>
          </a>
        </div>
      </div>
      
      <!-- Tracklist (moved from overlay) -->
      <div class="tracklist">
        <ol>
          <li>There Go My Ego — 3:34</li>
          <li>Wannabe Wook — 3:49</li>
          <li>Fentanyl Fight Club — 3:51</li>
          <!-- other tracks -->
        </ol>
      </div>
    </div>
    
    <!-- Repeat for other albums -->
    <div id="fruiting-bodies-details" class="album-details" hidden>
      <!-- Similar structure for other albums -->
    </div>
  </div>
</section>
```

### 2. CSS Modifications

```css
/* Updated Album Section Styling */
#albums {
  position: relative;
  z-index: 5;
  padding: 2em 0 3em; /* Reduced padding */
  /* Keep existing background styles */
}

/* Carousel Container */
.carousel-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto 2em; /* Center horizontally with bottom margin */
  padding: 0 3em; /* Space for navigation buttons */
}

/* Carousel Navigation */
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: var(--color-white);
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all var(--transition-fast) ease;
}

.carousel-nav.prev { left: 0; }
.carousel-nav.next { right: 0; }

.carousel-nav:hover,
.carousel-nav:focus-visible {
  background: rgba(255,255,255,0.2);
}

/* Updated Albums List */
.albums-carousel {
  display: flex;
  justify-content: center; /* Center the albums */
  gap: 2em; /* Reduced from 3em */
  overflow-x: auto;
  overflow-y: visible;
  padding: 2em 1em; /* Reduced padding */
  margin: 0;
  list-style: none;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Adjust Petri Dish Size */
.dish-btn {
  width: calc(var(--dish-size) * 0.8); /* Make dishes smaller */
  height: calc(var(--dish-size) * 0.8);
  /* Keep other styles */
}

/* Updated for Active State */
.dish.active .dish-btn {
  transform: translateY(-10px) scale(1.1); /* Slight lift and scale instead of large expansion */
  z-index: var(--z-expanded);
}

/* New Album Details Container */
.album-details-container {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(0,0,0,0.5);
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
  transition: max-height var(--transition-medium) ease, 
              opacity var(--transition-medium) ease;
  max-height: 0;
  opacity: 0;
}

.album-details-container.visible {
  max-height: 500px; /* Adjust based on content */
  opacity: 1;
}

/* Album Details Styling */
.album-details {
  display: flex;
  flex-direction: column;
  padding: 1.5em;
  color: var(--color-white);
}

.album-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1em;
  margin-bottom: 1em;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 1em;
}

.album-info h3 {
  margin: 0;
  font-size: 1.5em;
}

.album-info .year {
  opacity: 0.7;
}

/* Tracklist Styling */
.album-details .tracklist {
  opacity: 1;
  pointer-events: auto;
  position: relative;
  inset: auto;
  background: transparent;
  overflow: visible;
  mask-image: none;
  -webkit-mask-image: none;
}

.album-details .tracklist ol {
  padding: 0 0 0 1.5em;
  list-style-position: outside;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .albums-carousel {
    justify-content: flex-start; /* Left align on small screens */
  }
  
  .dish-btn {
    width: calc(var(--dish-size) * 0.7); /* Even smaller on mobile */
    height: calc(var(--dish-size) * 0.7);
  }
  
  .album-details {
    padding: 1em;
  }
}
```

### 3. JavaScript Updates

```javascript
// Main app logic for album interaction
(function schedule(fn){ (window.requestIdleCallback||window.requestAnimationFrame)(fn) })(() => {
  const dishes = document.querySelectorAll('.dish');
  const detailsContainer = document.querySelector('.album-details-container');
  if (!dishes.length) return;

  // Optional: Add carousel navigation
  const carouselNav = document.querySelectorAll('.carousel-nav');
  const albumsCarousel = document.querySelector('.albums-carousel');
  
  if (carouselNav && albumsCarousel) {
    const scrollAmount = 320; // Approximate dish width + gap
    
    carouselNav.forEach(nav => {
      nav.addEventListener('click', () => {
        const direction = nav.classList.contains('prev') ? -1 : 1;
        albumsCarousel.scrollBy({ 
          left: direction * scrollAmount, 
          behavior: 'smooth' 
        });
      });
    });
  }

  // Handle dish clicks
  dishes.forEach((dish) => {
    const btn = dish.querySelector('.dish-btn');
    const albumId = dish.dataset.albumId;
    const detailsPanel = document.getElementById(`${albumId}-details`);
    
    if (!btn || !detailsPanel) return;

    btn.addEventListener('click', (e) => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      
      // Reset all dishes
      document.querySelectorAll('.dish').forEach(d => {
        d.classList.remove('active');
        const b = d.querySelector('.dish-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      
      // Hide all details panels
      document.querySelectorAll('.album-details').forEach(panel => {
        panel.hidden = true;
      });

      if (!expanded) {
        // Activate current dish
        dish.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        
        // Show details container and current album details
        detailsContainer.classList.add('visible');
        detailsPanel.hidden = false;
        
        // Ensure the selected dish is visible in the carousel
        dish.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        // Hide details container when clicking the active dish again
        detailsContainer.classList.remove('visible');
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Reset all dishes
      document.querySelectorAll('.dish').forEach(dish => {
        dish.classList.remove('active');
        const btn = dish.querySelector('.dish-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      
      // Hide details container
      if (detailsContainer) {
        detailsContainer.classList.remove('visible');
      }
    }
  });
});
```

## Implementation Steps

1. Back up the current files (HTML, CSS, and JS)
2. Update the HTML structure to support the new carousel and details layout
3. Modify the CSS to style the new components and adjust sizing
4. Update the JavaScript to handle the new interaction model
5. Test thoroughly across different screen sizes
6. Make adjustments based on feedback

## Expected Benefits

- More space-efficient display of albums
- Better information architecture with tracks displayed below
- Improved user experience with clearer interaction model
- Maintained visual theme while enhancing usability