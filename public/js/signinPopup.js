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
    const signinMessage = document.querySelector('#signin-message');

    // Check if user is logged in
    const isLoggedIn = nav.dataset.userLoggedIn === 'true';

    // Show sign in popup
    signInBtn.addEventListener('click', () => {
        signInPopup.classList.add('show');
        nav.style.zIndex = '-1';
        signinMessage.style.display = 'none';
    });

    // Show sign up popup
    signUpBtn.addEventListener('click', () => {
        signUpPopup.classList.add('show');
        signInPopup.classList.remove('show');
        nav.style.zIndex = '-1';
    });

    // Close popups
    closeSignInPopup.addEventListener('click', () => {
        signInPopup.classList.remove('show');
        nav.style.zIndex = '1';
        signinMessage.style.display = 'none';
    });

    closeSignUpPopup.addEventListener('click', () => {
        signUpPopup.classList.remove('show');
        nav.style.zIndex = '1';
    });

    // Handle new listing click
    if (newListing) {
        newListing.addEventListener('click', (e) => {
            if (!isLoggedIn) {
                e.preventDefault();
                signInPopup.classList.add('show');
                nav.style.zIndex = '-1';
                
                // Show message and set redirect URL
                signinMessage.textContent = 'Please login first to create a listing';
                signinMessage.style.display = 'block';
                signinMessage.classList.remove('alert-danger');
                signinMessage.classList.add('alert-info');
                
                // Set redirect URL
                const redirectInput = document.querySelector('.signIn-popup form input[name="redirectUrl"]');
                if (redirectInput) {
                    redirectInput.value = '/listings/new';
                }
            }
        });
    }

});



