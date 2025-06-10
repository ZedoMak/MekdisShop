document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('orders-container');
    const token = localStorage.getItem('token');

    // This is a protected page, redirect if not logged in
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const fetchAndRenderOrders = async () => {
        try {
            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // If token is expired or invalid, server will send 401
                if (response.status === 401) {
                    localStorage.clear(); // Clear bad token
                    window.location.href = '/login.html';
                }
                throw new Error('Failed to fetch orders');
            }

            const orders = await response.json();
            renderOrders(orders);

        } catch (error) {
            console.error('Error fetching orders:', error);
            ordersContainer.innerHTML = '<p>Could not load your orders. Please try again later.</p>';
        }
    };

    const renderOrders = (orders) => {
        ordersContainer.innerHTML = ''; // Clear loading message

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<h3>You have not placed any orders yet.</h3>';
            return;
        }

        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';

            // Format the date to be more readable
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            orderCard.innerHTML = `
                <div class="order-card-section">
                    <h4>Order ID</h4>
                    <p class="order-id"><span class="math-inline">\{order\.\_id\}</p\>
                    </div>
                <div class="order-card-section">
                <h4>Date Placed</h4>
                <p>{orderDate}</p>
                </div>
                    <div class="order-card-section">
                    <h4>Total Amount</h4>
                    <p>$order.totalAmount.toFixed(2)</p></div><divclass="order−card−section"><h4>Status</h4><pclass="order−status">{order.status}</p>
                </div>
                `;
ordersContainer.appendChild(orderCard);
});
};  // Initial fetch and render
    fetchAndRenderOrders();
});