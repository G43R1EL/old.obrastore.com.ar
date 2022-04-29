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

// Agrega items en carrito...
function agregarItem(idProducto) {
    let producto = productsList.find(prod => prod.id == idProducto);
    let cantidad = parseInt(document.getElementById(idProducto + "_qty").value);
    if (cantidad < 0) {
        eliminarItem(idProducto,cantidad);
        return;
    };
    if (cantidad >= 1) {
        if (!existe(idProducto)) {
            producto.cantidad = cantidad;
            producto.subtotal = producto.cantidad * producto.precio;
            carrito.push(producto);
        } else {
            let idx = carrito.findIndex(prod => prod.id == idProducto);
            carrito[idx].cantidad += cantidad;
            carrito[idx].subtotal = carrito[idx].cantidad * carrito[idx].precio;
        }
    } else {
        console.log('Debe ingresar un valor numerico mayor a cero');
    }
}

// Quita items del carrito
function eliminarItem(idProducto, cantidad) {
    cantidad *= -1;
    if (existe(idProducto) && cantidad > 0) {
        let idx = carrito.findIndex( prod => prod.id == idProducto );
        if (carrito[idx].cantidad > cantidad) {
            carrito[idx].cantidad -= cantidad;
            carrito[idx].subtotal = carrito[idx].cantidad * carrito[idx].precio;
        } else {
            carrito.splice(idx,1);
        }
    } else {
        console.log('Debe ingresar un valor numerico menor a cero');
    }
}

// Toma la variable productos y genera con ella el html necesario para armar tarjetas de producto.
function listarProductos() {
    let htmlProductsList = '';
    for (const product of productsList) {
        htmlProductsList +=    `<div class="product__card">
                                    <img src="${product.imagen}"/>
                                    <h3>${product.nombre}</h3>
                                    <p>${product.descripcion}</p>
                                    <p class="price">$ ${product.precio}-</p>
                                    <form id="${product.id}">
                                        <label for="${product.id}_qty">Cantidad</label>
                                        <input type="number" id="${product.id}_qty" name="${product.id}_qty" value="1" min="-99" max="99" required></input>
                                        <button type="button" onClick="agregarItem(this.parentNode.id)">Agregar</button>
                                    </form>
                                </div>`;
    };
    return htmlProductsList;
}

// Verifica si un elemento ya existe en el carrito.
function existe(idProducto) {
    if (carrito.find(prod => prod.id == idProducto) === undefined) {
        return false;
    } else {
        return true;
    }
}

// Muestra lista de productos y total de la cuenta
function muestraCarrito () {
    addModal();
    tablaCarrito();
}

// Genera contenido de la tabla del carrito
function tablaCarrito () {
    let modalContent = document.querySelector('#modal__content');
    let message = '';
    let tabla = `<table id="tbl__carrito">
                 <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Acciones</th></tr>\n`;
    let total = 0;
    for (producto of carrito) {
        tabla = tabla + `<tr><td>${producto.nombre}</td><td>${producto.precio}</td><td>${producto.cantidad}</td><td>${producto.subtotal}</td><td><i class="fa-solid fa-trash-can" id="${producto.id}" onClick="eliminarItem(this.id,${producto.cantidad}*-1);tablaCarrito();"></i></td></tr>`;
        total += Number(producto.subtotal);
    }
    tabla = tabla + `</table>
                     <p>Total : $ ${total}</p>
                     <button id="cart__save" type="button" onClick="guardaCarrito()">Guardar carrito...</button>`;
    message = tabla;
    modalContent.innerHTML = message;
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
}

// Guarda el carrito como JSON en LocalStorage
function guardaCarrito () {
        let carritoJSON = JSON.stringify(carrito);
        localStorage.setItem('carrito', carritoJSON);
}

// Carga el carrito de LocalStorage
function cargarCarrito () {
    let carritoJSON = localStorage.getItem('carrito');
    carrito = JSON.parse(carritoJSON);
}

// Carrito de compras
let carrito = [];

// Obtiene el contenedor de los productos y luego asigna el html generado por la función listarProductos().
const mainContent = document.querySelector('#products');
const cartButton = document.querySelector('.fa-cart-shopping');
mainContent.innerHTML = listarProductos();
cartButton.addEventListener("click", muestraCarrito);
cargarCarrito();