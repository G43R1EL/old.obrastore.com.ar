function mobileMenuToggler() {
    if ( menu.style.display === "block" ) {
        menu.style.display = "none";
        menu_icon.innerHTML = barsIcon;
    } else {
        menu.style.display = "block";
        menu_icon.innerHTML = closeIcon;
    }
}

const menu_icon = document.getElementById('nav__icon');
const menu = document.getElementById('nav__main');
const barsIcon = '<i class="fa-solid fa-bars"></i>';
const closeIcon = '<i class="fa-solid fa-xmark"></i>';

if (document.body.clientWidth < 992) {
    menu_icon.innerHTML = barsIcon;
    menu.style.display = "none";
}