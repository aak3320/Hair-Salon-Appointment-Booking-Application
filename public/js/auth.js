// It will handle the login and registration logic for the frontend.

// Function to check if user is logged in and update the navigation bar accordingly
const updateNavBar = () => {
    //User data from localStorage
    const user = localStorage.getItem('user');

    //For desktop navigation
    const navLoginLink = document.getElementById('navLoginLink');
    const navUserName = document.getElementById('navUserName');

    //For mobile navigation
    const navLoginLinkMobile = document.getElementById('navLoginLinkMobile');
    const navUserNameMobile = document.getElementById('navUserNameMobile');

    if (user) {
        // If user is logged in
        const userData = JSON.parse(user);

        //Update Navbar for desktop
        if (navLoginLink) navLoginLink.style.display = 'none';
        if (navUserName) {
            navUserName.style.display = 'block';
            navUserName.textContent = `Hi, ${userData.name.split(' ')[0]}`;
            navUserName.href = '#';

            navUserName.addEventListener('click', function (e) {
                e.preventDefault();
                const menu = document.getElementById('userDropdownMenu');
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            });

            document.addEventListener('click', function (e) {
                const wrapper = document.querySelector('.user-dropdown-wrapper');
                if (wrapper && !wrapper.contains(e.target)) {
                    document.getElementById('userDropdownMenu').style.display = 'none';
                }
            });

            const dropdownLogout = document.getElementById('dropdownLogoutBtn');
            if (dropdownLogout) {
                dropdownLogout.addEventListener('click', function () {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = 'login.html';
                });
            }
        }

        //Update Navbar for mobile
        if (navLoginLinkMobile) navLoginLinkMobile.style.display = 'none';
        if (navUserNameMobile) {
            navUserNameMobile.style.display = 'block';
            navUserNameMobile.textContent = `Hi, ${userData.name.split(' ')[0]}`;
            navUserNameMobile.href = 'profile.html';
        }
    } else {
        // If user is not logged in
        if (navLoginLink) navLoginLink.style.display = 'block';
        if (navUserName) navUserName.style.display = 'none';

        if (navLoginLinkMobile) navLoginLinkMobile.style.display = 'block';
        if (navUserNameMobile) navUserNameMobile.style.display = 'none';
    }
};

// Run the updated navigation when page loads
document.addEventListener('DOMContentLoaded', updateNavBar);

//Registration form submission
const registerForm = document.getElementById('registerForm');
const errorBox = document.getElementById('registerError');
const successBox = document.getElementById('registerSuccess');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Values from form
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const mobileNumber = document.getElementById('mobileNumber').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        // Hide boxes before new submission
        errorBox.style.display = 'none';
        successBox.style.display = 'none';

        try {
            // Send POST request to register API
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, mobileNumber, password, role })
            });

            // Data from server response
            const data = await response.json();

            if (data.success) {
                // Display success message
                successBox.style.display = 'block';
                successBox.textContent = 'Your account created successfully! Redirecting to login...';

                // Clear form
                registerForm.reset();

                // Redirected to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } else {
                // Display error message
                errorBox.style.display = 'block';
                errorBox.textContent = data.message;
            }

        } catch (err) {
            errorBox.style.display = 'block';
            errorBox.textContent = 'Something went wrong. Please try again!!!';
        }
    });
}

// Login form submission
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        //Values of email and password from form
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const errorBox = document.getElementById('loginError');
        const successBox = document.getElementById('loginSuccess');

        // Hide boxes before new submission
        errorBox.style.display = 'none';
        successBox.style.display = 'none';

        try {
            // Send POST request to login API
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            // Data from server response
            const data = await response.json();

            if (data.success) {

                // Store JWT token in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Display success message
                successBox.style.display = 'block';
                successBox.textContent = 'Login successful! Redirecting to Home page...';

                // Redirected to home page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);

            } else {
                // Display error message
                errorBox.style.display = 'block';
                errorBox.textContent = data.message;
            }

        } catch (err) {
            errorBox.style.display = 'block';
            errorBox.textContent = 'Something went wrong. Please try again.';
        }
    });
}