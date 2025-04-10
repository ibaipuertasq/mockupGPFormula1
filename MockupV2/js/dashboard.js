document.addEventListener('DOMContentLoaded', function() {
    // Filtrar reportes por estado
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    const reportsList = document.querySelector('.reports-list');
    
    // Datos de ejemplo (en producción vendrían de una API)
    const reports = [
        {
            id: 'INC-2023-0456',
            type: 'Rotura de vitrocerámica',
            date: '15/10/2023',
            description: 'Rotura en el lado izquierdo de la placa, aproximadamente 20cm de longitud...',
            status: 'pending',
            photos: ['photo1.jpg', 'photo2.jpg']
        },
        // Más reportes de ejemplo
    ];
    
    // Cargar reportes
    function loadReports() {
        reportsList.innerHTML = '';
        
        const status = statusFilter.value;
        const dateOrder = dateFilter.value;
        
        // Filtrar y ordenar reportes
        let filteredReports = [...reports];
        
        if (status !== 'all') {
            filteredReports = filteredReports.filter(report => report.status === status);
        }
        
        if (dateOrder === 'newest') {
            filteredReports.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else {
            filteredReports.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        
        // Mostrar reportes
        filteredReports.forEach(report => {
            const reportCard = document.createElement('div');
            reportCard.className = 'report-card';
            
            let statusClass = '';
            let statusText = '';
            
            switch(report.status) {
                case 'pending':
                    statusClass = 'status-pending';
                    statusText = 'Pendiente de revisión';
                    break;
                case 'in-progress':
                    statusClass = 'status-in-progress';
                    statusText = 'En progreso';
                    break;
                case 'resolved':
                    statusClass = 'status-resolved';
                    statusText = 'Resuelto';
                    break;
            }
            
            reportCard.innerHTML = `
                <div class="report-header">
                    <div class="report-id">#${report.id}</div>
                    <div class="report-status ${statusClass}">${statusText}</div>
                </div>
                <div class="report-content">
                    <div class="report-summary">
                        <h3>${report.type}</h3>
                        <p><strong>Fecha:</strong> ${report.date}</p>
                        <p><strong>Descripción:</strong> ${report.description}</p>
                    </div>
                    <div class="report-actions">
                        <a href="report-detail.html?id=${report.id}" class="btn-view">Ver detalles</a>
                    </div>
                </div>
            `;
            
            reportsList.appendChild(reportCard);
        });
    }
    
    // Event listeners para los filtros
    statusFilter.addEventListener('change', loadReports);
    dateFilter.addEventListener('change', loadReports);
    
    // Cargar reportes inicialmente
    loadReports();
});