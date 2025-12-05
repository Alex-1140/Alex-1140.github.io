document.addEventListener('DOMContentLoaded', function() {
    // Объект для хранения активных фильтров по категориям
    const activeFilters = {
        soup: null,
        salat: null,
        main: null,
        dessert: null,
        Drinks: null
    };

    // Инициализация фильтров
    initializeFilters();

    function initializeFilters() {
        // Находим ВСЕ кнопки фильтров на странице
const allFilterButtons = document.querySelectorAll('.filter-btn');

// Перебираем каждую кнопку по очереди
allFilterButtons.forEach(function(filterButton) {
    
    // На каждую кнопку вешаем "слушатель" кликов
    filterButton.addEventListener('click', function() {
        
        // Когда кнопку нажали - находим её родительскую секцию
        const parentSection = this.closest('section');
        
        // Узнаем ID секции (soup, salat, main...)
        const sectionId = parentSection.id;
        
        // Узнаем тип фильтра (all, fish, meat, veg...)
        const filterType = this.getAttribute('data-kind');
        
        // Запускаем функцию переключения фильтра
        toggleFilter(sectionId, filterType, this);
    });
});
    }

   function toggleFilter(category, kind, button) {
    const section = button.closest('section');
    const isAlreadyActive = button.classList.contains('active');
    
    // Снимаем активный класс со всех кнопок в этой категории
    section.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Если кликаем на уже активный фильтр - сбрасываем фильтр
    // Если кликаем на другой фильтр - устанавливаем новый
    if (isAlreadyActive) {
        activeFilters[category] = null;
    } else {
        activeFilters[category] = kind;
        button.classList.add('active');
    }
    
    // Применяем фильтры
    applyFilters();
}


    
    function applyFilters() {
        // Получаем все секции с блюдами
        const sections = ['soup', 'salat', 'main', 'dessert', 'Drinks'];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            
            const dishesContainer = section.querySelector('.dishes-container');
            
            const activeFilter = activeFilters[sectionId];
            
            // Скрываем/показываем блюда в зависимости от фильтра
            dishesContainer.querySelectorAll('.dish').forEach(dishElement => {
                const dishKeyword = dishElement.getAttribute('data-dish');
                const dish = dishes.find(d => d.keyword === dishKeyword);
                
                if (dish && (activeFilter === null || dish.kind === activeFilter)) {
                    dishElement.style.display = 'flex';
                } else {
                    dishElement.style.display = 'none';
                }
            });
        });
    }
});