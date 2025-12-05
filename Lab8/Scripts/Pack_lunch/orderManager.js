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
        console.log('Dishes loaded:', dishes);

        // Инициализируем selectedDishes из localStorage
        initializeFromLocalStorage();
    
    initializeOrderManager();
    updateOrderDisplay();
    updateTotalPrice();
    updateHiddenFields();
    highlightAllSelectedDishes();
    
    // ОБНОВЛЯЕМ СОСТОЯНИЕ ССЫЛКИ ПРИ ЗАГРУЗКЕ
    updateOrderButtonState();

        // Инициализация кнопки сброса
        const resetButton = document.getElementById('reset');
        console.log('Reset button:', resetButton);
        
        if (resetButton) {
            resetButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Reset button clicked');
                resetOrder();
            });
        } else {
            console.error('Reset button not found!');
        }
    }).catch(error => {
        console.error('Error loading dishes:', error);
    });

    // ДОБАВЬТЕ ЭТУ ФУНКЦИЮ - она отсутствовала
    function initializeFromLocalStorage() {
        const categories = ['soup', 'salat', 'main', 'dessert', 'drink'];
        
        categories.forEach(category => {
            let storageCategory = category;
            if (category === 'main') storageCategory = 'main-course';
            else if (category === 'salat') storageCategory = 'salad';
            
            const dishId = localStorage.getItem(storageCategory);
            console.log(`Loading from localStorage: ${storageCategory} = ${dishId}`);
            
            if (dishId && dishId !== 'null' && dishId !== '' && dishId !== null) {
                const dish = dishes.find(d => d.id == dishId);
                if (dish) {
                    selectedDishes[category] = dish;
                    console.log(`Loaded dish for ${category}:`, dish.name);
                }
            }
        });
        updateOrderButtonState();

    }

function loadDishes() {
    return fetch(`${API_CONFIG.BASE_URL}/dishes?api_key=${API_CONFIG.API_KEY}`)
        .then(response => response.json());
}

function resetOrder() {
    // Сбрасываем выбранные блюда
    selectedDishes = {
        soup: null, salat: null, main: null, dessert: null, drink: null
    };
    
    // Очищаем localStorage
    for (let i in selectedDishes) {
        updatelocalstorage(i, null);
    }
    
    // Скрываем ссылку
    const link = document.getElementById('end');
    if (link) {
        link.style.display = 'none';
    }
    
    updateOrderDisplay();
    updateTotalPrice();
    document.querySelectorAll('.dish').forEach(dish => {
        dish.style.border = '';
    });
}

    
    function initializeOrderManager() {
        console.log('Initializing order manager...');
        
        // Добавляем обработчики событий для кнопок "Добавить"
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-button')) {
                console.log('Add button clicked');
                const dishElement = e.target.closest('.dish');
                
                if (!dishElement) {
                    console.error('Dish element not found');
                    return;
                }
                
                const dishKeyword = dishElement.getAttribute('data-dish');
                console.log('Dish keyword:', dishKeyword);
                
                const dish = dishes.find(d => d.keyword === dishKeyword);
                console.log('Found dish:', dish);
                
                if (dish) {
                    addDishToOrder(dish);
                    highlightSelectedDish(dishElement);
                } else {
                    console.error('Dish not found in dishes array');
                }
            }
        });
    }
    
    function addDishToOrder(dish) {

        let category = dish.category;
        if (category === 'main-course') category = 'main';
        if (category === 'salad') category = 'salat';
        
        
        selectedDishes[category] = dish;
        updatelocalstorage(category, dish.id);
        
        // Обновляем состояние кнопки оформления заказа
        updateOrderButtonState();
        
        updateOrderDisplay();
        updateTotalPrice();
        updateHiddenFields();
    }
    
    // ДОБАВЬТЕ ЭТУ ФУНКЦИЮ для управления состоянием кнопки
function updateOrderButtonState() {
    const link = document.getElementById("end");
    
    // Считаем количество выбранных блюд (исправленная версия)
    let count = 0;
    for (let category in selectedDishes) {
        if (selectedDishes[category] !== null) count++;
    }
    
    // Если ничего не выбрано - скрываем ссылку
    if (count === 0) {
        link.style.display = 'none';
        return;
    }
    
    // Показываем ссылку
    link.style.display = 'inline-block';
    
    // Проверяем, можно ли перейти к оформлению (исправленная логика комбо)
    let canProceed = false;
    
    // Комбо 1: Суп + Главное блюдо + Салат + Напиток
    if (selectedDishes.soup && selectedDishes.main && selectedDishes.salat && selectedDishes.drink) {
        canProceed = true;
    }
    // Комбо 2: Суп + Главное блюдо + Напиток
    else if (selectedDishes.soup && selectedDishes.main && selectedDishes.drink) {
        canProceed = true;
    }
    // Комбо 3: Суп + Салат + Напиток
    else if (selectedDishes.soup && selectedDishes.salat && selectedDishes.drink) {
        canProceed = true;
    }
    // Комбо 4: Главное блюдо + Салат + Напиток
    else if (selectedDishes.main && selectedDishes.salat && selectedDishes.drink) {
        canProceed = true;
    }
    // Комбо 5: Главное блюдо + Напиток
    else if (selectedDishes.main && selectedDishes.drink) {
        canProceed = true;
    }
    // Десерт можно добавить к любому комбо, но не как отдельный заказ
    
    if (canProceed) {
        link.href = "Form_order.html";
        link.style.opacity = "1";
        link.style.pointerEvents = "auto";
    } else {
        link.removeAttribute("href");
        link.style.opacity = "0.5";
        link.style.pointerEvents = "none";
    }
}
    
    function updateOrderDisplay() {
        console.log('Updating order display...');
        
        // Обновляем отображение выбранных блюд в существующем HTML
        updateCategoryDisplay('soup', 'selected-soup');
        updateCategoryDisplay('main', 'selected-main');
        updateCategoryDisplay('salat', 'selected-starter');
        updateCategoryDisplay('dessert', 'selected-dessert');
        updateCategoryDisplay('drink', 'selected-drink');
    }
    
    function updateCategoryDisplay(category, elementId) {
        const element = document.getElementById(elementId);
        
        if (!element) {
            console.error(`Element ${elementId} not found`);
            return;
        }
        
        if (selectedDishes[category]) {
            element.textContent = `${selectedDishes[category].name} - ${selectedDishes[category].price} ₽`;
            element.style.color = '#1b1612';
            element.style.fontStyle = 'normal';
            element.style.fontWeight = 'bold';
            console.log(`Updated ${category}: ${selectedDishes[category].name}`);
        } else {
            element.textContent = category === 'drink' ? 'Напиток не выбран' : 'Блюдо не выбрано';
            element.style.color = '#666';
            element.style.fontStyle = 'italic';
            element.style.fontWeight = 'normal';
            console.log(`Reset ${category}: no dish selected`);
        }
    }
    
    function updateTotalPrice() {
        const totalElement = document.getElementById('total-amount');
        
        if (!totalElement) {
            console.error('Total element not found');
            return;
        }

        const total = Object.values(selectedDishes)
            .filter(dish => dish !== null && typeof dish === 'object')
            .reduce((sum, dish) => {
                const price = dish.price || 0;
                return sum + (typeof price === 'number' ? price : 0);
            }, 0);
        
        totalElement.textContent = total + ' ₽';
        console.log(`Total price updated: ${total} ₽`);
    }
    
    function updateHiddenFields() {
        // Эта функция может быть пустой если у вас нет скрытых полей
        console.log('Updating hidden fields...');
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
        if (!selectedElement) {
            console.error('No selected element provided');
            return;
        }
        
        const dishKeyword = selectedElement.getAttribute('data-dish');
        const dish = dishes.find(d => d.keyword === dishKeyword);
        if (!dish) {
            console.error('Dish not found for highlighting');
            return;
        }
        
        console.log('Highlighting dish:', dish.name);
        
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
        console.log('Border applied to selected dish');
    }

    function updatelocalstorage(category, id) {
        let storageCategory = category;
        if (category === 'main') storageCategory = 'main-course';
        else if (category === 'salat') storageCategory = 'salad';

        localStorage.setItem(storageCategory, id);
        console.log(`Saved to localStorage: ${storageCategory} = ${id}`);
    }

    function getlocalstorage(category) {
        let storageCategory = category;
        if (category === 'main') storageCategory = 'main-course';
        else if (category === 'salat') storageCategory = 'salad';
        
        const dishId = localStorage.getItem(storageCategory);
        const dish = dishes.find(d => d.id == dishId);
        return dish;
    }

    function highlightAllSelectedDishes() {
        console.log('Highlighting all selected dishes...');
        
        // Убираем все старые подсветки
        document.querySelectorAll('.dish').forEach(dishElement => {
            dishElement.style.border = '';
        });
        
        // Подсвечиваем выбранные блюда
        for (let category in selectedDishes) {
            if (selectedDishes[category]) {
                const dishKeyword = selectedDishes[category].keyword;
                const dishElement = document.querySelector(`[data-dish="${dishKeyword}"]`);
                if (dishElement) {
                    dishElement.style.border = '2px solid tomato';
                    console.log(`Highlighted: ${selectedDishes[category].name}`);
                } else {
                    console.warn(`Dish element not found for: ${dishKeyword}`);
                }
            }
        }
    }
});