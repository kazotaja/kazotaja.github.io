// Open Modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    document.body.classList.add('no-scroll'); // Prevent background scrolling
}

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.classList.remove('no-scroll'); // Allow background scrolling
}

// Ensure modals are hidden on load
window.onload = function() {
    // Hide all modals on page load
    document.querySelectorAll('.modal').forEach(function(modal) {
        modal.style.display = "none"; 
    });

    // Adding event listeners for the CV and Kontakt buttons
    document.getElementById('cv-link').addEventListener('click', function(e) {
        e.preventDefault();
        openModal('cv-modal');
    });

    document.getElementById('kontakt-link').addEventListener('click', function(e) {
        e.preventDefault();
        openModal('kontakt-modal');
    });

    // Close modal when clicking outside of modal content
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal(modal.id); // Close modal if clicking outside content
            }
        });
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(function(modal) {
                if (modal.style.display === 'flex') {
                    closeModal(modal.id);
                }
            });
        }
    });
};
