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

                alert('You have been logged out.');
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