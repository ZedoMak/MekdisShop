

document.addEventListener('DOMContentLoaded', () => {


    const renderProducts = (products, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return; 
        container.innerHTML = ''; 

        if (products.length === 0) {
            container.innerHTML = '<p>No products in this category at the moment.</p>';
            return;
        }

        products.forEach(product => {
            const productLink = document.createElement('a');
            productLink.href = `/product.html?id=${product._id}`;
            productLink.className = 'product-card-link';

            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.imageUrl || 'https://via.placeholder.com/250'}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3><${product.name}</h3> <p class="price">${product.price.toFixed(2)}</p><p class="description">${product.description.substring(0, 100)}...</p>
                    <button class="btn add-to-cart-btn" data-product-id="${product._id}">Add to Cart</button>
                </div>
            `;
            productLink.appendChild(productCard);
            container.appendChild(productLink);
        });
    }; const initializeHomepage = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            
            const allProducts = await response.json();

            const newArrivals = allProducts.slice(0, 4);
            renderProducts(newArrivals, 'new-arrivals-grid');

            const clothingProducts = allProducts.filter(p => p.category.toLowerCase() === 'clothing').slice(0, 4);
            renderProducts(clothingProducts, 'clothing-products-grid');

            const cosmeticsProducts = allProducts.filter(p => p.category.toLowerCase() === 'cosmetics').slice(0, 4);
            renderProducts(cosmeticsProducts, 'cosmetics-products-grid');

        } catch (error) {
            console.error('Failed to initialize homepage:', error);
           
        }
    }; const handleAddToCart = async (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            event.preventDefault(); 
            
            const button = event.target;
            const productId = button.dataset.productId;
            const token = localStorage.getItem('token');

            if (!token) {
                showToast('Please log in to add items to your cart.', 'error');
                setTimeout(() => window.location.href = '/login.html', 2000);
                return;
            }  try {
                const response = await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId, quantity: 1 })
                });

                if (response.ok) {
                    showToast('Item added to cart!', 'success');
                } else {
                    const errorData = await response.json();
                    showToast(`Failed to add item: ${errorData.message}`, 'error');
                }
            } catch (error) {
                console.error('Add to cart error:', error);
                showToast('Could not add item to cart. Please try again.', 'error');
            }
        }
    }; initializeHomepage();
    document.addEventListener('click', handleAddToCart);
});