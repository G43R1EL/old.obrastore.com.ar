function mobileMenuToggler() {
    if ( menu.style.display === "flex" ) {
        menu.style.display = "none";
        barsIcon.style.display = "block";
        closeIcon.style.display = "none";
        infoBox.style.display = "block";
    } else {
        menu.style.display = "flex";
        barsIcon.style.display = "none";
        closeIcon.style.display = "block";
        infoBox.style.display = "none";
    }
}

const menu_icon = document.getElementById('nav__icon');
const menu = document.getElementById('nav__main');
const barsIcon = document.getElementById('nav__icon-bars');
const closeIcon = document.getElementById('nav__icon-xmark');
const infoBox = document.getElementById('header__info-box');