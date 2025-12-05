document.addEventListener('DOMContentLoaded', function() {
    
    // Сортируем блюда по алфавиту
    loadDishes().then(dishes =>{
        let sortedDishes=dishes.sort((a, b) => a.name.localeCompare(b.name)); // сортируем

    // Отображаем блюда по категориям - ИСПРАВЛЕНЫ ID СЕКЦИЙ
    displayDishesByCategory(sortedDishes, 'soup', 'soup');
    displayDishesByCategory(sortedDishes, 'main-course', 'main'); 
    displayDishesByCategory(sortedDishes, 'salad', 'salat'); 
    displayDishesByCategory(sortedDishes, 'drink', 'Drinks'); 
    displayDishesByCategory(sortedDishes, 'dessert', 'dessert');});
});


function loadDishes() {
    return fetch(`${API_CONFIG.BASE_URL}/dishes?api_key=${API_CONFIG.API_KEY}`)
        .then(response => response.json());
}



function displayDishesByCategory(dishesArray, category, sectionId) {
    const section = document.getElementById(sectionId);
    
    const dishesContainer = section.querySelector('.dishes-container');
    
    // Очищаем контейнер
    dishesContainer.innerHTML = '';
    
    // Фильтруем блюда по категории
    const categoryDishes = dishesArray.filter(dish => dish.category === category);
    
    // Создаем карточки для каждого блюда
    categoryDishes.forEach(dish => {
        const dishElement = createDishElement(dish);
        dishesContainer.appendChild(dishElement);
    });
}

function createDishElement(dish) {
    const dishDiv = document.createElement('div');
    dishDiv.className = 'dish';
    dishDiv.setAttribute('data-dish', dish.keyword);
    
    dishDiv.innerHTML = `
        <div class="dish-content">
            <img src="${dish.image}" alt="${dish.name}" class="dish-image">
            <div class="dish-price">${dish.price} ₽</div>
            <div class="dish-name">${dish.name}</div>
            <div class="dish-weight">${dish.count}</div>
            <button class="add-button" type="button">Добавить</button>
        </div>
    `;
    
    return dishDiv;
}