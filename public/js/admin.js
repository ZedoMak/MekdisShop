// Replace the entire content of public/js/admin.js with this complete version

document.addEventListener('DOMContentLoaded', () => {
    // --- Page Elements ---
    const usersListContainer = document.getElementById('users-list');
    const allOrdersListContainer = document.getElementById('all-orders-list');
    const productForm = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productDescInput = document.getElementById('product-description');
    const productPriceInput = document.getElementById('product-price');
    const productCategoryInput = document.getElementById('product-category');
    const productStockInput = document.getElementById('product-stock');
    const productImageInput = document.getElementById('product-image');
    const currentImagePreview = document.getElementById('current-image-preview');
    const clearFormBtn = document.getElementById('clear-form-btn');
    const allProductsListContainer = document.getElementById('all-products-list');

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // ** CLIENT-SIDE SECURITY CHECK **
    if (!token || !user || !user.isAdmin) {
        showToast('You must be an admin to access this page.', 'error');
        window.location.href = '/';
        return;
    }

    // --- PRODUCT MANAGEMENT FUNCTIONS (NEW) ---

    const fetchAndRenderProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const products = await response.json();
            
            let productsHtml = `
                <table>
                    <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                    <tbody>
            `;
            products.forEach(p => {
                productsHtml += `
                    <tr>
                        <td><img src="${p.imageUrl}" alt="${p.name}" width="50"></td>
                        <td>${p.name}</td>
                        <td>$${p.price.toFixed(2)}</td>
                        <td>${p.stockQuantity}</td>
                        <td>
                            <button class="btn-edit" data-id="${p._id}">Edit</button>
                            <button class="btn-delete" data-id="${p._id}">Delete</button>
                        </td>
                    </tr>
                `;
            });
            productsHtml += '</tbody></table>';
            allProductsListContainer.innerHTML = productsHtml;
        } catch (error) {
            console.error('Error rendering products:', error);
            allProductsListContainer.innerHTML = '<p>Could not load products.</p>';
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        
        const productId = productIdInput.value;
        const isEditMode = !!productId;

        const formData = new FormData();
        formData.append('name', productNameInput.value);
        formData.append('description', productDescInput.value);
        formData.append('price', productPriceInput.value);
        formData.append('category', productCategoryInput.value);
        formData.append('stockQuantity', productStockInput.value);
        
        if (productImageInput.files[0]) {
            formData.append('image', productImageInput.files[0]);
        }

        const url = isEditMode ? `/api/products/${productId}` : '/api/products';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save product.');
            }
            
            showToast(`Product ${isEditMode ? 'updated' : 'created'} successfully!`, 'success');
            clearForm();
            fetchAndRenderProducts();

        } catch (error) {
            console.error('Error saving product:', error);
            showToast(`Error: ${error.message}`, 'error');
        }
    };

    const handleProductListClick = async (event) => {
        const target = event.target;
        const productId = target.dataset.id;

        if (target.classList.contains('btn-edit')) {
            try {
                const response = await fetch(`/api/products/${productId}`);
                if (!response.ok) throw new Error('Failed to fetch product details.');
                const product = await response.json();

                productIdInput.value = product._id;
                productNameInput.value = product.name;
                productDescInput.value = product.description;
                productPriceInput.value = product.price;
                productCategoryInput.value = product.category;
                productStockInput.value = product.stockQuantity;
                currentImagePreview.src = product.imageUrl;
                currentImagePreview.style.display = 'block';
                
                window.scrollTo(0, 0);
            } catch (error) {
                console.error('Error fetching product for edit:', error);
                showToast(`Error: ${error.message}`, 'error');
            }
        }

        if (target.classList.contains('btn-delete')) {
            if (!confirm('Are you sure you want to delete this product?')) return;
            
            try {
                const response = await fetch(`/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to delete product.');
                
                alert('Product deleted successfully!');
                fetchAndRenderProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                showToast(`Error: ${error.message}`, 'error');
            }
        }
    };
    
    const clearForm = () => {
        productForm.reset();
        productIdInput.value = '';
        currentImagePreview.style.display = 'none';
    };

    // --- USER & ORDER FUNCTIONS (EXISTING) ---

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const users = await response.json();
            
            let usersHtml = `
                <table>
                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Admin</th></tr></thead>
                    <tbody>
            `;
            users.forEach(u => {
                usersHtml += `
                    <tr>
                        <td>${u._id}</td>
                        <td>${u.name}</td>
                        <td>${u.email}</td>
                        <td>${u.isAdmin ? 'Yes' : 'No'}</td>
                    </tr>
                `;
            });
            usersHtml += '</tbody></table>';
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
                    <thead><tr><th>ID</th><th>User ID</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
            `;
            orders.forEach(o => {
                const orderDate = new Date(o.createdAt).toLocaleDateString();
                ordersHtml += `
                    <tr>
                        <td>${o._id}</td>
                        <td>${o.userId}</td>
                        <td>${orderDate}</td>
                        <td>$${o.totalAmount.toFixed(2)}</td>
                        <td>${o.status}</td>
                    </tr>
                `;
            });
            ordersHtml += '</tbody></table>';
            allOrdersListContainer.innerHTML = ordersHtml;
        } catch (error) {
             console.error(error);
            allOrdersListContainer.innerHTML = '<p>Could not load orders.</p>';
        }
    };

    // --- EVENT LISTENERS ---
    productForm.addEventListener('submit', handleFormSubmit);
    clearFormBtn.addEventListener('click', clearForm);
    allProductsListContainer.addEventListener('click', handleProductListClick);

    // --- INITIAL DATA FETCH ---
    fetchAndRenderProducts();
    fetchUsers();
    fetchOrders();
});