// Main app logic
(function schedule(fn){ (window.requestIdleCallback||window.requestAnimationFrame)(fn) })(() => {
  const dishes = document.querySelectorAll('.dish');
  if (!dishes.length) return;

  dishes.forEach((dish) => {
    const btn = dish.querySelector('.dish-btn');
    const tracklist = dish.querySelector('.tracklist');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Collapse others
      document.querySelectorAll('.dish.expanded .dish-btn[aria-expanded="true"]').forEach(b => {
        if (b !== btn) {
          b.setAttribute('aria-expanded', 'false');
          b.closest('.dish')?.classList.remove('expanded');
          const tl = b.closest('.dish')?.querySelector('.tracklist');
          if (tl) tl.hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      dish.classList.toggle('expanded', !expanded);
      if (tracklist) tracklist.hidden = expanded;
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dish.expanded .dish-btn').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.closest('.dish')?.classList.remove('expanded');
        const tl = btn.closest('.dish')?.querySelector('.tracklist');
        if (tl) tl.hidden = true;
      });
    }
  });
});
