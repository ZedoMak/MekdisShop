document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');

    // Function to fetch and display products
    const displayProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const products = await response.json();

            productGrid.innerHTML = ''; // Clear existing products

products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.imageUrl || 'https://via.placeholder.com/250'}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">$${product.price.toFixed(2)}</p>
                        <p class="description">${product.description}</p>
                        <button class="btn add-to-cart-btn" data-product-id="${product._id}">Add to Cart</button>
                    </div>
                `;
                productGrid.appendChild(productCard);
            });
        } catch (error) {
            console.error('Failed to fetch products:', error);
            productGrid.innerHTML = '<p>Failed to load products. Please try again later.</p>';
        }
    };

    // Function to handle adding items to the cart
    const handleAddToCart = async (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const button = event.target;
            const productId = button.dataset.productId;
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You must be logged in to add items to your cart.');
                window.location.href = '/login.html';
                return;
            }

            try {
                const response = await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        productId: productId,
                        quantity: 1
                    })
                });

                if (response.ok) {
                    alert('Item added to cart!');
                    
                } else {
                    const errorData = await response.json();
                    alert(`Failed to add item: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Add to cart error:', error);
                alert('Could not add item to cart. Please try again.');
            }
        }
    };

    displayProducts();
    productGrid.addEventListener('click', handleAddToCart);
});
