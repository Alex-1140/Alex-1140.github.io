document.addEventListener('DOMContentLoaded', function() {
    
    let selectedDishes = {
        soup: null,
        salat: null,
        main: null,
        dessert: null,
        drink: null
    };
    
    // Инициализируем форму заказа
    initializeOrderForm();

    document.querySelector('input[type="reset"]').addEventListener('click', function() {
    resetOrder();
});
    
    // Добавляем обработчики событий для кнопок "Добавить" с делегированием
    document.addEventListener('click', function(e) {
        
        if (e.target.classList.contains('add-button')) {
            const dishElement = e.target.closest('.dish');
            if (!dishElement) {
                return;
            }
            
            const dishKeyword = dishElement.getAttribute('data-dish');
            const dish = dishes.find(d => d.keyword === dishKeyword);
            
            if (dish) {
                addDishToOrder(dish);
                highlightSelectedDish(dishElement);
                updateOrderFormData(dish.category);
            }
        }
    });
    function initializeOrderForm() {
        updateOrderDisplay();
        updateTotalPrice();
    }
    
    function addDishToOrder(dish) {
        selectedDishes[dish.category] = dish;
        updateOrderDisplay();
        updateTotalPrice();
    }
    
    function updateOrderDisplay() {
        // Обновляем отображение выбранных блюд
        updateCategoryDisplay('soup', 'selected-soup');
        updateCategoryDisplay('salat', 'selected-starter');
        updateCategoryDisplay('main', 'selected-main');
        updateCategoryDisplay('dessert', 'selected-dessert');
        updateCategoryDisplay('drink', 'selected-drink');
    }
    
    function updateCategoryDisplay(category, elementId) {
        const element = document.getElementById(elementId);
        
        if (selectedDishes[category]) {
            element.textContent = `${selectedDishes[category].name} ${selectedDishes[category].price}Р`;
            element.style.color = '#1b1612';
            element.style.fontStyle = 'normal';
        } else {
            element.textContent = category === 'drink' ? 'Напиток не выбран' : 'Блюдо не выбрано';
            element.style.color = '#666';
            element.style.fontStyle = 'italic';
        }
    }
    
    function updateTotalPrice() {
        const totalElement = document.getElementById('total-amount');
        
        const total = Object.values(selectedDishes)
            .filter(dish => dish !== null)
            .reduce((sum, dish) => sum + dish.price, 0);
        
        totalElement.textContent = `${total}Р`;
    }
    
function updateOrderFormData(dish_category) {
    const dish = selectedDishes[dish_category];
    
    document.getElementById(`${dish_category}-name`).value = dish ? dish.name : '';
    document.getElementById(`${dish_category}-price`).value = dish ? dish.price : 0;

    const total = Object.values(selectedDishes)
        .filter(dish => dish !== null)
        .reduce((sum, dish) => sum + dish.price, 0);
    document.getElementById('total-price-value').value = total;
}
    
    function highlightSelectedDish(selectedElement) {
        if (!selectedElement) return;
        
        // Определяем категорию выбранного блюда
        const dishKeyword = selectedElement.getAttribute('data-dish');
        const dish = dishes.find(d => d.keyword === dishKeyword);
        if (!dish) return;

        
        // Убираем выделение со всех блюд в той же категории
        const categorySections = {
            'soup': 'soup',
            'salat': 'salat',
            'main': 'main', 
            'dessert': 'dessert',
            'drink': 'Drinks'
        };
        
        const sectionId = categorySections[dish.category];
        if (sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.querySelectorAll('.dish').forEach(dishElement => {
                    dishElement.style.border = '';
                });
            }
        }
        
        // Добавляем выделение выбранному блюду
        selectedElement.style.border = '2px solid tomato';
    }

function resetOrder() {
    selectedDishes = {
        soup: null,
        salat: null,
        main: null,
        dessert: null,
        drink: null
    };

    // Убираем выделение со всех блюд
    document.querySelectorAll('.dish').forEach(dishElement => {
        dishElement.style.border = '';
    });
    
    // Сбрасываем скрытые поля формы
    const hiddenFields = [
        'soup-name', 'soup-price',
        'salat-name', 'salat-price', 
        'main-name', 'main-price',
        'dessert-name', 'dessert-price',
        'drink-name', 'drink-price',
        'total-price-value'
    ];
    
    hiddenFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = '';
        }
    });
    
    // Сбрасываем визуальное отображение
    updateOrderDisplay();
    updateTotalPrice();
    
    // Очищаем комментарий к заказу
    const commentField = document.querySelector('textarea[name="order-comment"]');
    if (commentField) {
        commentField.value = '';
    }
    
    // Принудительно обновляем данные формы
    updateOrderFormData('soup');
    updateOrderFormData('salat');
    updateOrderFormData('main');
    updateOrderFormData('dessert');
    updateOrderFormData('drink');
}

function resetOrderSummaryDisplay() {
    const elements = {
        'soup': 'selected-soup',
        'main': 'selected-main', 
        'salat': 'selected-starter',
        'drink': 'selected-drink',
        'dessert': 'selected-dessert'
    };
    
    for (const [category, elementId] of Object.entries(elements)) {
        const element = document.getElementById(elementId);
        if (element) {
            if (category === 'drink') {
                element.textContent = 'Напиток не выбран';
            } else {
                element.textContent = 'Блюдо не выбрано';
            }
            element.style.color = '#666';
            element.style.fontStyle = 'italic';
        }
    }
    
    // Сбрасываем общую стоимость
    const totalElement = document.getElementById('total-amount');
    if (totalElement) {
        totalElement.textContent = '0Р';
        totalElement.style.fontSize = '16px';
        totalElement.style.color = '#1b1612';
    }
}
});