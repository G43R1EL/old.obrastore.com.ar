function addModal () {
    body.classList.toggle("modal__active");
    body.insertAdjacentHTML("afterbegin","<div id='modal__container'><div id='modal__form'><div id='modal__header'><i class='fa-solid fa-square-xmark' id='modal__close'></i></div><div id='modal__content'></div></div></div>");
    addListeners();
}

function addListeners () {
    document.getElementById("modal__close").addEventListener("click", removeModal);
    document.addEventListener("keyup", event => { if ( event.key === "Escape" ) { removeModal() }});
}

function removeModal() {
    body.classList.toggle("modal__active");
    body.querySelector("#modal__container").remove();
}

const body = document.querySelector("body");
