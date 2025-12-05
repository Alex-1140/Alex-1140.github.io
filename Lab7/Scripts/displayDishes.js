document.addEventListener('DOMContentLoaded', function() {
    
    // Сортируем блюда по алфавиту
    loadDishes().then(dishes =>{
        let sortedDishes=dishes.sort((a, b) => a.name.localeCompare(b.name)); // сортируем

    // Отображаем блюда по категориям - ИСПРАВЛЕНЫ ID СЕКЦИЙ
    displayDishesByCategory(sortedDishes, 'soup', 'soup');
    displayDishesByCategory(sortedDishes, 'main-course', 'main'); 
    displayDishesByCategory(sortedDishes, 'salad', 'salat'); 
    displayDishesByCategory(sortedDishes, 'drink', 'Drinks'); 
    displayDishesByCategory(sortedDishes, 'dessert', 'dessert');}).catch(err => {
        console.error('Не удалось загрузить блюда:', err);
        alert('Не удалось загрузить данные о блюдах. Попробуйте позже.');
    });
});


function loadDishes() {
    return fetch("https://edu.std-900.ist.mospolytech.ru/labs/api/dishes")
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .catch(err => {
            console.error('Ошибка при fetch:', err);
            return [];
        });
}



function displayDishesByCategory(dishesArray, category, sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const dishesContainer = section.querySelector('.dishes-container');
    if (!dishesContainer) return;

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