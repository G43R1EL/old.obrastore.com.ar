function mobileMenuToggler() {
    if ( menu.style.display === "block" ) {
        menu.style.display = "none";
        menu_icon.innerHTML = barsIcon;
    } else {
        menu.style.display = "block";
        menu_icon.innerHTML = closeIcon;
    }
}

let menu_icon = document.getElementById('nav__icon');
let menu = document.getElementById('nav__main');
let barsIcon = '<i class="fa-solid fa-bars"></i>';
let closeIcon = '<i class="fa-solid fa-xmark"></i>';
menu_icon.innerHTML = barsIcon;
menu.style.display = "none";