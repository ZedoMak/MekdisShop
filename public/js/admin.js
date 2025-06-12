document.addEventListener('DOMContentLoaded', () => {
    const usersListContainer = document.getElementById('users-list');
    const allOrdersListContainer = document.getElementById('all-orders-list');

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    
    if (!token || !user || !user.isAdmin) {
        alert('Access Denied: Admins only.');
        window.location.href = '/';
        return;
    }

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const users = await response.json();

            let usersHtml = `
                <table>
                    <tr><th>ID</th><th>Name</th><th>Email</th><th>Admin</th></tr>
            `;
            users.forEach(u => {
                usersHtml += `
                    <tr>
                        <td><span class="math-inline">${u._id}</td\><td>${u.name}</td>
<td>${u.email}</td><td>${u.isAdmin ? 'Yes' : 'No'}</td>
</tr>
`;
});

usersHtml += '</table>';
usersListContainer.innerHTML = usersHtml;
} catch (error) {
console.error(error);
usersListContainer.innerHTML = '<p>Could not load users.</p>';
}
};

const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders/all/orders', {
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const orders = await response.json();

            let ordersHtml = `
                 <table>
                    <tr><th>ID</th><th>User ID</th><th>Date</th><th>Total</th><th>Status</th></tr>
            `;
            orders.forEach(o => {
                const orderDate = new Date(o.createdAt).toLocaleDateString();
                ordersHtml += `
                    <tr>
                        <td><span class="math-inline">${o._id}</td\> <td>${o.userId}</td>
<td>orderDate</td><td>${o.totalAmount.toFixed(2)}</td><td>${o.status}</td>
</tr>
`;
});
ordersHtml += '</table>';
allOrdersListContainer.innerHTML = ordersHtml;
} catch (error) {
console.error(error);
allOrdersListContainer.innerHTML = '<p>Could not load orders.</p>';
}
};

    fetchUsers();
    fetchOrders();
});

                        