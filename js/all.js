// Create Card
let btnCreate = document.getElementById("create");
// card ;
btnCreate.addEventListener("click", (event) => {
    event.preventDefault();

    let questionText = document.getElementById("front").value.trim();
    let back = document.getElementById("back").value.trim();
    let box = document.getElementById("box");

    if (questionText === "" || back === "") {
        alert("Please fill out all fields!");
        return;
    }

    let existingQuestions = document.querySelectorAll(".card .back p");

    for (let question of existingQuestions) {
        if (question.innerText.trim() === questionText) {
            alert("The question already exists!");
            return;
        }
    }

    box.innerHTML += `   
        <div class="card pt-2" onclick="flipCard(this)">
            <div class="btns">
                <button id="delete" class="btn btn-sm"><i class="fa fa-close fs-5 text-black"></i></button>
                <button id="update" class="btn btn-sm"><i class="fa fa-marker fs-6 text-black"></i></button>
            </div>
            <div class="front">
                <p>${back}</p>
            </div>
            <div class="back">
                <p>${questionText}</p>
            </div>
        </div>`;

    document.getElementById("front").value = "";
    document.getElementById("back").value = "";

    let cards = JSON.parse(localStorage.getItem("cards")) || [];
    cards.push({ question: questionText, answer: back });
    localStorage.setItem("cards", JSON.stringify(cards));
});

// تحميل الكروت عند فتح الصفحة
window.addEventListener("DOMContentLoaded", () => {
    let storedCards = JSON.parse(localStorage.getItem("cards")) || [];
    let box = document.getElementById("box");

    storedCards.forEach(card => {
        box.innerHTML += `   
            <div class="card pt-2" onclick="flipCard(this)">
                <div class="btns">
                    <button onclick='deleteCard(this)' class="btn btn-sm"><i class="fa fa-close fs-5 text-black"></i></button>   
                    <button id="update" class="btn btn-sm"><i class="fa fa-marker fs-6 text-black"></i></button>
                </div>
                <div class="front">
                    <p>${card.answer}</p>
                </div>
                <div class="back">
                    <p>${card.question}</p>
                </div>
            </div>`;
    });
});

function flipCard(card) {
    card.classList.toggle("flip");
}
// ----------------------------------------------------------------
// Delete All button
let deleteAll = document.getElementById('deleteAll');

deleteAll.addEventListener('click', () => {
    let box = document.getElementById('box');
    box.innerHTML = '';
    localStorage.removeItem('cards');
})
// ----------------------------------------------------------------
// Delete button
function deleteCard(button) {
    let card = button.closest(".card"); // جلب الكارت التابع للزر المضغوط
    let question = card.querySelector(".back p").innerText; // استخراج السؤال
    
    // جلب جميع الكروت المخزنة
    let cards = JSON.parse(localStorage.getItem("cards")) || [];

    // تصفية الكروت بحيث يتم حذف الكارت الذي يطابق السؤال
    let updatedCards = cards.filter(card => card.question !== question);

    // تحديث localStorage بعد الحذف
    localStorage.setItem("cards", JSON.stringify(updatedCards));

    // حذف الكارت من الصفحة
    card.remove();
}

// ----------------------------------------------------------------
// Update 
// ----------------------------------------------------------------
// Button mode
let themeDark = document.getElementById('dark')
let themeWhite = document.getElementById('white')

window.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('darkMod');
        themeDark.style.display = 'none';
        themeWhite.style.display = 'block';
    } else {
        document.body.classList.add('whiteMod');
        themeDark.style.display = 'block';
        themeWhite.style.display = 'none';
    }
});

themeDark.addEventListener('click', () => {
    document.body.classList.add('darkMod');
    document.body.classList.remove('whiteMod');
    themeDark.style.display = 'none';
    themeWhite.style.display = 'block';
    localStorage.setItem('theme', 'dark');
});

themeWhite.addEventListener('click', () => {
    document.body.classList.add('whiteMod');
    document.body.classList.remove('darkMod');
    themeDark.style.display = 'block';
    themeWhite.style.display = 'none';
    localStorage.setItem('theme', 'light');
});
// ------------------------------------------------------------
// Button top
let btnTop = document.getElementById('btnTop')
window.onscroll = function () {
    if (document.documentElement.scrollTop > 700) {
        btnTop.style.display = 'block';
    } else {
        btnTop.style.display = 'none';
    }
};
btnTop.addEventListener('click', function () {
    document.documentElement.scrollTop = 0;
});
// --------------------------------------------------------------
let btnDisplay = document.getElementById('display');
let template = document.getElementById('createForm');

// إخفاء النموذج افتراضيًا عند تحميل الصفحة
template.style.display = 'none';

btnDisplay.addEventListener('click', function () {
    let isHidden = template.style.display === 'none';
    template.style.display = isHidden ? 'block' : 'none';
    btnDisplay.textContent = isHidden ? 'Hide' : 'Display';
});
// ---------------------------------------------------------------