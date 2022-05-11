// Lista de productos
const productsList = [];

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
                    <td><i class="fa-solid fa-circle-plus" id="plusBtn_${product.id}"></i>${product.cantidad}<i class="fa-solid fa-circle-minus" id="minusBtn_${product.id}"></i></td>
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

// Agrega event listener a los botones de producto
function addEventListenersToProductsButtons() {
    const deleteButtons = document.querySelectorAll('.fa-solid.fa-trash-can');
    const plusButtons = document.querySelectorAll('.fa-solid.fa-circle-plus');
    const minusButtons = document.querySelectorAll('.fa-solid.fa-circle-minus');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.id.split('_')[1];
            const qty = (cart.find(product => product.id === id).cantidad) * -1;
            removeProductFromCart(id, qty);
            refreshCart();
        });
    });

    plusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.id.split('_')[1];
            const qty = 1;
            addProductToCart(id, qty);
            refreshCart();
        });
    });

    minusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.id.split('_')[1];
            const qty = -1;
            addProductToCart(id, qty);
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
    if (qty < 0) { // Si cantidad es negativa quita producto del carrito
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
    cart.length > 0 ? qtyIndicator.style.visibility = 'visible' : qtyIndicator.style.visibility = 'hidden';
    qtyIndicator.innerHTML = cart.length;
}

// Carga el carrito de Local Storage
function loadCart() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        cart = JSON.parse(cartData);
        showPopup('Carrito cargado');
        cart.length > 0 ? qtyIndicator.style.visibility = 'visible' : qtyIndicator.style.visibility = 'hidden';
        qtyIndicator.innerHTML = cart.length;
    }
}

// Muestra mensaje emergente
function showPopup (message) {
    // popup.innerHTML = message;
    // popup.style.display = 'flex';
    // setTimeout ( function () { popup.style.display='none' }, 1000 );
    Toastify({
        text: message,
        duration: 1000,
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
    cart.length > 0 ? addEventListenersToProductsButtons() : cartContainer.innerHTML = '<h2>Carrito vacío</h2>';
}

// Firebase Realtime Database REST API
async function getProducts() {
    try {
        await fetch("https://crud-51b3a-default-rtdb.firebaseio.com/productos.json")
        .then(response => response.json())
        .then(data => {
            Object.keys(data).forEach(key => {
                productsList.push(data[key]);
            });
        });
        document.getElementById('products').innerHTML = generateProductsHtml(productsList);
        addEventListenersToForms();
    } catch (error) {
        console.log(error);
    }
}

// Crea el carrito
let cart = [];
// Selecciona el indicador de cantidad
const qtyIndicator = document.getElementById("cart_count");
qtyIndicator.style.visibility = 'hidden';
// Carga el html de productos en el div#products
getProducts();
// Agrega event listener al boton de carrito
document.getElementsByClassName('fa-cart-shopping')[0].addEventListener('click', showCart);
// Carga el carrito de Local Storage
loadCart();