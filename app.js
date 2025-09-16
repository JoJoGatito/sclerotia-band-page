// Main app logic for album interaction
(function schedule(fn){ (window.requestIdleCallback||window.requestAnimationFrame)(fn) })(() => {
  const dishes = document.querySelectorAll('.dish');
  const detailsContainer = document.querySelector('.album-details-container');
  
  if (!dishes.length) return;

  dishes.forEach((dish) => {
    const btn = dish.querySelector('.dish-btn');
    const albumId = dish.dataset.albumId;
    if (!btn) return;
    
    // Get the corresponding details panel using aria-controls
    const detailsId = btn.getAttribute('aria-controls');
    const detailsPanel = document.getElementById(detailsId);

    btn.addEventListener('click', (e) => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const receipt = dish.querySelector('.tracklist-receipt');
      
      // Handle click on album
      
      // Reset all dishes
      document.querySelectorAll('.dish').forEach(d => {
        d.classList.remove('active');
        const b = d.querySelector('.dish-btn');
        const r = d.querySelector('.tracklist-receipt');
        if (b) b.setAttribute('aria-expanded', 'false');
        if (r) r.setAttribute('aria-hidden', 'true');
      });

      // Hide all details panels (keep for backward compatibility)
      document.querySelectorAll('.album-details').forEach(panel => {
        panel.hidden = true;
      });

      if (!expanded) {
        // Activate current dish
        dish.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        
        // Show receipt tracklist
        if (receipt) {
          receipt.setAttribute('aria-hidden', 'false');
          // Move focus to the region for accessibility
          const focusable = receipt.querySelector('.receipt-title') || receipt;
          if (focusable && focusable.focus) focusable.focus({ preventScroll: true });

        }
        
        // Hide the old details container (we're using receipt now)
        if (detailsContainer) detailsContainer.classList.remove('visible');
        
        // Ensure the selected dish is visible
        dish.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        // Clicking active dish again closes it
        dish.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        if (receipt) {
          receipt.setAttribute('aria-hidden', 'true');
        }
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllReceipts();
    }
  });

  // Click outside to close any open receipt
  document.addEventListener('click', (e) => {
    const clickedInsideDish = e.target.closest && e.target.closest('.dish');
    if (!clickedInsideDish) {
      closeAllReceipts();
    }
  }, true);

  function closeAllReceipts() {
    // Reset all dishes
    document.querySelectorAll('.dish').forEach(d => {
      d.classList.remove('active');
      const b = d.querySelector('.dish-btn');
      const r = d.querySelector('.tracklist-receipt');
      if (b) b.setAttribute('aria-expanded', 'false');
      if (r) r.setAttribute('aria-hidden', 'true');
    });

    // Hide all details panels
    document.querySelectorAll('.album-details').forEach(panel => {
      panel.hidden = true;
    });

    // Hide the container
    if (detailsContainer) detailsContainer.classList.remove('visible');
  }
  
  // Set up carousel navigation
  const carouselNav = document.querySelectorAll('.carousel-nav');
  const albumsCarousel = document.querySelector('.albums-carousel');
  
  if (carouselNav.length && albumsCarousel) {
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

  // Wire up play buttons for Bandcamp embed
  document.querySelectorAll('.dish').forEach(dish => {
    const receipt = dish.querySelector('.tracklist-receipt');
    if (!receipt) return;
    const ds = receipt.dataset;
    const albumId = ds.bandcampAlbumId;
    const bgcol = ds.bandcampBgcol || '333333';
    const linkcol = ds.bandcampLinkcol || 'e32c14';
    const minimal = (ds.bandcampMinimal || '').toLowerCase() === 'true';
    const embedHeight = parseInt(ds.bandcampEmbedHeight || '238', 10);

    const playBtn = receipt.querySelector('.play-btn');
    const embed = receipt.querySelector('.receipt-embed');
    if (!playBtn || !embed) return;

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // don't close the receipt
      const isOpen = !embed.hasAttribute('hidden');
      if (!isOpen) {
        if (albumId) {
          const parts = [
            `album=${albumId}`,
            'size=large',
            `bgcol=${bgcol}`,
            `linkcol=${linkcol}`,
            minimal ? 'minimal=true' : null,
            'transparent=true',
            'autoplay=true',
            'track=1'
          ].filter(Boolean);
          const src = `https://bandcamp.com/EmbeddedPlayer/${parts.join('/')}/`;
          // Let CSS control final size and keep square
          embed.innerHTML = `<iframe style=\"border:0; width:100%; height:100%;\" src=\"${src}\" seamless><a href=\"#\">Bandcamp Player</a></iframe>`;
        } else {
          embed.innerHTML = '<div style=\"padding:0.75em; font-size:0.9em; opacity:0.7;\">No Bandcamp player available.</div>';
        }
        embed.removeAttribute('hidden');
        playBtn.setAttribute('aria-pressed', 'true');
      } else {
        embed.setAttribute('hidden', '');
        embed.innerHTML = '';
        playBtn.setAttribute('aria-pressed', 'false');
      }
    });
  });
});
