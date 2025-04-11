// Login Modal functionality
document.querySelector('.btn-login').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('login-modal').style.display = 'flex';
});

document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('login-modal').style.display = 'none';
});

window.addEventListener('click', function(e) {
    if (e.target === document.getElementById('login-modal')) {
        document.getElementById('login-modal').style.display = 'none';
    }
});

document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validación básica (en producción verificarías contra una API)
    if (email && password) {
        alert('Inicio de sesión exitoso');
        document.getElementById('login-modal').style.display = 'none';
        // Aquí podrías redirigir o mostrar contenido protegido
        window.location.href = 'dashboard.html';
    } else {
        alert('Por favor, completa todos los campos');
    }
});