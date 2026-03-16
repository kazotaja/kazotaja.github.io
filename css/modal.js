document.addEventListener('DOMContentLoaded', () => {
  const modals = Array.from(document.querySelectorAll('.modal'));
  const overlay = document.getElementById('modal-overlay');
  const body = document.body;
  const video = document.getElementById('headerVideo');
  const placeholder = document.querySelector('.video-placeholder');

  const videoToggle = document.getElementById('video-toggle');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');

  let currentModalIndex = -1;

  // Hide all modals on boot
  modals.forEach(modal => {
    modal.style.display = 'none';
  });

  if (overlay) {
    overlay.style.display = 'none';
  }

  function showOverlay(show) {
    if (!overlay) return;
    overlay.style.display = show ? 'block' : 'none';
  }

  function lockScroll(lock) {
    body.classList.toggle('no-scroll', lock);
  }

  function updateVideoIcon() {
    if (!video || !videoToggle || !playIcon || !pauseIcon) return;

    if (video.paused) {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      videoToggle.setAttribute('aria-label', 'Play background video');
      videoToggle.setAttribute('title', 'Play background video');
    } else {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      videoToggle.setAttribute('aria-label', 'Pause background video');
      videoToggle.setAttribute('title', 'Pause background video');
    }
  }

  function pauseHeroVideo() {
    if (video && !video.paused) {
      video.pause();
      updateVideoIcon();
    }
  }

  function resumeHeroVideo() {
    if (video && video.dataset.loaded === 'true') {
      video.play().catch(() => {});
      updateVideoIcon();
    }
  }

  function loadModalIframes(modal) {
    if (!modal) return;

    modal.querySelectorAll('iframe[data-src]').forEach(frame => {
      if (frame.src) return;

      frame.addEventListener('error', () => {
        frame.src = 'content/content_missing.html';
      }, { once: true });

      frame.src = frame.dataset.src;
    });
  }

  function findModalIndexById(modalId) {
    return modals.findIndex(modal => modal.id === modalId);
  }

  function openModalByIndex(index) {
    if (index < 0 || index >= modals.length) return;

    if (currentModalIndex >= 0 && modals[currentModalIndex]) {
      modals[currentModalIndex].style.display = 'none';
    }

    const modal = modals[index];
    loadModalIframes(modal);
    pauseHeroVideo();

    modal.style.display = 'flex';
    showOverlay(true);
    lockScroll(true);
    currentModalIndex = index;
  }

  function closeCurrentModal() {
    if (currentModalIndex < 0) return;

    const modal = modals[currentModalIndex];
    if (modal) {
      modal.style.display = 'none';
    }

    showOverlay(false);
    lockScroll(false);
    currentModalIndex = -1;
    resumeHeroVideo();
  }

  function navigateModal(direction) {
    if (currentModalIndex < 0 || modals.length === 0) return;
    const newIndex = (currentModalIndex + direction + modals.length) % modals.length;
    openModalByIndex(newIndex);
  }

  // Expose globally for inline onclick handlers in HTML
  window.openModal = function (modalId) {
    const index = findModalIndexById(modalId);
    if (index !== -1) {
      openModalByIndex(index);
    }
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.style.display = 'none';
    showOverlay(false);
    lockScroll(false);
    currentModalIndex = -1;
    resumeHeroVideo();
  };

  // Header buttons
  const cvLink = document.getElementById('cv-link');
  const kontaktLink = document.getElementById('kontakt-link');

  if (cvLink) {
    cvLink.addEventListener('click', e => {
      e.preventDefault();
      window.openModal('cv-modal');
    });
  }

  if (kontaktLink) {
    kontaktLink.addEventListener('click', e => {
      e.preventDefault();
      window.openModal('kontakt-modal');
    });
  }

  // Tiny video play/pause button
  if (videoToggle && video) {
    videoToggle.addEventListener('click', () => {
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }

      updateVideoIcon();
    });
  }

  // Click outside modal-content closes modal
  modals.forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        window.closeModal(modal.id);
      }
    });
  });

  if (overlay) {
    overlay.addEventListener('click', closeCurrentModal);
  }

  document.addEventListener('keydown', event => {
    if (currentModalIndex < 0) return;

    if (event.key === 'ArrowRight') {
      navigateModal(1);
    } else if (event.key === 'ArrowLeft') {
      navigateModal(-1);
    } else if (event.key === 'Escape') {
      closeCurrentModal();
    }
  });

  // Lazy-load hero video after page load / idle
  function loadHeroVideo() {
    if (!video || video.dataset.loaded === 'true') return;

    const sources = video.querySelectorAll('source[data-src]');
    if (!sources.length) return;

    sources.forEach(source => {
      source.src = source.dataset.src;
    });

    video.dataset.loaded = 'true';

    video.addEventListener('loadeddata', () => {
      if (placeholder) {
        placeholder.style.opacity = '0';
      }

      video.classList.add('loaded');
      video.play().catch(() => {});
      updateVideoIcon();

      setTimeout(() => {
        if (placeholder) {
          placeholder.style.display = 'none';
        }
      }, 350);
    }, { once: true });

    video.load();
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadHeroVideo, { timeout: 1500 });
  } else {
    window.addEventListener('load', loadHeroVideo, { once: true });
  }
});