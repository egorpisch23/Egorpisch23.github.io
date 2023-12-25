document.addEventListener('DOMContentLoaded', function () {
    function toggleBasketCustomCheckbox(checkbox) {
        let span = checkbox.querySelector('span');
        let input = checkbox.querySelector('input[type="checkbox"]');
        let customCheckbox = document.querySelector('.custom-checkbox');
        let span2 = customCheckbox.querySelector('span');
        let input2 = customCheckbox.querySelector('input[type="checkbox"]');

        input.checked = !input.checked;
        span.style.display = input.checked ? 'block' : 'none';
        checkbox.style.backgroundColor = input.checked ? '#4e84be' : '#e8e9eb';

        if (input2.checked == true && customCheckbox != checkbox) {
            input2.checked = false;
            span2.style.display = 'none';
            customCheckbox.style.backgroundColor = '#e8e9eb';
        }
    }

    function checkAndToggleAllCheckboxes() {
        let allCheckboxes = document.querySelectorAll('.basket-custom-checkbox input[type="checkbox"]');
        let allChecked = Array.from(allCheckboxes).every(checkbox => checkbox.checked);

        allCheckboxes.forEach(checkbox => {
            let parentCheckbox = checkbox.closest('.basket-custom-checkbox');
            checkbox.checked = !allChecked;
            let span = parentCheckbox.querySelector('span');
            span.style.display = checkbox.checked ? 'block' : 'none';
            parentCheckbox.style.backgroundColor = checkbox.checked ? '#4e84be' : '#e8e9eb';
        });
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.matches('.basket-custom-checkbox') || event.target.closest('.basket-custom-checkbox')) {
            toggleBasketCustomCheckbox(event.target.closest('.basket-custom-checkbox'));
        }

        if (event.target.matches('.custom-checkbox') || event.target.closest('.custom-checkbox') || event.target.matches('.select-all') || event.target.closest('.select-all')) {
            toggleBasketCustomCheckbox(document.querySelector('.custom-checkbox'));
            checkAndToggleAllCheckboxes();
        }
    });

    function removeSelectedItems() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let selectedProductIds = [];

        document.querySelectorAll('.basket-product-card').forEach(card => {
            let checkbox = card.querySelector('.basket-custom-checkbox input[type="checkbox"]');
            if (checkbox.checked) {
                let productId = card.getAttribute('data-product-id');
                selectedProductIds.push(productId);
            }
        });

        cart = cart.filter(item => !selectedProductIds.includes(item.id));
        
        localStorage.setItem('cart', JSON.stringify(cart));
        refreshUI();
    }

    document.addEventListener('click', function(event) {
        if (event.target.matches('.custom-delete img') || event.target.matches('.custom-delete span')) {
            removeSelectedItems();
        }
    });

    document.body.addEventListener('click', function(event) {
        if (event.target.matches('.checkout-button') || event.target.closest('.checkout-button')) {
            event.preventDefault();
            checkout();
        }
    });

    refreshUI();
});

function updateCartCounter() {
    let main = document.querySelector('main');
    let cart = localStorage.getItem('cart');
    cart = cart ? JSON.parse(cart) : [];

    let totalQuantity = cart.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);

    var badge = document.querySelector('.cart-icon .badge');
    if (badge) {
        badge.textContent = totalQuantity > 99 ? '99+' : totalQuantity;
        badge.style.display = totalQuantity > 0 ? 'block' : 'none';

        if (totalQuantity === 0) {
            let basketContainer = document.querySelector('#basket-container');
            let basketStatus = document.querySelector('.basket-status');
            let checkoutContainer = document.querySelector('#buy-container');
            if (basketContainer) {
                basketContainer.remove();
            }
            if (basketStatus) {
                basketStatus.remove();
            }
            if (checkoutContainer) {
                checkoutContainer.remove();
            }
            main.innerHTML += `
                <div class="empty-basket-message">Корзина пуста!</div>
                <div class="empty-basket-submessage">Перейдите в интернет-магазин и добавьте в корзину интересующий Вас продукт.</div>
                <a href="http://siteinternetcapability.000.pe/?subCategoryId=6" class="store-button">Интернет-магазин</a>
            `;
        } else {
            let productCountText = totalQuantity === 1 ? 'товар' : totalQuantity < 5 ? 'товара' : 'товаров';
            let basketContainer = document.querySelector('#basket-container');
            let basketStatus = document.querySelector('.basket-status');
            let buyContainer = document.querySelector('.buy-container');
            if (basketContainer) {
                basketContainer.remove();
            }
            if (basketStatus) {
                basketStatus.remove();
            }
            if (buyContainer) {
                buyContainer.remove();
            }
            main.innerHTML += `
                <div class="basket-status">
                    <div class="basket-title">Корзина <span class="product-count">${totalQuantity} ${productCountText}</span></div>
                    <div class="custom-checkbox">
                        <input type="checkbox" id="select-all">
                        <span class="no-select">✓</span>
                    </div>
                    <span class="select-all no-select">Вкл/откл все</span>
                    <div class="custom-delete">
                        <img src="delete.ico"></img>
                        <span class="delete-all no-select">Удалить выбранные</span>
                    </div>
                </div>
                <div id="basket-container" class="basket-container" style="display: flex;">
                </div>
            `;
        }
    }
}

function renderCartItems() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let basketContainer = document.getElementById('basket-container');
    let main = document.querySelector('main');
    basketContainer.innerHTML = '';

    cart.forEach(item => {
        basketContainer.innerHTML += `
            <div class="basket-product-card" data-product-id="${item.id}">
                <div class="basket-custom-checkbox">
                    <input type="checkbox" id="item-${item.id}">
                    <span for="item-${item.id}" class="no-select">✓</span>
                </div>
                <img src="${item.image}" class="basket-product-image">
                <div class="basket-product-details">
                    <div class="basket-product-name">${item.name}</div>
                    <div class="basket-product-subcategory">${item.category}</div>
                    <div class="basket-custom-delete">
                        <img src="delete.ico">
                    </div>
                </div>
                <div class="basket-product-details2">
                    <div class="basket-product-price">${item.cost} ₽</div>
                    <div class="basket-product-quantity">${item.quantity} шт.</div>
                </div>
            </div>
            <hr>
        `;
    });

    main.innerHTML += `
    <div class="buy-container" id="buy-container" style="display: none;">
        <div class="total-label">ИТОГО: <span class="cost-label" id="total-price">0.00</span> ₽</div>
        <hr>
        <a href="#" class="checkout-button">Оформить заказ</a>
    </div>
    `
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        refreshUI();
    }
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('basket-custom-delete') || event.target.parentElement.classList.contains('basket-custom-delete')) {
        var productId = event.target.closest('.basket-product-card').getAttribute('data-product-id');
        removeFromCart(productId);
    }
});

function updateTotalCost() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalCost = cart.reduce((sum, item) => sum + (parseFloat(item.cost)), 0);
    document.getElementById('total-price').textContent = totalCost.toFixed(2);
}

function toggleBuyContainer() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let buyContainer = document.getElementById('buy-container');
    if (cart.length > 0) {
        buyContainer.style.display = 'flex';
    } else {
        buyContainer.style.display = 'none';
    }
    updateTotalCost();
}

function refreshUI() {
    updateCartCounter();
    renderCartItems();
    toggleBuyContainer();
}

function displayOrderConfirmation() {
    let messageContainer = document.createElement('div');
    messageContainer.id = 'order-confirmation';

    messageContainer.innerHTML = 'Ваш заказ оформлен!';

    document.body.appendChild(messageContainer);

    setTimeout(() => {
        messageContainer.remove();
    }, 5000);
}

function checkout() {
    let buyContainer = document.getElementById('buy-container');
    buyContainer.style.display = 'none';
    localStorage.setItem('cart', JSON.stringify([]));
    displayOrderConfirmation();
    refreshUI();
}