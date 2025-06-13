document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('product-detail-container');
    const token = localStorage.getItem('token');

    // 1. Get Product ID from URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        productDetailContainer.innerHTML = '<h2>Product not found.</h2>';
        return;
    }

    // 2. Fetch and Render Product Details
    const fetchAndRenderProduct = async () => {
        try {
            const response = await fetch(`/api/products/${productId}`);
            if (!response.ok) throw new Error('Product not found.');

            const product = await response.json();

            document.title = `${product.name} - MekdisShop`; // Update the page title

            productDetailContainer.innerHTML = `
                <div class="product-detail-image">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h1>${product.name}</h1><p class="price"> ${product.price.toFixed(2)}</p><pclass="description"> ${product.description}</p><div class="add-to-cart-form">
                        <label for="quantity">Qty:</label>
                        <input type="number" id="quantity-input" value="1" min="1">
                        <button class="btn add-to-cart-btn" data-product-id="${product._id}">Add to Cart</button>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Fetch product error:', error);
            productDetailContainer.innerHTML = `<h2>Error: ${error.message}</h2>`;
        }
    };const handleAddToCart = async (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            if (!token) {
                alert('Please log in to add items to your cart.');
                window.location.href = '/login.html';
                return;
            }
            
            const button = event.target;
            const productId = button.dataset.productId;
            const quantityInput = document.getElementById('quantity-input');
            const quantity = parseInt(quantityInput.value, 10); try {
                const response = await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId, quantity })
                });
                
                if (response.ok) {
                    alert(`${quantity} x ${document.querySelector('.product-detail-info h1').textContent} added to cart!`);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        }
    };

    fetchAndRenderProduct();
    productDetailContainer.addEventListener('click', handleAddToCart);
});