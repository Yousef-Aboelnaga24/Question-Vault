let pageKey = "englishCards";

let btnCreate = document.getElementById("create");

btnCreate.addEventListener("click", (event) => {
    event.preventDefault();

    let questionText = document.getElementById("front").value.trim();
    let back = document.getElementById("back").value.trim();
    let box = document.getElementById("box");

    if (!questionText || !back) {
        alert("Please fill out all fields!");
        return;
    }

    let existingQuestions = [...document.querySelectorAll(".card .back p")];
    if (existingQuestions.some(q => q.innerText.trim() === questionText)) {
        alert("The question already exists!");
        return;
    }

    let cardHTML = `
        <div class="card pt-2" onclick="flipCard(this)">
            <div class="btns">
                <button onclick='deleteCard(this)' class="btn btn-sm"><i class="fa fa-close fs-5 text-black"></i></button>
                <button onclick='update(this)' class="btn btn-sm"><i class="fa fa-marker fs-6 text-black"></i></button>
            </div>
            <div class="front"><p>${back}</p></div>
            <div class="back"><p>${questionText}</p></div>
        </div>`;

    box.innerHTML += cardHTML;
    document.getElementById("front").value = "";
    document.getElementById("back").value = "";

    let cards = JSON.parse(localStorage.getItem(pageKey)) || [];
    cards.push({ question: questionText, answer: back });
    localStorage.setItem(pageKey, JSON.stringify(cards));
});

window.addEventListener("DOMContentLoaded", () => {
    let storedCards = JSON.parse(localStorage.getItem(pageKey)) || [];
    let box = document.getElementById("box");

    storedCards.forEach(card => {
        box.innerHTML += `
            <div class="card pt-2" onclick="flipCard(this)">
                <div class="btns">
                    <button onclick='deleteCard(this)' class="btn btn-sm"><i class="fa fa-close fs-5 text-black"></i></button>
                    <button onclick='update(this)' class="btn btn-sm"><i class="fa fa-marker fs-6 text-black"></i></button>
                </div>
                <div class="front"><p>${card.answer}</p></div>
                <div class="back"><p>${card.question}</p></div>
            </div>`;
    });
});

function flipCard(card) {
    card.classList.toggle("flip");
}

document.getElementById('deleteAll').addEventListener('click', () => {
    document.getElementById('box').innerHTML = '';
    localStorage.removeItem(pageKey);
});

function deleteCard(button) {
    let card = button.closest(".card");
    let question = card.querySelector(".back p").innerText;
    let cards = JSON.parse(localStorage.getItem(pageKey)) || [];

    let updatedCards = cards.filter(c => c.question !== question);
    localStorage.setItem(pageKey, JSON.stringify(updatedCards));

    card.remove();
}

function update(button) {
    let cardElement = button.closest(".card");
    let question = cardElement.querySelector(".back p").innerText;
    let answer = cardElement.querySelector(".front p").innerText;
    let cards = JSON.parse(localStorage.getItem(pageKey)) || [];

    let cardIndex = cards.findIndex(c => c.question === question && c.answer === answer);

    if (cardIndex !== -1) {
        let newQuestion = prompt("أدخل السؤال الجديد:", cards[cardIndex].question);
        let newAnswer = prompt("أدخل رقم السؤال الجديدة:", cards[cardIndex].answer);

        if (newQuestion?.trim()) {
            cards[cardIndex].question = newQuestion;
            cardElement.querySelector(".back p").innerText = newQuestion;
        }
        if (newAnswer?.trim()) {
            cards[cardIndex].answer = newAnswer;
            cardElement.querySelector(".front p").innerText = newAnswer;
        }

        localStorage.setItem(pageKey, JSON.stringify(cards));
    }
}