let btnKomp = document.getElementById("btnKompis");
let btnDator = document.getElementById("btnDator");
let btnStart = document.getElementById("btnStart");
let formSolo = document.querySelector(".solo");
let formDuo = document.querySelector(".duo");
let btnFort = document.querySelector(".btn-fort"); 
let formContainer = document.querySelector(".form-container");

function showForm() {
    formContainer.style.display = "block";
    if (this.id === "btnKompis") {
        formSolo.style.display = "block";
        formDuo.style.display = "block";
        formSolo.placeholder = "Ange namn för spelare 1";
        formDuo.placeholder = "Ange namn för spelare 2";
        btnFort.style.display = "flex";
    } else if (this.id === "btnDator") {
        formSolo.style.display = "block";
        formDuo.style.display = "none";
        formSolo.placeholder = "Ange ditt namn";
        btnFort.style.display = "flex";
    }
}

btnKomp.addEventListener("click", showForm);
btnDator.addEventListener("click", showForm);

function fortsatt(){
    btnStartContainer.style.display = "block";
}

function redirect(){
    formSolo.style.display = "none";
    formDuo.style.display = "none";
    btnFort.style.display = "none";
}