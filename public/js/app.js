document.addEventListener('DOMContentLoaded', () => {
    console.log('MekdisShop Frontend JS Loaded!');

    const navMenuItems = document.getElementById('nav-menu-items');
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    
    if (token && userString) {
        
        const user = JSON.parse(userString);

        let adminLink = '';
        if (user.isAdmin) {
            adminLink = '<li class="nav-item"><a href="/admin.html" class="nav-link">Admin</a></li>';
        }

navMenuItems.innerHTML = `
    <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
    <li class="nav-item"><a href="/products.html" class="nav-link">Products</a></li>
    <li class="nav-item"><a href="/my-orders.html" class="nav-link">My Orders</a></li>
    ${adminLink} 
    <li class="nav-item"><a href="/cart.html" class="nav-link">Cart</a></li>
    <li class="nav-item"><a href="#" id="logout-link" class="nav-link">Logout</a></li>
`;

        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', (event) => {
                event.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                showToast('You have been logged out.', 'info');
                window.location.href = '/login.html';
            });
        }

    } else {
        
        navMenuItems.innerHTML = `
            <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
            <li class="nav-item"><a href="/products.html" class="nav-link">Products</a></li>
            <li class="nav-item"><a href="/login.html" class="nav-link">Login</a></li>
            <li class="nav-item"><a href="/register.html" class="nav-link">Register</a></li>
            <li class="nav-item"><a href="/cart.html" class="nav-link">Cart</a></li>
        `;
    }
});

// In public/js/app.js, add this function at the bottom of the file

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return; // Do nothing if container isn't on the page

    // Create the toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add it to the container
    container.appendChild(toast);

    // Animate it in
    setTimeout(() => {
        toast.classList.add('show');
    }, 100); // Small delay to allow CSS transitions to work

    // Set a timeout to remove the toast
    setTimeout(() => {
        toast.classList.remove('show');

        // Remove the element from the DOM after the fade-out animation
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 4000); // Toast will be visible for 4 seconds
}