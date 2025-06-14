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
             
                showToast('Registration successful! Redirecting...', 'success'); 


                setTimeout(() => {
                    window.location.href = '/login.html'; 
                }, 2000); 

            } else {
            
                showToast(data.message || '...', 'error');
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