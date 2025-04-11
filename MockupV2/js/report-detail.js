document.addEventListener('DOMContentLoaded', function() {
    // Cambiar foto principal al hacer clic en miniaturas
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainPhoto = document.getElementById('main-photo');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const fullSizeSrc = this.getAttribute('data-full');
            mainPhoto.src = fullSizeSrc;
            
            // Actualizar miniatura activa
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Simular actualización en tiempo real (en producción sería con WebSockets)
    if (document.querySelector('.timeline-item.current')) {
        setTimeout(() => {
            updateTimeline();
        }, 10000);
    }
    
    function updateTimeline() {
        const currentItem = document.querySelector('.timeline-item.current');
        if (currentItem) {
            // Simular nueva actualización
            const newUpdate = document.createElement('div');
            newUpdate.className = 'timeline-item completed';
            newUpdate.innerHTML = `
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h3>Evaluación completada</h3>
                    <p>${new Date().toLocaleString()}</p>
                    <p>El perito ha determinado que se procederá al reemplazo de la vitrocerámica.</p>
                </div>
            `;
            
            currentItem.classList.remove('current');
            currentItem.classList.add('completed');
            
            const nextItem = currentItem.nextElementSibling;
            if (nextItem) {
                nextItem.classList.remove('pending');
                nextItem.classList.add('current');
                nextItem.innerHTML = `
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <h3>Resolución</h3>
                        <p>${new Date().toLocaleString()}</p>
                        <p>Se ha aprobado el reemplazo de la vitrocerámica. Un técnico se pondrá en contacto para coordinar la instalación.</p>
                        <div class="timeline-actions">
                            <button class="btn-small">Confirmar disponibilidad</button>
                        </div>
                    </div>
                `;
                
                // Actualizar estado del reporte
                document.querySelector('.report-status').textContent = 'Resuelto';
                document.querySelector('.report-status').className = 'report-status status-resolved';
            }
            
            // Insertar nueva actualización
            currentItem.parentNode.insertBefore(newUpdate, currentItem.nextSibling);
        }
    }
});