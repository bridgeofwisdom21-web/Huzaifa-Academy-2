/**
 * HUZAIFA ACADEMY - INTERACTIVE WEB APP ENGINE
 * Features: Live Video Filter, In-App Cinema Modal, Mystery Roulette,
 * Watch Later Local Storage, Instant Search, Smooth Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    theme: localStorage.getItem('huzaifa_theme') || 'dark',
    currentCategory: 'all',
    searchQuery: '',
    currentSort: 'newest',
    currentVideoId: null,
    watchLaterList: JSON.parse(localStorage.getItem('huzaifa_watch_later') || '[]'),
    filteredVideos: [...VIDEOS_DATA]
  };

  // Theme Elements
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeIconMobile = document.getElementById('theme-icon-mobile');
  const themeTextMobile = document.getElementById('theme-text-mobile');

  // DOM Elements
  const videoGrid = document.getElementById('video-grid');
  const resultsCount = document.getElementById('results-count');
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const sortSelect = document.getElementById('sort-select');
  const categoryPillsContainer = document.getElementById('category-pills');
  
  // Modal Elements
  const cinemaModal = document.getElementById('cinema-modal');
  const modalIframeWrap = document.getElementById('modal-iframe-wrap');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDuration = document.getElementById('modal-duration');
  const modalViews = document.getElementById('modal-views');
  const modalSynopsis = document.getElementById('modal-synopsis');
  const modalTags = document.getElementById('modal-tags');
  const modalYoutubeLink = document.getElementById('modal-youtube-link');
  const modalShareBtn = document.getElementById('modal-share-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Mobile Navigation
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Roulette Widget Elements
  const rouletteBtn = document.getElementById('roulette-btn');
  const rouletteDisplay = document.getElementById('roulette-display');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  function init() {
    initTheme();
    renderCategoryPills();
    renderFeaturedSpotlight();
    applyFilterAndSort();
    initScrollEffects();
    initMobileNav();
    initRoulette();
    initNewsletter();
    animateStatCounters();
  }

  // =========================================================================
  // THEME SWITCHER (DARK / LIGHT THEME)
  // =========================================================================
  function initTheme() {
    applyTheme(state.theme, false);

    themeToggleBtn?.addEventListener('click', toggleTheme);
    themeToggleMobile?.addEventListener('click', toggleTheme);
  }

  function toggleTheme() {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme, true);
  }

  function applyTheme(theme, showFeedback = false) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('huzaifa_theme', theme);

    if (theme === 'light') {
      if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
      if (themeToggleBtn) themeToggleBtn.title = 'Switch to Dark Mode';
      if (themeIconMobile) themeIconMobile.className = 'fa-solid fa-moon';
      if (themeTextMobile) themeTextMobile.textContent = 'Dark Mode';
      if (showFeedback) showToast('Light Theme activated', 'fa-sun');
    } else {
      if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
      if (themeToggleBtn) themeToggleBtn.title = 'Switch to Light Mode';
      if (themeIconMobile) themeIconMobile.className = 'fa-solid fa-sun';
      if (themeTextMobile) themeTextMobile.textContent = 'Light Mode';
      if (showFeedback) showToast('Dark Theme activated', 'fa-moon');
    }
  }

  // =========================================================================
  // CATEGORY PILLS RENDERING
  // =========================================================================
  function renderCategoryPills() {
    if (!categoryPillsContainer) return;
    categoryPillsContainer.innerHTML = '';

    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `cat-pill ${cat.id === state.currentCategory ? 'active' : ''}`;
      btn.setAttribute('data-category', cat.id);
      btn.innerHTML = `
        <i class="fa-solid ${cat.icon}"></i>
        <span>${cat.name}</span>
        <span class="cat-badge-count">${getCategoryCount(cat.id)}</span>
      `;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        state.currentCategory = cat.id;
        applyFilterAndSort();
      });

      categoryPillsContainer.appendChild(btn);
    });
  }

  function getCategoryCount(catId) {
    if (catId === 'all') return VIDEOS_DATA.length;
    return VIDEOS_DATA.filter(v => v.category === catId).length;
  }

  // =========================================================================
  // FEATURED SPOTLIGHT RENDERING
  // =========================================================================
  function renderFeaturedSpotlight() {
    const spotlightCard = document.getElementById('featured-spotlight-card');
    if (!spotlightCard) return;

    // Default to the first featured video (Stonehenge or Great Pyramid)
    const featured = VIDEOS_DATA.find(v => v.isFeatured) || VIDEOS_DATA[0];

    spotlightCard.innerHTML = `
      <div class="spotlight-header">
        <span class="spotlight-badge">
          <span class="pulse-dot"></span>
          Featured Documentary
        </span>
        <span style="font-size: 0.8rem; color: var(--secondary); font-weight: 700;">
          <i class="fa-solid fa-sparkles"></i> High Definition
        </span>
      </div>

      <div class="spotlight-thumb-wrap" id="spotlight-thumb-action">
        <img src="${featured.thumbnailHd}" alt="${featured.title}" class="spotlight-thumb" onerror="this.src='${featured.thumbnail}'">
        <div class="spotlight-play-btn" title="Watch Now">
          <i class="fa-solid fa-play"></i>
        </div>
        <span class="spotlight-duration"><i class="fa-regular fa-clock"></i> ${featured.duration}</span>
      </div>

      <div class="spotlight-info">
        <h3 class="spotlight-title">${featured.title}</h3>
        <p class="spotlight-desc">${featured.synopsis}</p>
        
        <div class="spotlight-footer">
          <div style="display:flex; align-items:center; gap:12px;">
            <span><i class="fa-solid fa-eye"></i> ${featured.viewsFormatted}</span>
            <span><i class="fa-solid fa-calendar-days"></i> ${featured.timeAgo}</span>
          </div>
          <div class="spotlight-watch-action" id="spotlight-watch-action">
            <span>Play Premiere</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      </div>
    `;

    const triggerPlay = () => openCinemaModal(featured.id);
    document.getElementById('spotlight-thumb-action')?.addEventListener('click', triggerPlay);
    document.getElementById('spotlight-watch-action')?.addEventListener('click', triggerPlay);
  }

  // =========================================================================
  // FILTER & SORT ENGINE
  // =========================================================================
  function applyFilterAndSort() {
    let result = [...VIDEOS_DATA];

    // 1. Category Filter
    if (state.currentCategory !== 'all') {
      result = result.filter(v => v.category === state.currentCategory);
    }

    // 2. Search Query Filter
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      result = result.filter(v => 
        v.title.toLowerCase().includes(q) ||
        v.synopsis.toLowerCase().includes(q) ||
        v.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // 3. Sorting
    switch (state.currentSort) {
      case 'newest':
        // Default list order is newest first
        break;
      case 'views':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'duration-desc':
        result.sort((a, b) => b.durationSec - a.durationSec);
        break;
      case 'duration-asc':
        result.sort((a, b) => a.durationSec - b.durationSec);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    state.filteredVideos = result;
    renderVideoGrid();
  }

  // =========================================================================
  // RENDER VIDEO GRID
  // =========================================================================
  function renderVideoGrid() {
    if (!videoGrid) return;
    videoGrid.innerHTML = '';

    if (resultsCount) {
      resultsCount.textContent = `Showing ${state.filteredVideos.length} of ${VIDEOS_DATA.length} Documentaries`;
    }

    if (state.filteredVideos.length === 0) {
      videoGrid.innerHTML = `
        <div class="no-results">
          <i class="fa-solid fa-compass"></i>
          <h3>No Documentaries Found</h3>
          <p>We couldn't find any videos matching "${escapeHtml(state.searchQuery)}". Try resetting your filters.</p>
          <button class="btn-secondary" id="reset-filters-btn">
            <i class="fa-solid fa-rotate-left"></i> Reset Search & Filters
          </button>
        </div>
      `;
      document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
        state.searchQuery = '';
        state.currentCategory = 'all';
        if (searchInput) searchInput.value = '';
        if (searchClearBtn) searchClearBtn.classList.remove('visible');
        renderCategoryPills();
        applyFilterAndSort();
      });
      return;
    }

    state.filteredVideos.forEach(video => {
      const isSaved = state.watchLaterList.includes(video.id);
      const card = document.createElement('article');
      card.className = 'video-card';
      card.setAttribute('data-id', video.id);

      card.innerHTML = `
        <div class="card-thumb-wrap" data-action="play">
          <img src="${video.thumbnailHd}" alt="${escapeHtml(video.title)}" class="card-thumb-img" loading="lazy" onerror="this.src='${video.thumbnail}'">
          <div class="card-play-overlay">
            <div class="card-play-icon">
              <i class="fa-solid fa-play"></i>
            </div>
          </div>
          <span class="card-badge-top ${video.badge.includes('POPULAR') ? 'badge-popular' : video.badge.includes('PREMIERE') ? 'badge-featured' : ''}">
            ${video.badge}
          </span>
          <span class="card-duration-badge">
            <i class="fa-regular fa-clock"></i> ${video.duration}
          </span>
        </div>

        <div class="card-body">
          <div class="card-meta-row">
            <span class="card-cat-tag"><i class="fa-solid fa-tag"></i> ${video.categoryLabel}</span>
            <span class="meta-dot"></span>
            <span><i class="fa-solid fa-eye"></i> ${video.viewsFormatted}</span>
            <span class="meta-dot"></span>
            <span>${video.timeAgo}</span>
          </div>

          <h3 class="card-title" data-action="play" title="${escapeHtml(video.title)}">
            ${escapeHtml(video.title)}
          </h3>

          <p class="card-synopsis">
            ${escapeHtml(video.synopsis)}
          </p>

          <div class="card-tags">
            ${video.tags.slice(0, 3).map(t => `<span class="tag-pill">#${escapeHtml(t)}</span>`).join('')}
          </div>

          <div class="card-footer">
            <button class="btn-card-watch" data-action="play">
              <i class="fa-solid fa-circle-play"></i> Watch Here
            </button>
            <div class="card-action-icons">
              <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener noreferrer" class="icon-btn" title="Open in YouTube">
                <i class="fa-brands fa-youtube" style="color: #ff0033;"></i>
              </a>
              <button class="icon-btn ${isSaved ? 'saved' : ''}" data-action="bookmark" title="${isSaved ? 'Remove from Watch Later' : 'Save to Watch Later'}">
                <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
              </button>
              <button class="icon-btn" data-action="share" title="Share Video">
                <i class="fa-solid fa-share-nodes"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      // Event Delegation on Card Actions
      card.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('[data-action]');
        if (!targetBtn) return;
        const action = targetBtn.getAttribute('data-action');

        if (action === 'play') {
          openCinemaModal(video.id);
        } else if (action === 'bookmark') {
          toggleWatchLater(video.id, targetBtn);
        } else if (action === 'share') {
          shareVideo(video);
        }
      });

      videoGrid.appendChild(card);
    });
  }

  // =========================================================================
  // CINEMA MODAL LOGIC
  // =========================================================================
  function openCinemaModal(videoId) {
    const video = VIDEOS_DATA.find(v => v.id === videoId);
    if (!video || !cinemaModal) return;

    state.currentVideoId = videoId;

    // Set YouTube Embed Player with Autoplay
    modalIframeWrap.innerHTML = `
      <iframe 
        src="https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1" 
        title="${escapeHtml(video.title)}" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    `;

    // Populate Video Details
    modalTitle.textContent = video.title;
    modalCategory.textContent = video.categoryLabel;
    modalDuration.innerHTML = `<i class="fa-regular fa-clock"></i> ${video.duration}`;
    modalViews.innerHTML = `<i class="fa-solid fa-eye"></i> ${video.viewsFormatted}`;
    modalSynopsis.textContent = video.synopsis;

    // Tags
    modalTags.innerHTML = video.tags.map(tag => `<span class="tag-pill">#${escapeHtml(tag)}</span>`).join('');

    // YouTube Direct Link
    modalYoutubeLink.href = `https://www.youtube.com/watch?v=${video.id}`;

    // Share action in modal
    modalShareBtn.onclick = () => shareVideo(video);

    // Show modal
    cinemaModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCinemaModal() {
    if (!cinemaModal) return;
    cinemaModal.classList.remove('open');
    modalIframeWrap.innerHTML = ''; // Stops playback immediately
    state.currentVideoId = null;
    document.body.style.overflow = '';
  }

  modalCloseBtn?.addEventListener('click', closeCinemaModal);
  cinemaModal?.addEventListener('click', (e) => {
    if (e.target === cinemaModal) closeCinemaModal();
  });

  // ESC Key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cinemaModal.classList.contains('open')) {
      closeCinemaModal();
    }
  });

  // =========================================================================
  // WATCH LATER / BOOKMARK SYSTEM
  // =========================================================================
  function toggleWatchLater(videoId, btnElement) {
    const index = state.watchLaterList.indexOf(videoId);
    let message = '';

    if (index === -1) {
      state.watchLaterList.push(videoId);
      message = 'Saved to your Watch Later list!';
      if (btnElement) {
        btnElement.classList.add('saved');
        btnElement.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
      }
    } else {
      state.watchLaterList.splice(index, 1);
      message = 'Removed from Watch Later';
      if (btnElement) {
        btnElement.classList.remove('saved');
        btnElement.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
      }
    }

    localStorage.setItem('huzaifa_watch_later', JSON.stringify(state.watchLaterList));
    showToast(message, 'fa-bookmark');
  }

  // =========================================================================
  // SHARE VIDEO LOGIC
  // =========================================================================
  function shareVideo(video) {
    const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Watch "${video.title}" on Huzaifa Academy YouTube Channel:`,
        url: videoUrl
      }).catch(() => copyToClipboard(videoUrl));
    } else {
      copyToClipboard(videoUrl);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Video link copied to clipboard!', 'fa-link');
    }).catch(() => {
      prompt('Copy this link:', text);
    });
  }

  // =========================================================================
  // MYSTERY ROULETTE / "WHAT TO WATCH" WIDGET
  // =========================================================================
  function initRoulette() {
    if (!rouletteBtn || !rouletteDisplay) return;

    rouletteBtn.addEventListener('click', () => {
      rouletteBtn.disabled = true;
      rouletteDisplay.innerHTML = `
        <div class="roulette-placeholder">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 3rem; color: var(--secondary);"></i>
          <h4 style="margin-top: 14px; font-size: 1.2rem;">Searching Enigmas...</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Consulting the archives of world mysteries</p>
        </div>
      `;

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * VIDEOS_DATA.length);
        const picked = VIDEOS_DATA[randomIndex];

        rouletteDisplay.innerHTML = `
          <div style="display: flex; gap: 18px; align-items: center;">
            <div style="width: 140px; aspect-ratio: 16/9; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0;">
              <img src="${picked.thumbnail}" alt="${escapeHtml(picked.title)}" style="width:100%; height:100%; object-fit: cover;">
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--secondary); font-weight: 700; text-transform: uppercase;">
                ${picked.categoryLabel} • ${picked.duration}
              </span>
              <h4 style="font-size: 1.05rem; margin: 4px 0 6px; color: #fff;">${picked.title}</h4>
              <p style="font-size: 0.82rem; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${picked.synopsis}
              </p>
            </div>
          </div>
          <div style="display: flex; gap: 12px; margin-top: 14px;">
            <button class="btn-primary" style="padding: 10px 20px; font-size: 0.88rem;" id="roulette-play-btn">
              <i class="fa-solid fa-play"></i> Watch Now
            </button>
            <button class="btn-secondary" style="padding: 10px 18px; font-size: 0.88rem;" id="roulette-spin-again">
              <i class="fa-solid fa-shuffle"></i> Spin Another
            </button>
          </div>
        `;

        document.getElementById('roulette-play-btn')?.addEventListener('click', () => {
          openCinemaModal(picked.id);
        });

        document.getElementById('roulette-spin-again')?.addEventListener('click', () => {
          rouletteBtn.click();
        });

        rouletteBtn.disabled = false;
        showToast(`Mystery Unlocked: ${picked.categoryLabel}!`, 'fa-dice');
      }, 700);
    });
  }

  // =========================================================================
  // SEARCH & SORT EVENT HANDLERS
  // =========================================================================
  searchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (state.searchQuery.length > 0) {
      searchClearBtn?.classList.add('visible');
    } else {
      searchClearBtn?.classList.remove('visible');
    }
    applyFilterAndSort();
  });

  searchClearBtn?.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    searchClearBtn.classList.remove('visible');
    applyFilterAndSort();
  });

  sortSelect?.addEventListener('change', (e) => {
    state.currentSort = e.target.value;
    applyFilterAndSort();
  });

  // =========================================================================
  // SCROLL & NAVBAR DYNAMICS
  // =========================================================================
  function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    });
  }

  // =========================================================================
  // MOBILE NAVIGATION
  // =========================================================================
  function initMobileNav() {
    const openMenu = () => {
      mobileNav?.classList.add('open');
      drawerBackdrop?.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileNav?.classList.remove('open');
      drawerBackdrop?.classList.remove('active');
      document.body.style.overflow = '';
    };

    menuToggle?.addEventListener('click', openMenu);
    mobileNavClose?.addEventListener('click', closeMenu);
    drawerBackdrop?.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // =========================================================================
  // NEWSLETTER & SUBSCRIBER NOTIFICATION
  // =========================================================================
  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const email = emailInput?.value.trim();

      if (email && email.includes('@')) {
        showToast('Welcome aboard! You will be notified of new documentaries.', 'fa-bell');
        emailInput.value = '';
      }
    });
  }

  // =========================================================================
  // STAT COUNTER ANIMATION
  // =========================================================================
  function animateStatCounters() {
    const statCards = document.querySelectorAll('.stat-number[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = Math.ceil(target / 40);

          const timer = setInterval(() => {
            count += speed;
            if (count >= target) {
              el.textContent = target + suffix;
              clearInterval(timer);
            } else {
              el.textContent = count + suffix;
            }
          }, 30);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statCards.forEach(card => observer.observe(card));
  }

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================
  function showToast(message, iconClass = 'fa-circle-check') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${iconClass}" style="color: var(--secondary);"></i> <span>${escapeHtml(message)}</span>`;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Helper utility
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Start app
  init();
});
