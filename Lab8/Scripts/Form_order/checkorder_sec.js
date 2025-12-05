document.addEventListener('DOMContentLoaded', function() {
    let form = document.querySelector('#Заказ form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let error = false;
        
        // Проверка текстовых полей
        let textFields = form.querySelectorAll('.second');
        for (let field of textFields) {
            if (field.name === 'times') continue;
            if (!field.value.trim()) {
                field.style.border = '2px solid red';
                error = true;
            } else {
                field.style.border = '';
            }
        }
        
        // Проверка выбора доставки
        let deliveryChecked = form.querySelector('input[name="time"]:checked');
        if (!deliveryChecked) {
            document.getElementById('times').style.border = '2px solid red';
            error = true;
        }
        
        // Проверка времени (только если выбрана первая опция)
        if (deliveryChecked && deliveryChecked.value === "true") {
            let timeField = form.querySelector('[name="times"]');
            if (!timeField.value) {
                timeField.style.border = '2px solid red';
                error = true;
            }
        }
        
        if (error) {
            alert('Заполнитевсе поля');
            return false;
        }
        
        this.submit();
    });
});