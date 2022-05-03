// Arreglo de productos
const productsList = [
    {
        id: '1000', 
        nombre: 'No name', 
        descripcion: 'Product has no description', 
        precio: 110, 
        imagen: '../assets/products/empty.webp' 
    },
    { 
        id: '1001', 
        nombre: 'No name', 
        descripcion: 'Product has no description', 
        precio: 1500, 
        imagen: '../assets/products/empty.webp' },
    { 
        id: '1002', 
        nombre: 'No name', 
        descripcion: 'Product has no description', 
        precio: 10, 
        imagen: '../assets/products/empty.webp' 
    },
    { 
        id: '1003', 
        nombre: 'No name', 
        descripcion: 'Product has no description', 
        precio: 200, 
        imagen: '../assets/products/empty.webp' 
    },
    { 
        id: '1004', 
        nombre: 'No name', 
        descripcion: 'Product has no description', 
        precio: 2500, 
        imagen: '../assets/products/empty.webp' 
    },
    { 
        id: '1005', 
        nombre: 'No name', 
        descripcion: 'Product has no description', 
        precio: 250, 
        imagen: '../assets/products/empty.webp' 
    },
    { 
        id: '1006', 
        nombre: 'No name', 
        descripcion: 'Product has no description', 
        precio: 150, 
        imagen: '../assets/products/empty.webp' 
    },
    { 
        id: '1007', 
        nombre: 'No name', 
        descripcion: 'Product has no description', 
        precio: 50, 
        imagen: '../assets/products/empty.webp' 
    },
    { 
        id: '1008', 
        nombre: 'No name', 
        descripcion: 'Product has no description', 
        precio: 700, 
        imagen: '../assets/products/empty.webp' 
    },
    { 
        id: '1009', 
        nombre: 'No name', 
        descripcion: 'Product has no description', 
        precio: 240, 
        imagen: '../assets/products/empty.webp' 
    }
];

// Genera las tarjetas de productos
function generateProductsHtml(products) {
    let html = '';
    products.forEach(product => {
        html += `<div class="product__card">
                     <img src="${product.imagen}"/>
                     <h3>${product.nombre}</h3>
                     <p>${product.descripcion}</p>
                     <p class="price">$ ${product.precio}-</p>
                     <form id="${product.id}">
                         <label for="${product.id}_qty">Cantidad</label>
                         <input type="number" id="${product.id}_qty" name="${product.id}_qty" value="1" min="-99" max="99" required></input>
                         <button type="button">Agregar</button>
                     </form>
                 </div>`;
    });
    return html;
}

// Genera el html del carrito
function generateCartHtml() {
    let html = `<table id="tbl__cart">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                            <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>`;
    cart.forEach(product => {
        html += `<tr>
                    <td>${product.nombre}</td>
                    <td>${product.cantidad}</td>
                    <td>$ ${product.precio}</td>
                    <td>$ ${product.precio * product.cantidad}</td>
                    <td><i class="fa-solid fa-trash-can" id="removeBtn_${product.id}"></i></td>
                </tr>`;
    });
    return html;
}

// Agrega event listener a los botones de agregar producto
function addEventListenersToForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.querySelector('button').addEventListener('click', () => {
            const id = form.id;
            const qty = form.querySelector('input').valueAsNumber;
            addProductToCart(id, qty);
        });
    });
}

// Agrega event listener a los botones de eliminar producto
function addEventListenersToDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.fa-solid.fa-trash-can');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.id.split('_')[1];
            const qty = (cart.find(product => product.id === id).cantidad) * -1;
            removeProductFromCart(id, qty);
            refreshCart();
        });
    });
}

// Obtiene el producto por id
function getProductById(id) {
    return productsList.find(product => product.id === id);
}

// Agrega productos al carrito
function addProductToCart(productId, qty) {
    const product = getProductById(productId);
    const cartItem = {
        id: productId,
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        cantidad: qty
    };
    if (cartItem.qty < 0) { // Si cantidad es negativa quita producto del carrito
        removeProductFromCart(productId, qty);
    } else if (qty > 0) { // Si cantidad es positiva agrega producto al carrito
        // Verifica si el producto ya esta en el carrito
        const idx = cart.findIndex(item => item.id === productId);
        if (idx === -1) {
            cart.push(cartItem);
            showPopup(`${qty} ${cartItem.nombre} agregado al carrito`);
        } else {
            cart[idx].cantidad += qty;
            showPopup(`${qty} ${cartItem.nombre} agregado al carrito`);
        }
    } else { // Si cantidad es 0 advertencia
        showPopup('Cantidad no válida');
    }
}

// Quita productos del carrito
function removeProductFromCart(productId, qty) {
    const idx = cart.findIndex(item => item.id === productId);
    if (idx !== -1) {
        cart[idx].cantidad += qty;
        showPopup(`${qty} ${cart[idx].nombre} del carrito`);
        if (cart[idx].cantidad <= 0) { // Si ya no hay existencias en el carrito quita el producto
            showPopup(`${cart[idx].nombre} eliminado del carrito`);
            cart.splice(idx, 1);
        }
    }
}

// Guarda el carrito en Local Storage
function saveCart() {
    if (cart.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

// Carga el carrito de Local Storage
function loadCart() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        cart = JSON.parse(cartData);
    }
}

// Muestra mensaje emergente
function showPopup (message) {
    popup.innerHTML = message;
    popup.style.display = 'flex';
    setTimeout ( function () { popup.style.display='none' }, 1000 );
}

// Muestra el carrito
function showCart() {
    addModal();
    refreshCart();
}

// Refresca el carrito
function refreshCart() {
    const cartHtml = generateCartHtml();
    const cartContainer = document.querySelector('#modal__content');
    cartContainer.innerHTML = cartHtml;
    if (cart.length > 0) {
        addEventListenersToDeleteButtons();
    }
}

// Crea el carrito
let cart = [];
// Carga el carrito de Local Storage
loadCart();
// Carga el html de productos en el div#products
document.getElementById('products').innerHTML = generateProductsHtml(productsList);
// Prepara los mensajes emergentes...
document.querySelector('body').insertAdjacentHTML("afterbegin","<div id='popup__message'></div>");
const popup = document.querySelector('#popup__message');
// Agrega event listeners a los botones de agregar producto
addEventListenersToForms();
// Agrega event listener al boton de carrito
document.getElementsByClassName('fa-cart-shopping')[0].addEventListener('click', showCart);