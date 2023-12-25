document.addEventListener('DOMContentLoaded', function () {
    var addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            var productInfo = {
                id: this.dataset.productId,
                name: this.dataset.name,
                price: this.dataset.price,
                cost: this.dataset.cost,
                image: this.dataset.image,
                category: this.dataset.category,
                quantity: this.dataset.quantity
            };
            
            addToCart(productInfo);
            updateCartCounter();
        });
    });
});

function addToCart(product) {
    let cart = localStorage.getItem('cart');
    cart = cart ? JSON.parse(cart) : [];

    let existingProductIndex = cart.findIndex(item => item.name === product.name);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity = (parseInt(cart[existingProductIndex].quantity) || 0) + 1;
        cart[existingProductIndex].cost = parseFloat(cart[existingProductIndex].cost) + parseFloat(cart[existingProductIndex].price);
        cart[existingProductIndex].cost = cart[existingProductIndex].cost.toFixed(2);
    } else {
        product.cost = parseFloat(product.price).toFixed(2);
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCounter() {
    let cart = localStorage.getItem('cart');
    cart = cart ? JSON.parse(cart) : [];

    let totalQuantity = cart.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);

    var badge = document.querySelector('.cart-icon .badge');
    if (badge) {
        badge.textContent = totalQuantity > 99 ? '99+' : totalQuantity;
        badge.style.display = totalQuantity > 0 ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateCartCounter();
});