document.addEventListener('DOMContentLoaded', () => {
    const featuredGrid = document.getElementById('featured-products-grid');

    const displayFeaturedProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');

            const products = await response.json();

            // Take only the first 4 products as "featured"
            const featuredProducts = products.slice(0, 4);

            featuredGrid.innerHTML = ''; // Clear loading message

            if (featuredProducts.length === 0) {
                featuredGrid.innerHTML = '<p>No featured products available at the moment.</p>';
                return;
            }

            
        products.forEach(product => {
    // Create an anchor tag instead of a div
            const productLink = document.createElement('a');
            productLink.href = `/product.html?id=${product._id}`;
            productLink.className = 'product-card-link'; // Use a class for styling

            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                    <img src="${product.imageUrl || 'https://via.placeholder.com/250'}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3>${product.name}</h3>
            <p class="price">${product.price.toFixed(2)}</p>
            <p class="description">${product.description.substring(0, 100)}...</p>
            <button class="btn add-to-cart-btn" data-product-id="${product._id}">Add to Cart</button>
            </div>
        `; productLink.appendChild(productCard); 
            featuredGrid.appendChild(productLink); 
        });



        
        } catch (error) {
            console.error('Failed to load featured products:', error);
            featuredGrid.innerHTML = '<p>Could not load products. Please try again.</p>';
        }
    };

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
                    body: JSON.stringify({ productId, quantity: 1 })
                });
                if (response.ok) {
                    alert('Item added to cart!');
                } else {
                    const errorData = await response.json();
                    alert(`Failed to add item: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Add to cart error:', error);
            }
        }
    };

   displayFeaturedProducts();
    featuredGrid.addEventListener('click', handleAddToCart);
});
 
