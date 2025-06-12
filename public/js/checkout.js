document.addEventListener('DOMContentLoaded', () => {
    const orderSummaryItems = document.getElementById('order-summary-items');
    const orderSummaryTotal = document.getElementById('order-summary-total');
    const shippingForm = document.getElementById('shipping-form');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // 1. FETCH AND DISPLAY CART FOR SUMMARY
    const displayCartSummary = async () => {
        try {
            const response = await fetch('/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch cart.');
            const cart = await response.json();

            if (!cart || cart.items.length === 0) {
                alert('Your cart is empty. Redirecting to products page.');
                window.location.href = '/products.html';
                return;
            }

            // Render cart items
            orderSummaryItems.innerHTML = '';
            cart.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'summary-item';
                itemElement.innerHTML = `
                    <span><span class="math-inline">${item.name} (x</span>${item.quantity})</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                `;
                orderSummaryItems.appendChild(itemElement);
            });

            // Render totals
            orderSummaryTotal.innerHTML = `
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span><span class="math-block">${cart.totalPrice.toFixed(2)}</span></div>
                    <div class="summary-row"> <span>Shipping</span>
                    <span>Free</span>
                    </div>
                    <hr>
                    <div class="summary-row total-row">
                    <span>Total</span>
                    <span>${cart.totalPrice.toFixed(2)}</span>
                    </div>
                    `; } catch (error) {
            console.error('Error displaying cart summary:', error);
        }
    }; shippingForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const shippingAddress = {
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value,
            country: document.getElementById('country').value
        }; if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            alert('Please fill out all shipping address fields.');
            return;
        } try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ shippingAddress })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to place order.');
            }

            const order = await response.json();
            alert('Order placed successfully!');
            
            // Redirect to a confirmation page with the new order's ID
            window.location.href = `/order-confirmation.html?id=${order._id}`;

        } catch (error) {
            console.error('Error placing order:', error);
            alert(`Error: ${error.message}`);
        }
    }); displayCartSummary();
});