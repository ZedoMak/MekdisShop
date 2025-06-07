document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageContainer = document.getElementById('message-container');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        messageContainer.innerHTML = '';
        messageContainer.className = '';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
              
                showMessage('Login successful! Redirecting...', 'success');

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data)); 

               
                setTimeout(() => {
                    window.location.href = '/'; 
                }, 1500);

            } else {
               
                showMessage(data.message || 'An error occurred during login.', 'error');
            }

        } catch (error) {
            console.error('Login fetch error:', error);
            showMessage('Cannot connect to the server. Please try again later.', 'error');
        }
    });

    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-${type}`;
    }
});