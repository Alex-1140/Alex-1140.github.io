document.addEventListener('DOMContentLoaded', function() {
    let orders = [];
    let dishes = [];

    // Загружаем заказы и блюда
    Promise.all([
        loadOrders(),
        loadDishes()
    ]).then(([ordersData, dishesData]) => {
        orders = ordersData;
        dishes = dishesData;
        displayOrders(orders);
    }).catch(error => {
        console.error('Error loading data:', error);
        showErrorMessage('Ошибка загрузки данных');
    });

    function loadOrders() {
        return fetch(`${API_CONFIG.BASE_URL}/orders?api_key=${API_CONFIG.API_KEY}`)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки заказов');
                return response.json();
            });
    }

    function loadDishes() {
        return fetch(`${API_CONFIG.BASE_URL}/dishes?api_key=${API_CONFIG.API_KEY}`)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки блюд');
                return response.json();
            });
    }

    function displayOrders(ordersList) {
        const ordersSection = document.getElementById('orders');
        const table = ordersSection.querySelector('#table');
        
        // Очищаем существующие заказы (кроме заголовков)
        const existingOrders = ordersSection.querySelectorAll('.order-row');
        existingOrders.forEach(order => order.remove());

        // Сортируем по дате (новые сначала)
        const sortedOrders = ordersList.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
        );

        // Отображаем заказы
        sortedOrders.forEach((order, index) => {
            const orderRow = createOrderRow(order, index + 1);
            ordersSection.appendChild(orderRow);
        });

        // Если заказов нет
        if (sortedOrders.length === 0) {
            const noOrders = document.createElement('div');
            noOrders.className = 'no-orders';
            noOrders.innerHTML = '<p>У вас пока нет заказов</p>';
            ordersSection.appendChild(noOrders);
        }
    }

    function createOrderRow(order, number) {
        const orderRow = document.createElement('div');
        orderRow.className = 'order-row';
        orderRow.setAttribute('data-order-id', order.id);

        const orderComposition = getOrderComposition(order);
        const deliveryTime = getDeliveryTimeDisplay(order);
        const totalPrice = calculateOrderTotal(order);

        orderRow.innerHTML = `
            <p>${number}</p>
            <p>${formatDate(order.created_at)}</p>
            <p>${orderComposition}</p>
            <p>${totalPrice} ₽</p>
            <p>${deliveryTime}</p>
            <div class="order-actions">
                <button class="btn-details" title="Подробнее">👁️</button>
                <button class="btn-edit" title="Редактировать">✏️</button>
                <button class="btn-delete" title="Удалить">🗑️</button>
            </div>
        `;

        // Добавляем обработчики событий
        orderRow.querySelector('.btn-details').addEventListener('click', () => showOrderDetails(order));
        orderRow.querySelector('.btn-edit').addEventListener('click', () => editOrder(order));
        orderRow.querySelector('.btn-delete').addEventListener('click', () => deleteOrder(order));

        return orderRow;
    }

    function getOrderComposition(order) {
        const dishNames = [];
        
        if (order.soup_id) {
            const dish = dishes.find(d => d.id === order.soup_id);
            if (dish) dishNames.push(dish.name);
        }
        if (order.salad_id) {
            const dish = dishes.find(d => d.id === order.salad_id);
            if (dish) dishNames.push(dish.name);
        }
        if (order.main_course_id) {
            const dish = dishes.find(d => d.id === order.main_course_id);
            if (dish) dishNames.push(dish.name);
        }
        if (order.drink_id) {
            const dish = dishes.find(d => d.id === order.drink_id);
            if (dish) dishNames.push(dish.name);
        }
        if (order.dessert_id) {
            const dish = dishes.find(d => d.id === order.dessert_id);
            if (dish) dishNames.push(dish.name);
        }

        return dishNames.join(', ') || 'Блюда не выбраны';
    }

    function calculateOrderTotal(order) {
        let total = 0;
        
        if (order.soup_id) {
            const dish = dishes.find(d => d.id === order.soup_id);
            if (dish) total += dish.price;
        }
        if (order.salad_id) {
            const dish = dishes.find(d => d.id === order.salad_id);
            if (dish) total += dish.price;
        }
        if (order.main_course_id) {
            const dish = dishes.find(d => d.id === order.main_course_id);
            if (dish) total += dish.price;
        }
        if (order.drink_id) {
            const dish = dishes.find(d => d.id === order.drink_id);
            if (dish) total += dish.price;
        }
        if (order.dessert_id) {
            const dish = dishes.find(d => d.id === order.dessert_id);
            if (dish) total += dish.price;
        }

        return total;
    }

    function getDeliveryTimeDisplay(order) {
        if (order.delivery_type === 'by_time' && order.delivery_time) {
            return order.delivery_time;
        }
        return 'Как можно скорее (с 7:00 до 23:00)';
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Модальные окна
    function showOrderDetails(order) {
        const modal = createModal('details');
        const orderComposition = getOrderComposition(order);
        const totalPrice = calculateOrderTotal(order);

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Детали заказа #${order.id}</h3>
                <div class="order-details">
                    <p><strong>Дата оформления:</strong> ${formatDate(order.created_at)}</p>
                    <p><strong>Имя:</strong> ${order.full_name}</p>
                    <p><strong>Email:</strong> ${order.email}</p>
                    <p><strong>Телефон:</strong> ${order.phone}</p>
                    <p><strong>Адрес доставки:</strong> ${order.delivery_address}</p>
                    <p><strong>Тип доставки:</strong> ${order.delivery_type === 'by_time' ? 'К указанному времени' : 'Как можно скорее'}</p>
                    ${order.delivery_time ? `<p><strong>Время доставки:</strong> ${order.delivery_time}</p>` : ''}
                    ${order.comment ? `<p><strong>Комментарий:</strong> ${order.comment}</p>` : ''}
                    <p><strong>Состав заказа:</strong> ${orderComposition}</p>
                    <p><strong>Общая стоимость:</strong> ${totalPrice} ₽</p>
                </div>
                <div class="modal-buttons">
                    <button class="btn-ok">Ок</button>
                </div>
            </div>
        `;

        setupModalEvents(modal, 'details', order);
    }

    function editOrder(order) {
        const modal = createModal('edit');
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Редактирование заказа #${order.id}</h3>
                <form class="edit-form">
                    <div class="form-group">
                        <label for="edit-full_name">Имя:</label>
                        <input type="text" id="edit-full_name" name="full_name" value="${order.full_name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-email">Email:</label>
                        <input type="email" id="edit-email" name="email" value="${order.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-phone">Телефон:</label>
                        <input type="tel" id="edit-phone" name="phone" value="${order.phone}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-delivery_address">Адрес доставки:</label>
                        <input type="text" id="edit-delivery_address" name="delivery_address" value="${order.delivery_address}" required>
                    </div>
                    <div class="form-group">
                        <label>Тип доставки:</label>
                        <div class="radio-group">
                            <label>
                                <input type="radio" name="delivery_type" value="now" ${order.delivery_type === 'now' ? 'checked' : ''}>
                                Как можно скорее
                            </label>
                            <label>
                                <input type="radio" name="delivery_type" value="by_time" ${order.delivery_type === 'by_time' ? 'checked' : ''}>
                                К указанному времени
                            </label>
                        </div>
                    </div>
                    <div class="form-group" id="edit-delivery-time-group" style="${order.delivery_type === 'by_time' ? '' : 'display: none;'}">
                        <label for="edit-delivery_time">Время доставки:</label>
                        <input type="time" id="edit-delivery_time" name="delivery_time" value="${order.delivery_time || ''}">
                    </div>
                    <div class="form-group">
                        <label for="edit-comment">Комментарий:</label>
                        <textarea id="edit-comment" name="comment">${order.comment || ''}</textarea>
                    </div>
                </form>
                <div class="modal-buttons">
                    <button class="btn-save">Сохранить</button>
                    <button class="btn-cancel">Отмена</button>
                </div>
            </div>
        `;

        // Обработчик изменения типа доставки
        modal.querySelectorAll('input[name="delivery_type"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const timeGroup = modal.querySelector('#edit-delivery-time-group');
                timeGroup.style.display = this.value === 'by_time' ? 'block' : 'none';
            });
        });

        setupModalEvents(modal, 'edit', order);
    }

    function deleteOrder(order) {
        const modal = createModal('delete');
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Удаление заказа</h3>
                <p>Вы уверены, что хотите удалить заказ #${order.id}?</p>
                <div class="modal-buttons">
                    <button class="btn-yes">Да</button>
                    <button class="btn-cancel">Отмена</button>
                </div>
            </div>
        `;

        setupModalEvents(modal, 'delete', order);
    }

    function createModal(type) {
        // Удаляем существующие модальные окна
        const existingModals = document.querySelectorAll('.order-modal');
        existingModals.forEach(modal => modal.remove());

        const modal = document.createElement('div');
        modal.className = `order-modal modal-${type}`;
        document.body.appendChild(modal);
        
        return modal;
    }

    function setupModalEvents(modal, type, order) {
        const closeBtn = modal.querySelector('.close');
        const cancelBtns = modal.querySelectorAll('.btn-cancel');
        const okBtn = modal.querySelector('.btn-ok');

        // Закрытие по крестику
        closeBtn.addEventListener('click', () => modal.remove());

        // Закрытие по кнопкам Отмена/Ок
        if (cancelBtns.length > 0) {
            cancelBtns.forEach(btn => btn.addEventListener('click', () => modal.remove()));
        }
        if (okBtn) {
            okBtn.addEventListener('click', () => modal.remove());
        }

        // Обработка действий
        switch(type) {
            case 'edit':
                const saveBtn = modal.querySelector('.btn-save');
                saveBtn.addEventListener('click', () => saveOrderChanges(order.id, modal));
                break;
            case 'delete':
                const yesBtn = modal.querySelector('.btn-yes');
                yesBtn.addEventListener('click', () => confirmDelete(order.id, modal));
                break;
        }

        // Закрытие по клику вне модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    function saveOrderChanges(orderId, modal) {
        const form = modal.querySelector('.edit-form');
        const formData = new FormData(form);
        
        const updateData = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            delivery_address: formData.get('delivery_address'),
            delivery_type: formData.get('delivery_type'),
            comment: formData.get('comment')
        };

        // Добавляем время доставки если нужно
        if (updateData.delivery_type === 'by_time') {
            updateData.delivery_time = formData.get('delivery_time');
        }

        fetch(`${API_CONFIG.BASE_URL}/orders/${orderId}?api_key=${API_CONFIG.API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка обновления заказа');
            return response.json();
        })
        .then(updatedOrder => {
            // Обновляем заказ в массиве
            const index = orders.findIndex(order => order.id === orderId);
            if (index !== -1) {
                orders[index] = updatedOrder;
            }
            displayOrders(orders);
            modal.remove();
            showSuccessMessage('Заказ успешно изменён');
        })
        .catch(error => {
            console.error('Error updating order:', error);
            showErrorMessage('Ошибка при изменении заказа');
        });
    }

    function confirmDelete(orderId, modal) {
        fetch(`${API_CONFIG.BASE_URL}/orders/${orderId}?api_key=${API_CONFIG.API_KEY}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка удаления заказа');
            // Удаляем заказ из массива
            orders = orders.filter(order => order.id !== orderId);
            displayOrders(orders);
            modal.remove();
            showSuccessMessage('Заказ успешно удалён');
        })
        .catch(error => {
            console.error('Error deleting order:', error);
            showErrorMessage('Ошибка при удалении заказа');
        });
    }

    function showSuccessMessage(message) {
        alert('✅ ' + message);
    }

    function showErrorMessage(message) {
        alert('❌ ' + message);
    }
});