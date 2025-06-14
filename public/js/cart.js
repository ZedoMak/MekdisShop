document.addEventListener('DOMContentLoaded', () => {
    const cartItemsList = document.getElementById('cart-items-list');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const token = localStorage.getItem('token');

    // This is a protected page, redirect if not logged in
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const fetchAndRenderCart = async () => {
        try {
            const response = await fetch('/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.clear();
                    window.location.href = '/login.html';
                }
                throw new Error('Failed to fetch cart');
            }
            const cart = await response.json();

            renderCart(cart);

        } catch (error) {
            console.error('Error fetching cart:', error);
            cartItemsList.innerHTML = '<p>Could not load your cart. Please try again.</p>';
        }
    };

    const renderCart = (cart) => {
        cartItemsList.innerHTML = ''; // Clear previous content

        if (!cart || cart.items.length === 0) {
            cartItemsList.innerHTML = '<h3>Your cart is empty.</h3>';
            summarySubtotal.textContent = '$0.00';
            summaryTotal.textContent = '$0.00';
            return;
        }

cart.items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
        <img src="${item.imageUrl || 'https://via.placeholder.com/100'}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p>Price: $${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-quantity">
            <label for="qty-${item.productId}">Qty:</label>
            <input type="number" id="qty-${item.productId}" class="quantity-input" value="${item.quantity}" min="1" data-product-id="${item.productId}">
        </div>
        <div class="cart-item-price">
            <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <div class="cart-item-actions">
            <button class="remove-btn" data-product-id="${item.productId}">Remove</button>
        </div>
    `;
    cartItemsList.appendChild(itemElement);
}); summarySubtotal.textContent = `$${cart.totalPrice.toFixed(2)}`;
        summaryTotal.textContent = `$${cart.totalPrice.toFixed(2)}`; // Assuming free shipping for now
    };
    
    const updateCartItem = async (productId, quantity) => {
         try {
            const response = await fetch(`/api/cart/item/${productId}`, {
                method: 'PUT',
                headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            });
             if (!response.ok) throw new Error('Failed to update item.');
             fetchAndRenderCart(); // Re-render the cart after updating
         } catch (error) {
             console.error('Error updating item:', error);
             showToast('Could not update item. Please try again.', 'error');
         }
    };
    
    const removeCartItem = async (productId) => {
        if (!confirm('Are you sure you want to remove this item?')) return;
        try {
            const response = await fetch(`/api/cart/item/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to remove item.');
            fetchAndRenderCart(); // Re-render the cart after removing
        } catch (error) {
            console.error('Error removing item:', error);
            showToast('Could not remove item. Please try again.', 'error'); 
        }
    };
    
    // Event delegation for cart actions
    cartItemsList.addEventListener('change', (event) => {
        if (event.target.classList.contains('quantity-input')) {
            const productId = event.target.dataset.productId;
            const quantity = parseInt(event.target.value, 10);
            updateCartItem(productId, quantity);
        }
    });

    cartItemsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            const productId = event.target.dataset.productId;
            removeCartItem(productId);
        }
    });

    // Initial fetch and render
    fetchAndRenderCart();
});