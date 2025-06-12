document.addEventListener('DOMContentLoaded', () => {
    const orderIdDisplay = document.getElementById('order-id-display');

    // Get the order ID from the URL
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');

    if (orderId) {
        orderIdDisplay.textContent = orderId;
    } else {
        orderIdDisplay.textContent = 'Not available';
    }
});