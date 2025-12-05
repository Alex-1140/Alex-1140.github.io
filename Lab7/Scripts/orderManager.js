document.addEventListener('DOMContentLoaded', function() {
    
    let dishes = [];
    let selectedDishes = {
        soup: null,
        salat: null,
        main: null,
        dessert: null,
        drink: null
    };
    
    // Загружаем блюда и инициализируем менеджер заказов
    loadDishes().then(loadedDishes => {
        dishes = loadedDishes;
        initializeOrderManager();

    document.querySelector('input[type="reset"]').addEventListener('click', function() {
    resetOrder();
});
        
    });

    

    function loadDishes() {
        return fetch("https://edu.std-900.ist.mospolytech.ru/labs/api/dishes")
            .then(response => response.json());
    }
    
    function initializeOrderManager() {
        
        // Добавляем обработчики событий для кнопок "Добавить"
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-button')) {
                const dishElement = e.target.closest('.dish');
                
                const dishKeyword = dishElement.getAttribute('data-dish');
                
                const dish = dishes.find(d => d.keyword === dishKeyword);
                
                
                    addDishToOrder(dish);
                    highlightSelectedDish(dishElement);
            
    }});
    }
    
    function addDishToOrder(dish) {
        
        // Преобразуем категории из API в наши внутренние категории
        let category = dish.category;
        if (category === 'main-course') category = 'main';
        if (category === 'salad') category = 'salat';
        
        selectedDishes[category] = dish;

        updateOrderDisplay();
        updateTotalPrice();
        updateHiddenFields();
    }
    
    function updateOrderDisplay() {

        // Обновляем отображение выбранных блюд в существующем HTML
        updateCategoryDisplay('soup', 'selected-soup');
        updateCategoryDisplay('main', 'selected-main');
        updateCategoryDisplay('salat', 'selected-starter'); // salat → starter в HTML
        updateCategoryDisplay('dessert', 'selected-dessert');
        updateCategoryDisplay('drink', 'selected-drink');
    }
    
    function updateCategoryDisplay(category, elementId) {
        const element = document.getElementById(elementId);
        
        
        
        if (selectedDishes[category]) {
            element.textContent = `${selectedDishes[category].name} - ${selectedDishes[category].price} ₽`;
            element.style.color = '#1b1612';
            element.style.fontStyle = 'normal';
            element.style.fontWeight = 'bold';
        } else {
            element.textContent = category === 'drink' ? 'Напиток не выбран' : 'Блюдо не выбрано';
            element.style.color = '#666';
            element.style.fontStyle = 'italic';
            element.style.fontWeight = 'normal';
        }
    }
    
    function updateTotalPrice() {
        const totalElement = document.getElementById('total-amount');

        const total = Object.values(selectedDishes)
            .filter(dish => dish !== null)
            .reduce((sum, dish) => sum + dish.price, 0);
        
            
        totalElement.textContent = total + ' ₽';
    }
    
    function updateHiddenFields() {
        // Обновляем скрытые поля формы
        updateHiddenField('soup-name', 'soup');
        updateHiddenField('soup-price', 'soup', 'price');
        updateHiddenField('main-name', 'main');
        updateHiddenField('main-price', 'main', 'price');
        updateHiddenField('salat-name', 'salat');
        updateHiddenField('salat-price', 'salat', 'price');
        updateHiddenField('drink-name', 'drink');
        updateHiddenField('drink-price', 'drink', 'price');
        updateHiddenField('dessert-name', 'dessert');
        updateHiddenField('dessert-price', 'dessert', 'price');
        
        // Обновляем общую стоимость
        const total = Object.values(selectedDishes)
            .filter(dish => dish !== null)
            .reduce((sum, dish) => sum + dish.price, 0);
        
        const totalPriceField = document.getElementById('total-price-value');
        if (totalPriceField) {
            totalPriceField.value = total;
        }
    }
    
    function updateHiddenField(fieldId, category, fieldType = 'name') {
        const field = document.getElementById(fieldId);
        if (field && selectedDishes[category]) {
            field.value = fieldType === 'price' ? selectedDishes[category].price : selectedDishes[category].name;
        } else if (field) {
            field.value = '';
        }
    }
    
    function highlightSelectedDish(selectedElement) {
        if (!selectedElement) return;
        
        const dishKeyword = selectedElement.getAttribute('data-dish');
        const dish = dishes.find(d => d.keyword === dishKeyword);
        if (!dish) return;
        
        console.log('Highlighting dish:', dish.category);
        
        // Преобразуем категорию для поиска секции
        let category = dish.category;
        if (category === 'main-course') category = 'main';
        if (category === 'salad') category = 'salat';
        
        // Убираем выделение со всех блюд в той же категории
        const categorySections = {
            'soup': 'soup',
            'salat': 'salat',
            'main': 'main', 
            'dessert': 'dessert',
            'drink': 'Drinks'
        };
        
        const sectionId = categorySections[category];
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
    
    // Обновляем отображение заказа
    updateOrderDisplay();
    updateTotalPrice();
    updateHiddenFields();

    // Сбрасываем текстовые поля к исходному состоянию
    resetOrderSummaryDisplay();
    
    
    
    // Очищаем комментарий к заказу
    const comment = document.querySelector('textarea[name="order-comment"]');
    if (comment) comment.value = '';
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
        totalElement.textContent = '0 ₽';
        totalElement.style.fontSize = '16px';
        totalElement.style.color = '#1b1612';
    }
}
});