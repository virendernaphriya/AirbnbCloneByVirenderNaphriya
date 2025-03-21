// Filter Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterBoxBtn = document.getElementById('filterBoxBtn');
    const filterPopup = document.getElementById('filterPopup');
    const closePopupBtn = document.querySelector('.close-filter-popup');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const applyFiltersBtn = document.querySelector('.apply-filters');
    const navbar = document.querySelector('nav');

    // Check if elements exist before adding event listeners
    if (filterBoxBtn) {
        // Open popup when filter box is clicked
        filterBoxBtn.addEventListener('click', () => {
            if (navbar) navbar.style.zIndex = '-1';
            if (filterPopup) filterPopup.classList.add('show');
        });
    }

    if (closePopupBtn) {
        // Close popup when close button is clicked
        closePopupBtn.addEventListener('click', () => {
            if (filterPopup) filterPopup.classList.remove('show');
            if (navbar) navbar.style.zIndex = '1';
        });
    }

    if (filterPopup) {
        // Close popup when clicking outside
        filterPopup.addEventListener('click', (e) => {
            if (e.target === filterPopup) {
                filterPopup.classList.remove('show');
                if (navbar) navbar.style.zIndex = '1';
            }
        });
    }

    if (clearFiltersBtn) {
        // Clear all filters
        clearFiltersBtn.addEventListener('click', () => {
            // Clear checkboxes
            document.querySelectorAll('.filter-popup input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Clear price inputs
            const minPriceInput = document.querySelector('input[name="minPrice"]');
            const maxPriceInput = document.querySelector('input[name="maxPrice"]');
            if (minPriceInput) minPriceInput.value = '';
            if (maxPriceInput) maxPriceInput.value = '';
        });
    }

    // The apply filters button uses the form submit, so we don't need to handle it here
});

