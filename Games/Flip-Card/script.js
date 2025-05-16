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
// -------------------------------------------
const key = 'cardData'
let createBtn = document.getElementById('create')
createBtn.addEventListener('click', function () {
    let back = document.getElementById('front').value.trim()
    let front = document.getElementById('back').value.trim()
    let box = document.getElementById('box')
    if (!front || !back) {
        Swal.fire({
            icon: "warning",
            title: "Error!",
            text: "Please fill out all fields!",
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6"
        });
        return;
    }

    let existsQuestion = [...document.querySelectorAll('.card .back p')]
    if (existsQuestion.some(q => q.innerHTML.trim() === back)) {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "The question already exists!",
            confirmButtonText: "OK"
        });
        return
    }
    let cardHtml = `
        <div class="card" onclick="flipCard(this)">
                    <div class="btns">
                        <button class="btn btn-sm" onclick="deleteCard(this)"><i class="fa fa-close fs-5 text-black"></i></button>
                        <button class="btn btn-sm" onclick="update(this)"><i class="fa fa-marker fs-6 text-black"></i></button>
                    </div>
                    <div class="front"><p>${front}</p></div>
                    <div class="back"><p>${back}</p></div>
                </div>
    `
    box.innerHTML += cardHtml
    document.getElementById("front").value = "";
    document.getElementById("back").value = "";

    let cards = JSON.parse(localStorage.getItem(key)) || []
    cards.push({ question: front, answer: back })
    localStorage.setItem(key, JSON.stringify(cards))
})

window.addEventListener('DOMContentLoaded', function () {
    let storedCards = JSON.parse(localStorage.getItem(key)) || [];
    let box = document.getElementById("box");

    storedCards.forEach(card => {
        box.innerHTML += `
                <div class="card" onclick="flipCard(this)">
                    <div class="btns">
                        <button class="btn btn-sm" onclick="deleteCard(this)"><i class="fa fa-close fs-5 text-black"></i></button>
                        <button class="btn btn-sm" onclick="update(this)"><i class="fa fa-marker fs-6 text-black"></i></button>
                    </div>
                    <div class="front"><p>${card.answer}</p></div>
                    <div class="back"><p>${card.question}</p></div>
                </div>
        `
    });
})

function flipCard(card) {
    card.classList.toggle("flip");
}

function deleteCard(button) {
    let card = button.closest(".card");
    let question = card.querySelector(".back p").innerText;
    let cards = JSON.parse(localStorage.getItem(key)) || [];

    let updatedCards = cards.filter(c => c.question !== question);
    localStorage.setItem(key, JSON.stringify(updatedCards));

    card.remove();
}

async function update(button) {
    let cardElement = button.closest(".card");
    let question = cardElement.querySelector(".back p").innerText;
    let answer = cardElement.querySelector(".front p").innerText;
    let cards = JSON.parse(localStorage.getItem(key)) || [];

    let cardIndex = cards.findIndex(c => c.question === question && c.answer === answer);

    if (cardIndex !== -1) {
        // Use SweetAlert to get the new question and answer
        const { value: newQuestion } = await Swal.fire({
            title: "أدخل السؤال الجديد:",
            input: "text",
            inputValue: cards[cardIndex].question,
            showCancelButton: true,
            confirmButtonText: "تحديث",
            cancelButtonText: "إلغاء"
        });

        if (newQuestion?.trim()) {
            cards[cardIndex].question = newQuestion;
            cardElement.querySelector(".back p").innerText = newQuestion;
        }

        const { value: newAnswer } = await Swal.fire({
            title: "أدخل الجواب الجديد:",
            input: "text",
            inputValue: cards[cardIndex].answer,
            showCancelButton: true,
            confirmButtonText: "تحديث",
            cancelButtonText: "إلغاء"
        });

        if (newAnswer?.trim()) {
            cards[cardIndex].answer = newAnswer;
            cardElement.querySelector(".front p").innerText = newAnswer;
        }

        localStorage.setItem(key, JSON.stringify(cards));
    }
}


document.getElementById('deleteAll').addEventListener('click', function () {
    document.getElementById('box').innerHTML = '';
    localStorage.removeItem(key);
})

document.getElementById('random').addEventListener('click', function () {
    let cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        // Reset all cards first
        cards.forEach(card => card.classList.remove('flip'));

        // Flip a random card
        let randomIndex = Math.floor(Math.random() * cards.length);
        flipCard(cards[randomIndex]);
    }
});