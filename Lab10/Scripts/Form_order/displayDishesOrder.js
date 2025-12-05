document.addEventListener('DOMContentLoaded', function() {
    
    // Сортируем блюда по алфавиту
    loadDishes().then(dishes => {
        let sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));

        let selectedDishes = {
            soup: null,
            salat: null,
            main: null,
            dessert: null,
            drink: null
        };
        
        const categories = ['soup', 'salat', 'main', 'dessert', 'drink'];
        
        categories.forEach(category => {
            let storageCategory = category;
            if (category === 'main') storageCategory = 'main-course';
            else if (category === 'salat') storageCategory = 'salad';
            
            const dishId = localStorage.getItem(storageCategory);
            
            if (dishId && dishId !== 'null' && dishId !== '') {
                const dish = sortedDishes.find(d => d.id == dishId);
                if (dish) {
                    selectedDishes[category] = dish;
                    updateOrderFormData(category, dish);
                }
            }
        });

        // Отображаем выбранные блюда
        displaySelectedDishes(selectedDishes);
        updateOrderSummary(selectedDishes); // Добавляем эту функцию!
        
        const deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                delette.call(this);
                // После удаления обновляем summary
                loadDishes().then(dishes => {
                    const updatedSelectedDishes = getSelectedDishes(dishes);
                    updateOrderSummary(updatedSelectedDishes);
                });
            });
        });
    });
});

function getSelectedDishes(dishes) {
    let selectedDishes = {
        soup: null,
        salat: null,
        main: null,
        dessert: null,
        drink: null
    };
    
    const categories = ['soup', 'salat', 'main', 'dessert', 'drink'];
    
    categories.forEach(category => {
        let storageCategory = category;
        if (category === 'main') storageCategory = 'main-course';
        else if (category === 'salat') storageCategory = 'salad';
        
        const dishId = localStorage.getItem(storageCategory);
        
        if (dishId && dishId !== 'null' && dishId !== '') {
            const dish = dishes.find(d => d.id == dishId);
            if (dish) {
                selectedDishes[category] = dish;
            }
        }
    });
    
    return selectedDishes;
}

function updateOrderSummary(selectedDishes) {
    // Обновляем отображение названий блюд в форме
    const categoryMap = {
        'soup': 'soup',
        'salat': 'starter', // Обратите внимание: в HTML это 'starter'
        'main': 'main', 
        'dessert': 'dessert',
        'drink': 'drink'
    };
    
    let totalPrice = 0;
    
    for (let category in selectedDishes) {
        const dish = selectedDishes[category];
        const htmlCategory = categoryMap[category];
        
        if (dish) {
            // Обновляем название блюда
            document.getElementById(`selected-${htmlCategory}`).textContent = dish.name;
            document.getElementById(`selected-${htmlCategory}`).style.color = '#1b1612';
            document.getElementById(`selected-${htmlCategory}`).style.fontStyle = 'normal';
            
            // Добавляем к общей стоимости
            totalPrice += dish.price;
        } else {
            // Сбрасываем на "не выбрано"
            const defaultText = category === 'drink' ? 'Напиток не выбран' : 'Блюдо не выбрано';
            document.getElementById(`selected-${htmlCategory}`).textContent = defaultText;
            document.getElementById(`selected-${htmlCategory}`).style.color = '#666';
            document.getElementById(`selected-${htmlCategory}`).style.fontStyle = 'italic';
        }
    }
    
    // Обновляем общую стоимость
    document.getElementById('total-amount').textContent = totalPrice + 'Р';
    document.getElementById('total-price-value').value = totalPrice;
}

function loadDishes() {
    return fetch(`${API_CONFIG.BASE_URL}/dishes?api_key=${API_CONFIG.API_KEY}`)
        .then(response => response.json());
}

function displaySelectedDishes(selectedDishes) {
    const dishesContainer = document.querySelector('.dishes-container');
    
    // Очищаем контейнер
    dishesContainer.innerHTML = '';
    
    // Создаем карточки для каждого выбранного блюда
    for (let category in selectedDishes) {
        if (selectedDishes[category]) {
            const dishElement = createDishElement(selectedDishes[category], category);
            dishesContainer.appendChild(dishElement);
        }
    }
    
    // Если ничего не выбрано, показываем сообщение
    if (dishesContainer.children.length === 0) {
        dishesContainer.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Нет выбранных блюд</p>';
    }
}

function createDishElement(dish, category) {
    const dishDiv = document.createElement('div');
    dishDiv.className = 'dish';
    
    dishDiv.setAttribute('data-dish-id', dish.id);
    dishDiv.setAttribute('data-category', category);
    
    dishDiv.innerHTML = `
        <div class="dish-content">
            <img src="${dish.image}" alt="${dish.name}" class="dish-image">
            <div class="dish-price">${dish.price} ₽</div>
            <div class="dish-name">${dish.name}</div>
            <div class="dish-weight">${dish.count}</div>
            <button class="delete">Удалить</button>
        </div>
    `;
    
    return dishDiv;
}

function delette() {
    const dishElement = this.closest('.dish');
    const dishId = dishElement.getAttribute('data-dish-id');
    const category = dishElement.getAttribute('data-category');
    
    let storageCategory = category;
    if (category === 'main') storageCategory = 'main-course';
    else if (category === 'salat') storageCategory = 'salad';
    

    document.getElementById(`${category}-name`).value ='';
    document.getElementById(`${category}-price`).value =0;

    localStorage.removeItem(storageCategory);
    
    dishElement.remove();
    
    const dishesContainer = document.querySelector('.dishes-container');
    if (dishesContainer.children.length === 0) {
        dishesContainer.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Нет выбранных блюд</p>';
    }
}

function updateOrderFormData(category, dish) {
    // Обновляем скрытые поля с данными о заказе перед отправкой
    document.getElementById(`${category}-name`).value = dish ? dish.name : '';
    document.getElementById(`${category}-price`).value = dish ? dish.price : 0;
}