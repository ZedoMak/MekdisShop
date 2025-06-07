document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const messageContainer = document.getElementById('message-container');

    registerForm.addEventListener('submit', async (event) => {
       
        event.preventDefault();

        messageContainer.innerHTML = '';
        messageContainer.className = '';

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        if (password !== passwordConfirm) {
            showMessage('Passwords do not match.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
             
                showMessage('Registration successful! Redirecting to login...', 'success');


                setTimeout(() => {
                    window.location.href = '/login.html'; 
                }, 2000); 

            } else {
            
                showMessage(data.message || 'An error occurred during registration.', 'error');
            }

        } catch (error) {
            console.error('Registration fetch error:', error);
            showMessage('Cannot connect to the server. Please try again later.', 'error');
        }
    });

    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-${type}`;
    }
});