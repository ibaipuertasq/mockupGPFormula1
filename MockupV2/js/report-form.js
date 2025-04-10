document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const form = document.getElementById('incident-form');
    const steps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const progressSteps = document.querySelectorAll('.progress-step');
    let currentStep = 0;
    
    // Objeto con las preguntas dinámicas para cada tipo de objeto
    const dynamicQuestions = {
        'vitroceramica': [
            {
                type: 'select',
                question: '¿Qué marca es la vitrocerámica?',
                options: ['Bosch', 'Balay', 'Tekna', 'Otro']
            },
            {
                type: 'text',
                question: 'Describe cómo ocurrió el daño'
            },
            {
                type: 'radio',
                question: '¿La vitrocerámica sigue funcionando?',
                options: ['Sí', 'No', 'Parcialmente']
            }
        ],
        // Más preguntas para otros tipos de objetos
    };
    
    // Manejar el paso siguiente
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next')) - 1;
            goToStep(nextStep);
        });
    });
    
    // Manejar el paso anterior
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev')) - 1;
            goToStep(prevStep);
        });
    });
    
    // Función para cambiar de paso
    function goToStep(step) {
        // Validar el formulario antes de avanzar
        if (step > currentStep && !validateStep(currentStep)) {
            return;
        }
        
        // Ocultar el paso actual
        steps[currentStep].classList.remove('active');
        progressSteps[currentStep].classList.remove('active');
        
        // Mostrar el nuevo paso
        steps[step].classList.add('active');
        progressSteps[step].classList.add('active');
        
        // Actualizar el paso actual
        currentStep = step;
        
        // Cargar preguntas dinámicas si es el paso 2
        if (currentStep === 1) {
            loadDynamicQuestions();
        }
        
        // Actualizar resumen si es el paso 4
        if (currentStep === 3) {
            updateSummary();
        }
    }
    
    // Validar el paso actual
    function validateStep(step) {
        let isValid = true;
        
        if (step === 0) {
            // Validar selección de tipo de objeto
            const selectedObject = document.querySelector('input[name="object-type"]:checked');
            if (!selectedObject) {
                alert('Por favor, selecciona el tipo de objeto dañado');
                isValid = false;
            }
        }
        
        // Más validaciones para otros pasos
        
        return isValid;
    }
    
    // Cargar preguntas dinámicas según el tipo de objeto
    function loadDynamicQuestions() {
        const selectedObject = document.querySelector('input[name="object-type"]:checked').value;
        const questionsContainer = document.getElementById('dynamic-questions');
        questionsContainer.innerHTML = '';
        
        if (dynamicQuestions[selectedObject]) {
            dynamicQuestions[selectedObject].forEach((question, index) => {
                const questionElement = document.createElement('div');
                questionElement.className = 'form-group';
                
                const label = document.createElement('label');
                label.textContent = question.question;
                questionElement.appendChild(label);
                
                if (question.type === 'select') {
                    const select = document.createElement('select');
                    select.name = `q-${index}`;
                    select.required = true;
                    
                    question.options.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option;
                        optionElement.textContent = option;
                        select.appendChild(optionElement);
                    });
                    
                    questionElement.appendChild(select);
                } else if (question.type === 'text') {
                    const input = document.createElement('textarea');
                    input.name = `q-${index}`;
                    input.rows = 3;
                    input.required = true;
                    questionElement.appendChild(input);
                } else if (question.type === 'radio') {
                    question.options.forEach((option, i) => {
                        const radioContainer = document.createElement('div');
                        radioContainer.className = 'radio-option';
                        
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = `q-${index}`;
                        input.value = option;
                        input.id = `q-${index}-${i}`;
                        if (i === 0) input.required = true;
                        
                        const label = document.createElement('label');
                        label.htmlFor = `q-${index}-${i}`;
                        label.textContent = option;
                        
                        radioContainer.appendChild(input);
                        radioContainer.appendChild(label);
                        questionElement.appendChild(radioContainer);
                    });
                }
                
                questionsContainer.appendChild(questionElement);
            });
        }
    }
    
    // Manejar subida de fotos
    const uploadArea = document.getElementById('upload-area');
    const photoUpload = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('photo-preview');
    
    uploadArea.addEventListener('click', function() {
        photoUpload.click();
    });
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    photoUpload.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        photoPreview.innerHTML = '';
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            if (!file.type.startsWith('image/')) continue;
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-photo';
                removeBtn.innerHTML = '&times;';
                removeBtn.addEventListener('click', function() {
                    previewItem.remove();
                });
                
                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                photoPreview.appendChild(previewItem);
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    // Actualizar resumen antes de enviar
    function updateSummary() {
        const selectedObject = document.querySelector('input[name="object-type"]:checked');
        const reviewObjectType = document.getElementById('review-object-type');
        const reviewDetails = document.getElementById('review-details');
        const reviewPhotos = document.getElementById('review-photos');
        
        if (selectedObject) {
            const label = document.querySelector(`label[for="${selectedObject.id}"] span`).textContent;
            reviewObjectType.textContent = label;
        }
        
        // Mostrar respuestas a preguntas dinámicas
        reviewDetails.innerHTML = '';
        const questions = document.querySelectorAll('#dynamic-questions .form-group');
        
        questions.forEach(question => {
            const label = question.querySelector('label').textContent;
            let answer = '';
            
            const select = question.querySelector('select');
            const textarea = question.querySelector('textarea');
            const radio = question.querySelector('input[type="radio"]:checked');
            
            if (select) {
                answer = select.options[select.selectedIndex].text;
            } else if (textarea) {
                answer = textarea.value;
            } else if (radio) {
                answer = radio.value;
            }
            
            if (answer) {
                const detailItem = document.createElement('div');
                detailItem.className = 'detail-item';
                
                const detailLabel = document.createElement('strong');
                detailLabel.textContent = `${label}: `;
                
                const detailValue = document.createElement('span');
                detailValue.textContent = answer;
                
                detailItem.appendChild(detailLabel);
                detailItem.appendChild(detailValue);
                reviewDetails.appendChild(detailItem);
            }
        });
        
        // Mostrar miniaturas de fotos en el resumen
        reviewPhotos.innerHTML = '';
        const previewItems = document.querySelectorAll('#photo-preview .preview-item img');
        
        previewItems.forEach(item => {
            const photoThumb = document.createElement('img');
            photoThumb.src = item.src;
            reviewPhotos.appendChild(photoThumb);
        });
    }
    
    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simular envío (en producción sería una llamada AJAX)
        alert('Reporte enviado correctamente. Serás redirigido al dashboard.');
        
        // Redirigir al dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    });
});