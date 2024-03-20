let duo;
let diff;

function showFormD() {
    duo = true
    let diff = document.querySelector(".btn-diff")
    let formSolo = document.querySelector(".solo");
    let formDuo = document.querySelector(".duo");
    let btnFort = document.querySelector(".btn-fort"); 
    let formContainer = document.querySelector(".form-container");
    let txt = document.querySelector(".txt2");
    formContainer.style.display = "block";
    formSolo.style.display = "block";
    formDuo.style.display = "block";
    formSolo.placeholder = "Ange namn för spelare 1";
    formDuo.placeholder = "Ange namn för spelare 2";
    btnFort.style.display = "flex";
    btnFort.style.top = "60%";
    diff.style.display = "none";
    txt.style.display = "none";
}

function showFormS() {
    duo = false
    let diff = document.querySelector(".btn-diff")
    let formSolo = document.querySelector(".solo");
    let formDuo = document.querySelector(".duo");
    let btnFort = document.querySelector(".btn-fort"); 
    let formContainer = document.querySelector(".form-container");
    let txt = document.querySelector(".txt2");
    formContainer.style.display = "block";
    formSolo.placeholder = "Ange ditt namn";
    formSolo.style.display = "block";
    formDuo.style.display = "none";
    btnFort.style.display = "flex";
    btnFort.style.top = "70%";
    diff.style.display = "flex";
    txt.style.display = "block";
}

function diffE() {
    diff = 1;
    localStorage.setItem('diff', diff);
}

function diffM() {
    diff = 2;
    localStorage.setItem('diff', diff);
}

function diffH() {
    diff = 3;
    localStorage.setItem('diff', diff);
}

function fortsatt() {
    let formSolo = document.querySelector(".solo");
    let formDuo = document.querySelector(".duo");
    if (formSolo.value.trim() !== "" && formDuo.value.trim() !== "" && duo) {
        btnPvP.style.display = "block";
        let player1Name = formSolo.value.trim();
        let player2Name = formDuo.value.trim();
        localStorage.setItem('player1', player1Name);
        localStorage.setItem('player2', player2Name);

    } else if (formSolo.value.trim() !== "" && !duo) {
        btnPvC.style.display = "block";
        let player1Name = formSolo.value.trim();
        localStorage.setItem('player1', player1Name);
        let player2Name = "Datorn";
        localStorage.setItem('player2', player2Name);
    }
}