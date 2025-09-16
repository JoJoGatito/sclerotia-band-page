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
      
      // Handle click on album
      
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
        if (detailsContainer) detailsContainer.classList.add('visible');
        if (detailsPanel) {
          detailsPanel.hidden = false;
        }
        
        // Ensure the selected dish is visible in the carousel
        dish.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        // Hide details container when clicking the active dish again
        if (detailsContainer) detailsContainer.classList.remove('visible');
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
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
      
      // Hide the container
      if (detailsContainer) detailsContainer.classList.remove('visible');
    }
  });
  
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
});
