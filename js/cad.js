let pageKey = 'cadCards';

let btnCreate = document.getElementById("create");
let box = document.getElementById("box");

btnCreate.addEventListener("click", (event) => {
    event.preventDefault();

    let answer = document.getElementById("back").value.trim();
    let imageInput = document.getElementById("imageInput");
    let file = imageInput.files[0];

    if (!file && !answer) {
        alert("Please fill out all fields!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function () {
        let imageBase64 = file ? reader.result : "";

        let cardHTML = `
            <div class="card pt-2" onclick="flipCard(this)">
                <div class="btns">
                    <button onclick='deleteCard(this)' class="btn btn-sm"><i class="fa fa-close fs-5 text-black"></i></button>
                    <button onclick='maximizeCard(this)' class="btn btn-sm"><i class="fa fa-window-maximize"></i></button>
                </div>
                <div class="front"><p>${answer}</p></div>
                <div class="back"><img src="${imageBase64}" alt=""></div>
            </div>`;

        box.innerHTML += cardHTML;

        let cards = JSON.parse(localStorage.getItem(pageKey)) || [];
        cards.push({ answer, image: imageBase64 });
        localStorage.setItem(pageKey, JSON.stringify(cards));

        document.getElementById("back").value = "";
        imageInput.value = "";
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        reader.onload();
    }
});

window.addEventListener("DOMContentLoaded", () => {
    let storedCards = JSON.parse(localStorage.getItem(pageKey)) || [];
    let box = document.getElementById("box");

    storedCards.forEach(card => {
        let cardHTML = `
            <div class="card pt-2" onclick="flipCard(this)">
                <div class="btns">
                    <button onclick='deleteCard(this)' class="btn btn-sm"><i class="fa fa-close fs-5 text-black"></i></button>
                    <button onclick='maximizeCard(this)' class="btn btn-sm"><i class="fa fa-window-maximize"></i></button>
                </div>
                <div class="front"><p>${card.answer}</p></div>
                <div class="back"><img src="${card.image}" alt=""></div>
            </div>`;

        box.innerHTML += cardHTML;
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
    let answer = card.querySelector(".front p").innerText;
    let imageSrc = card.querySelector(".back img").src;

    let cards = JSON.parse(localStorage.getItem(pageKey)) || [];
    let updatedCards = cards.filter(c => c.answer !== answer || c.image !== imageSrc);

    localStorage.setItem(pageKey, JSON.stringify(updatedCards));
    card.remove();
}

function maximizeCard(button) {
    let card = button.closest(".card");
    card.classList.toggle("maximized");
}
