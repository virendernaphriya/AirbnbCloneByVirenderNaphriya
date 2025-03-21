document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const signInBtn = document.querySelector('#signIn-Btn');
    const signUpBtn = document.querySelector('.register-link');
    const signInPopup = document.querySelector('.signIn-popup');
    const signUpPopup = document.querySelector('.signUp-popup');
    const closeSignInPopup = document.querySelector('.close-signin-popup');
    const closeSignUpPopup = document.querySelector('.close-signup-popup');
    const nav = document.querySelector('nav');
    const newListing = document.querySelector('#newListing');

    // Get user login status from data attribute
    const isLoggedIn = nav.dataset.userLoggedIn === 'true';

    // Handle new listing click
    if (newListing) {
        newListing.addEventListener('click', (e) => {
            // Only show popup if user is not logged in
            if (!isLoggedIn) {
                e.preventDefault(); // Prevent navigation
                signInPopup.classList.add('show');
                nav.style.zIndex = '-1';
            }
            // If user is logged in, let the link work normally (redirect to /new)
        });
    }

    // Show sign in popup
    signInBtn.addEventListener('click', () => {
        signInPopup.classList.add('show');
        nav.style.zIndex = '-1';
    });

    // Show sign up popup
    signUpBtn.addEventListener('click', () => {
        signUpPopup.classList.add('show');
        signInPopup.classList.remove('show');
        nav.style.zIndex = '-1';
    });

    // Close sign in popup
    closeSignInPopup.addEventListener('click', () => {
        signInPopup.classList.remove('show');
        nav.style.zIndex = '1';
    });

    // Close sign up popup
    closeSignUpPopup.addEventListener('click', () => {
        signUpPopup.classList.remove('show');
        nav.style.zIndex = '1';
    });
});



