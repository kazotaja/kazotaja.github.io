// Immediately hide all modals when the script loads
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.modal').forEach(function(modal) {
        modal.style.display = "none";
    });
});

// Track the order of modals
const modals = document.querySelectorAll('.modal');
let currentModalIndex = -1;

window.addEventListener('load', function() {
    const videoElement = document.getElementById('headerVideo');
    const sourceElement = videoElement.querySelector('source');

    if (videoElement && sourceElement) {
        const highResSrc = sourceElement.getAttribute('data-highres');
        if (highResSrc) {
            videoElement.addEventListener('loadeddata', () => {
                document.querySelector('.video-placeholder').style.display = 'none';
                videoElement.style.display = 'block';
                videoElement.classList.add('loaded');
            });

            // Load the high-res video
            sourceElement.src = highResSrc;
            videoElement.load();
        }
    }
});

// Helper function to open a modal by index
function openModalByIndex(index) {
    if (index >= 0 && index < modals.length) {
        if (currentModalIndex >= 0) {
            closeModal(modals[currentModalIndex].id);
        }
        modals[index].style.display = 'flex';
        document.body.classList.add('no-scroll');
        currentModalIndex = index;
    }
}

// Navigate to the next or previous modal
function navigateModal(direction) {
    const newIndex = (currentModalIndex + direction + modals.length) % modals.length;
    openModalByIndex(newIndex);
}

// Open and close modals
function openModal(modalId) {
    const modalIndex = Array.from(modals).findIndex(modal => modal.id === modalId);
    if (modalIndex !== -1) openModalByIndex(modalIndex);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
        currentModalIndex = -1;
    }
}

// Event listener setup after DOM is fully loaded
window.onload = function() {
    // Adding event listeners for the CV and Kontakt buttons
    const cvLink = document.getElementById('cv-link');
    const kontaktLink = document.getElementById('kontakt-link');

    if (cvLink) {
        cvLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('cv-modal');
        });
    }

    if (kontaktLink) {
        kontaktLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('kontakt-modal');
        });
    }

    // Close modal when clicking outside of modal content
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal(modal.id); // Close modal if clicking outside content
            }
        });
    });

    // Keyboard navigation for modals
    document.addEventListener('keydown', function(event) {
        if (currentModalIndex >= 0) {
            if (event.key === 'ArrowRight') {
                navigateModal(1); // Navigate to the next modal
            } else if (event.key === 'ArrowLeft') {
                navigateModal(-1); // Navigate to the previous modal
            } else if (event.key === 'Escape') {
                closeModal(modals[currentModalIndex].id); // Close the current modal
            }
        }
    });
};