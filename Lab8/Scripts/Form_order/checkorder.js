document.addEventListener('DOMContentLoaded', function() {
    //обработчик события отправки формы
    document.querySelector('#Заказ form').addEventListener('submit', function(event) {
        // Предотвращаем отправку
        event.preventDefault();
        
        let selectedDishes = check();
        let message = uve(selectedDishes);
        
        if (message === "") {
            // Если проверка пройдена, отправляем заказ
            submitOrder();
        } else {
            showMessage(message);
        }
    });
});

function submitOrder() {
    showLoading(true);
    
    const form = document.querySelector('#Заказ form');
    const formData = new FormData(form);
    
    // Собираем данные заказа
    const orderData = {
        full_name: formData.get('name'),
        email: formData.get('mail'),
        phone: formData.get('tel'),
        delivery_address: formData.get('street'),
        delivery_type: formData.get('time') === 'true' ? 'by_time' : 'now',
        comment: formData.get('order-comment'),
        subscribe: formData.has('subscribe') ? 1 : 0
    };
    
    // Добавляем время доставки
    if (orderData.delivery_type === 'by_time') {
        orderData.delivery_time = formData.get('times');
    }
    
    // Добавляем ID блюд из localStorage
    orderData.soup_id = localStorage.getItem('soup') || null;
    orderData.salad_id = localStorage.getItem('salad') || null;
    orderData.main_course_id = localStorage.getItem('main-course') || null;
    orderData.drink_id = localStorage.getItem('drink') || null;
    orderData.dessert_id = localStorage.getItem('dessert') || null;
    
    // Отправляем запрос
    fetch(`${API_CONFIG.BASE_URL}/orders?api_key=${API_CONFIG.API_KEY}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(orderData)
})
.then(response => response.json())
.then(data => {
    clearLocalStorage();
    showSuccessMessage('Заказ оформлен! ID: ' + data.id);
    form.reset();
    resetOrderSummary();
})
.catch(error => showErrorMessage('Ошибка: ' + error.message))
.finally(() => showLoading(false));
}

function clearLocalStorage() {
    // Удаляем все выбранные блюда из localStorage
    const categories = ['soup', 'salad', 'main-course', 'dessert', 'drink'];
    categories.forEach(category => {
        localStorage.removeItem(category);
    });
}

function resetOrderSummary() {
    // Сбрасываем отображение заказа
    const categories = ['soup', 'starter', 'main', 'dessert', 'drink'];
    
    categories.forEach(category => {
        const element = document.getElementById(`selected-${category}`);
        if (element) {
            const defaultText = category === 'drink' ? 'Напиток не выбран' : 'Блюдо не выбрано';
            element.textContent = defaultText;
            element.style.color = '#666';
            element.style.fontStyle = 'italic';
        }
    });
    
    // Сбрасываем общую стоимость
    document.getElementById('total-amount').textContent = '0Р';
    document.getElementById('total-price-value').value = '0';
    
    // Очищаем контейнер с блюдами
    const dishesContainer = document.querySelector('.dishes-container');
    if (dishesContainer) {
        dishesContainer.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Нет выбранных блюд</p>';
    }
}

function showSuccessMessage(message) {
    alert('Success' + message);
}

function showErrorMessage(message) {
    alert('Error' + message);
}

function showLoading(show) {
    const submitButton = document.querySelector('#Заказ form input[type="submit"]');
    if (submitButton) {
        if (show) {
            submitButton.value = 'Отправка...';
            submitButton.disabled = true;
        } else {
            submitButton.value = 'Отправить';
            submitButton.disabled = false;
        }
    }
}


function check() {
    let selectedDishes = {
        soup: null,
        starter: null,
        main: null,
        dessert: null,
        drink: null
    };
    
    const categories = [
        { storage: 'soup', key: 'soup' },
        { storage: 'salad', key: 'starter' },
        { storage: 'main-course', key: 'main' },
        { storage: 'dessert', key: 'dessert' },
        { storage: 'drink', key: 'drink' }
    ];
    
    categories.forEach(cat => {
        const dishId = localStorage.getItem(cat.storage);
        if (dishId && dishId !== 'null' && dishId !== '') {
            selectedDishes[cat.key] = dishId;
        }
    });
    
    return selectedDishes;
}

function uve(selectedDishes) {
    let selectedCount = 0;
    for (let key in selectedDishes) {
        if (selectedDishes[key] !== null) {
            selectedCount++;
        }
    }
    
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
    let uvedElement = document.getElementById('uved');
    let messageElement = uvedElement.querySelector('p');
    let buttonElement = document.getElementById('OK');
    
    messageElement.textContent = text;
    uvedElement.style.display = 'flex';
    
    buttonElement.onclick = function() {
        uvedElement.style.display = 'none';
    };
}