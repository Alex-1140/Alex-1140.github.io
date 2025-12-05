document.addEventListener('DOMContentLoaded', function() {
    let form = document.querySelector('#Заказ form');
    
    // Добавляем обработчик события отправки формы
    form.addEventListener('submit', function(event) {
        // Предотвращаем стандартную отправку формы
        event.preventDefault();
        
        // Проверка выбранных блюд (первая часть из checkorder.js)
        let selected = check();
        let message = uve(selected);
        
        if (message !== "") {
            showMessage(message);
            return false;
        }
        
        // Проверка текстовых полей и доставки (из checkorder_sec.js)
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

function check() {
    // Читаем выбранные блюда из скрытых полей, которые обновляет orderManager
    function getVal(id) {
        const el = document.getElementById(id);
        if (!el) return null;
        const v = (el.value || '').trim();
        return v === '' ? null : v;
    }

    const selected = {
        soup: getVal('soup-name'),
        starter: getVal('salat-name'),
        main: getVal('main-name'),
        dessert: getVal('dessert-name'),
        drink: getVal('drink-name')
    };

    return selected;
}

function uve(selectedDishes) {
    // Считаем количество выбранных блюд (не суммируем объекты)
    const selectedCount = Object.values(selectedDishes).filter(v => v !== null && v !== '').length;
    let message = "";
    
    if (selectedCount === 0) {
        message = "У вас ничего не выбрано";
    } else if (selectedDishes.drink === null && selectedCount >= 1) {
        message = "Выберите напиток";
    } else if (selectedDishes.soup !== null && selectedCount <= 2) {
        message = "Добавьте главное блюдо/салат/стартер";
    } else if (selectedDishes.starter !== null && selectedCount <= 2) {
        message = "Добавьте суп или главное блюдо";
    } else if (selectedDishes.drink !== null && selectedCount === 1) {
        message = "Добавьте главное блюдо";
    }
    return message;
}

function showMessage(text) {
    // Находим блок уведомления
    let uvedElement = document.getElementById('uved');

    let messageElement = uvedElement.querySelector('p');
    let buttonElement = uvedElement.querySelector('#OK') || uvedElement.querySelector('button');
    
    // Меняем текст сообщения
    if (messageElement) messageElement.textContent = text;
    
    // Показываем блок (если он скрыт)
    uvedElement.style.display = 'flex';
    
    // Добавляем обработчик на кнопку "Окей"
    if (buttonElement) {
        buttonElement.onclick = function() {
            uvedElement.style.display = 'none';
        };
    }
}