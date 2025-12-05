document.addEventListener('DOMContentLoaded', function() {
    let orders = [];
    let dishes = [];

    // Загружаем заказы
    Promise.all([
        loadOrders(),
        loadDishes()
    ]).then(([ordersData, dishesData]) => {
        orders = ordersData;
        dishes = dishesData;
        displayOrders(orders);
    }).catch(error => {
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

        // Сортируем по дате
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
                <button class="btn-details" title="Подробнее"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
</svg></button>
                <button class="btn-edit" title="Редактировать"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
</svg></button>
                <button class="btn-delete" title="Удалить"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bucket-fill" viewBox="0 0 16 16">
  <path d="M2.522 5H2a.5.5 0 0 0-.494.574l1.372 9.149A1.5 1.5 0 0 0 4.36 16h7.278a1.5 1.5 0 0 0 1.483-1.277l1.373-9.149A.5.5 0 0 0 14 5h-.522A5.5 5.5 0 0 0 2.522 5m1.005 0a4.5 4.5 0 0 1 8.945 0z"/>
</svg></button>
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
        alert('Выполнено успешно' + message);
    }

    function showErrorMessage(message) {
        alert('Ошибка' + message);
    }
});