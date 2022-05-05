// Arreglo de productos
const productsList = [
    {
        id: '1000', 
        nombre: 'Caldera Orbis 230TDO', 
        descripcion: 'Caldera para piscina 30.000kcal', 
        precio: 100318, 
        imagen: '../assets/products/230tdo.webp' 
    },
    { 
        id: '1001', 
        nombre: 'Caldera Peisa Diva Duo', 
        descripcion: 'Caldera tiro natural 24.000kcal', 
        precio: 166000, 
        imagen: '../assets/products/diva.webp' },
    { 
        id: '1002', 
        nombre: 'Caldera Ariston 24ff', 
        descripcion: 'Caldera tiro forzado 25.800kcal', 
        precio: 173255, 
        imagen: '../assets/products/24ff.webp' 
    },
    { 
        id: '1003', 
        nombre: 'Caldera Baxi 24Kw', 
        descripcion: 'Caldera tiro forzado balanceado 24Kw', 
        precio: 174999, 
        imagen: '../assets/products/econova.webp' 
    },
    { 
        id: '1004', 
        nombre: 'Kit losa radiante Servel', 
        descripcion: 'Kit completo de losa radiante 7 a 9m2', 
        precio: 18114, 
        imagen: '../assets/products/servel.webp' 
    },
    { 
        id: '1005', 
        nombre: 'Multisplit Samsung', 
        descripcion: 'Multisplit Inverter Samsung 4a1 3x2300fg + 1x5500fg Ue 10kw', 
        precio: 680000, 
        imagen: '../assets/products/multisplit.webp' 
    },
    { 
        id: '1006', 
        nombre: 'Aire acondicionado Split LG', 
        descripcion: 'Aire acondicionado LG split inverter frío/calor 9000 frigorías blanco 220V AVNW36GM1S0', 
        precio: 399483, 
        imagen: '../assets/products/split.webp' 
    },
    { 
        id: '1007', 
        nombre: 'Salamandra Tromen Chaltén', 
        descripcion: 'Salamandra Tromen Chaltén de 9000kcal/h', 
        precio: 103239, 
        imagen: '../assets/products/chalten.webp' 
    },
    { 
        id: '1008', 
        nombre: 'Salamandra Tromen Pehuén', 
        descripcion: 'Salamandra Tromen Pehuén P-7500',
        precio: 48999,
        imagen: '../assets/products/pehuen.webp' 
    },
    { 
        id: '1009', 
        nombre: 'Tiro balanceado Volcan', 
        descripcion: 'Calefactor Tiro Balanceado Volcan 5700kcal', 
        precio: 32158, 
        imagen: '../assets/products/volcan.webp' 
    }
];

// Genera las tarjetas de productos
function generateProductsHtml(products) {
    let html = '';
    products.forEach(product => {
        html += `<div class="product__card">
                     <div class="product__card__image">
                        <img src="${product.imagen}"/>
                     </div>
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
    html += `</tbody>
             </table>
             <div id="cart__total">
                 <p>Total: $ ${getCartTotal()}</p>
             </div>`;
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
            saveCart();
        } else {
            cart[idx].cantidad += qty;
            showPopup(`${qty} ${cartItem.nombre} agregado al carrito`);
            saveCart();
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
        saveCart();
        if (cart[idx].cantidad <= 0) { // Si ya no hay existencias en el carrito quita el producto
            showPopup(`${cart[idx].nombre} eliminado del carrito`);
            cart.splice(idx, 1);
            saveCart();
        }
    }
}

// Devuelve el importe total del carrito
function getCartTotal() {
    let total = 0;
    cart.forEach(product => {
        total += product.precio * product.cantidad;
    });
    return total;
}

// Guarda el carrito en Local Storage
function saveCart() {
    cart.length > 0 ? localStorage.setItem('cart', JSON.stringify(cart)) : localStorage.removeItem('cart');
}

// Carga el carrito de Local Storage
function loadCart() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        cart = JSON.parse(cartData);
        showPopup('Carrito cargado');
    }
}

// Muestra mensaje emergente
function showPopup (message) {
    // popup.innerHTML = message;
    // popup.style.display = 'flex';
    // setTimeout ( function () { popup.style.display='none' }, 1000 );
    Toastify({
        text: message,
        duration: 4000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#202020",
        },
      }).showToast();
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
    cart.length > 0 ? addEventListenersToDeleteButtons() : cartContainer.innerHTML = '<h2>Carrito vacío</h2>';
}

// Crea el carrito
let cart = [];
// Carga el html de productos en el div#products
document.getElementById('products').innerHTML = generateProductsHtml(productsList);
// Prepara los mensajes emergentes...
document.querySelector('body').insertAdjacentHTML("afterbegin","<div id='popup__message'></div>");
const popup = document.querySelector('#popup__message');
// Agrega event listeners a los botones de agregar producto
addEventListenersToForms();
// Agrega event listener al boton de carrito
document.getElementsByClassName('fa-cart-shopping')[0].addEventListener('click', showCart);
// Carga el carrito de Local Storage
loadCart();