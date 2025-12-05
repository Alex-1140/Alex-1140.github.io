document.addEventListener('DOMContentLoaded', function() {
    
    let selectedDishes = {
        soup: null,
        main: null,
        drink: null
    };
    
    // Инициализируем форму заказа
    initializeOrderForm();
    
    // Добавляем обработчики событий для кнопок "Добавить" с делегированием
    document.addEventListener('click', function(e) {
        
        if (e.target.classList.contains('add-button')) {
            const dishElement = e.target.closest('.dish');

            const dishKeyword = dishElement.getAttribute('data-dish');
            
            const dish = dishes.find(d => d.keyword === dishKeyword);
            
            if (dish) {
                addDishToOrder(dish);
                highlightSelectedDish(dishElement);
                updateSelectElements(dish);
            }
        }
    });
    
    // Обработчики для селектов
    document.addEventListener('change', function(e) {
        if (e.target.id === 'soup' || e.target.id === 'maindish' || e.target.id === 'drinks') {
            handleSelectChange(e.target);
        }
    });
    




    function initializeOrderForm() {
        const orderForm = document.querySelector('#Заказ form');
        if (!orderForm) {
            return;
        }
        
        // Добавляем блок с выбранными блюдами и общей стоимостью
        const leftDiv = orderForm.querySelector('.left');
        if (leftDiv) {
            // Проверяем, не добавлен ли уже блок
            if (!document.getElementById('order-summary')) {
                const orderSummaryHTML = `
                    <div id="order-summary" style="margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                        <h4 style="margin-top: 0; color: #333;">Ваш текущий заказ:</h4>
                        
                        <div class="order-category" id="soup-category" style="display: none;">
                            <label style="font-weight: bold;">Суп:</label>
                            <div class="selected-dish" id="selected-soup" style="color: #666; font-style: italic;">Блюдо не выбрано</div>
                        </div>
                        
                        <div class="order-category" id="main-category" style="display: none;">
                            <label style="font-weight: bold;">Главное блюдо:</label>
                            <div class="selected-dish" id="selected-main" style="color: #666; font-style: italic;">Блюдо не выбрано</div>
                        </div>
                        
                        <div class="order-category" id="drink-category" style="display: none;">
                            <label style="font-weight: bold;">Напиток:</label>
                            <div class="selected-dish" id="selected-drink" style="color: #666; font-style: italic;">Напиток не выбран</div>
                        </div>
                        
                        <div id="total-price" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ccc;">
                            <strong style="font-size: 16px; color: #1b1612;">Стоимость заказа: <span id="total-amount">0</span> ₽</strong>
                        </div>
                    </div>
                `;
                
                leftDiv.insertAdjacentHTML('beforeend', orderSummaryHTML);
            }
        }
    }
    





    function addDishToOrder(dish) {
        selectedDishes[dish.category] = dish;
        updateOrderDisplay();
        updateTotalPrice();
    }
    




    function handleSelectChange(selectElement) {
        const selectedValue = selectElement.value;
        
        if (selectedValue && selectedValue !== 'Выберите блюдо') {
            // Находим блюдо по имени (так как в селектах русские названия)
            const dish = dishes.find(d => d.name === selectedValue);
            if (dish) {
                addDishToOrder(dish);
                
                // Находим и выделяем соответствующую карточку блюда
                const dishElement = document.querySelector(`.dish[data-dish="${dish.keyword}"]`);
                if (dishElement) {
                    highlightSelectedDish(dishElement);
                }
            }
        }
    }
    

    function updateSelectElements(dish) {
        // Обновляем соответствующий селект
        let selectId;
        switch(dish.category) {
            case 'soup':
                selectId = 'soupss';
                break;
            case 'main':
                selectId = 'maindish';
                break;
            case 'drink':
                selectId = 'drinks';
                break;
        }
        
        if (selectId) {
            const selectElement = document.getElementById(selectId);
            if (selectElement) {
                selectElement.value = dish.name; // Используем русское название для селекта
            }
        }
    }
    


    function updateOrderDisplay() {
        
        // Обновляем отображение выбранных блюд
        updateCategoryDisplay('soup', 'selected-soup', 'soup-category');
        updateCategoryDisplay('main', 'selected-main', 'main-category');
        updateCategoryDisplay('drink', 'selected-drink', 'drink-category');
        
        // Показываем/скрываем категории
        const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
        
        if (!hasSelectedDishes) {
            document.querySelectorAll('.order-category, #total-price').forEach(el => {
                el.style.display = 'none';
            });

        } else {
            document.querySelectorAll('.order-category').forEach(el => {
                el.style.display = 'block';
            });
        }
    }
    


    function updateCategoryDisplay(category, elementId, categoryId) {
        const element = document.getElementById(elementId);
        const categoryElement = document.getElementById(categoryId);
        
        if (selectedDishes[category]) {
            element.textContent = `${selectedDishes[category].name} - ${selectedDishes[category].price} ₽`;
            element.style.color = '#1b1612';
            element.style.fontStyle = 'normal';
            element.style.fontWeight = 'bold';
            categoryElement.style.display = 'block';
        } else {
            element.textContent = category === 'drink' ? 'Напиток не выбран' : 'Блюдо не выбрано';
            element.style.color = '#666';
            element.style.fontStyle = 'italic';
            element.style.fontWeight = 'normal';
        }
    }



    function updateTotalPrice() {
        const totalElement = document.getElementById('total-amount');
        const totalContainer = document.getElementById('total-price');
        
        if (!totalElement || !totalContainer) {
            console.log('Total elements not found');
            return;
        }
        
        const total = Object.values(selectedDishes)
            .filter(dish => dish !== null)
            .reduce((sum, dish) => sum + dish.price, 0);
        
        totalElement.textContent = total;
        
        // Показываем блок с общей стоимостью только если есть выбранные блюда
        if (total > 0) {
            totalContainer.style.display = 'block';
        } else {
            totalContainer.style.display = 'none';
        }
    }
    
    function highlightSelectedDish(selectedElement) {
        if (!selectedElement) return;
        
        // Определяем категорию выбранного блюда
        const dishKeyword = selectedElement.getAttribute('data-dish');
        const dish = dishes.find(d => d.keyword === dishKeyword);
        if (!dish) return;
        
        console.log('Highlighting dish:', dish.category);
        
        // Убираем выделение со всех блюд в той же категории
        const categorySections = {
            'soup': 'soup',
            'main': 'main', 
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
        console.log('Dish highlighted');
    }
});